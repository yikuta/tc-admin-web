<template>
  <section class="spec-container section">
    <div class="spec-group" v-for="(spec, spec_index) in specList" :key="spec.id">
      <div class="spec-title">
        <span class="label">规格名：</span>
        <template v-if="!spec.isEdit">
          <span class="spec-name" v-text="spec.name"></span>
          <i class="el-icon-edit" @click="handleEditSpec(spec_index)"></i>
        </template>
        <template v-if="spec.isEdit">
          <el-autocomplete
            class="input"
            :size="size"
            v-model.trim="spec.name"
            :fetch-suggestions="querySearchAsync"
            :trigger-on-focus="false"
            value-key="name"
            @select="(item) => handleSelect(spec_index, item)"
            placeholder="请输入规格名"
            @keyup.native.enter='handleSaveSpec(spec_index)'
          >
            <i
              :class="spec.id ? 'el-icon-check el-input__icon' : 'el-icon-plus el-input__icon'"
              slot="suffix"
              @click.stop="handleSaveSpec(spec_index)"></i>
            <i
              v-if="spec.id"
              class="el-icon-close el-input__icon"
              slot="suffix"
              @click.stop="handleCancelEditSpec(spec_index)"></i>
          </el-autocomplete>
        </template>
        <span v-if="!noModify" class="remove-icon" @click.stop="handleDeleteSpec(spec_index)">×</span>
      </div>
      <div class="spec-tags">
        <span class="label">规格值：</span>
        <div class="tags-list">
          <template v-for="(tag, tag_index) in spec.tags">
            <div
              class="tag-item"
              v-if="!tag.isEdit"
              :key="tag.id"
              :class="{ active: tag.selected }"
              @click.prevent.stop="handleToggleSelected(spec_index, tag_index)"
            >
              <div class="text">{{tag.name}}<i class="el-icon-edit" @click.stop="handleEditTag(spec_index, tag_index)"></i></div>
              <span class="remove-icon" @click.prevent.stop="handleDeleteTag(spec_index, tag_index)">×</span>
            </div>
            <el-input
              v-if="tag.isEdit"
              :key="tag.id"
              :size="size"
              class="input"
              v-model.trim="tag.name"
              placeholder="请输入规格值"
              style="margin-right: 12px"
              @keyup.native.enter='handleSaveEditTag(spec_index, tag_index)'
            >
              <i
                :class="'el-icon-check el-input__icon'"
                slot="suffix"
                @click.stop="handleSaveEditTag(spec_index, tag_index)"></i>
              <i
                class="el-icon-close el-input__icon"
                slot="suffix"
                @click.stop="handleCancelEditTag(spec_index, tag_index)"></i>
            </el-input>
          </template>
          <el-input
            v-if="spec.tags.length < maxTagLength"
            class="input"
            :size="size"
            placeholder="多个产品属性以空格隔开"
            v-model="newTags[spec_index]"
            @keyup.native.enter='handleAddTags(spec_index)'
          >
            <i
              class="el-icon-plus el-input__icon"
              slot="suffix"
              @click="handleAddTags(spec_index)">
            </i>
          </el-input>
        </div>
      </div>
    </div>
    <div class="spec-title">
      <el-button v-if="!noModify" icon="el-icon-plus" :size="size" type="primary" :disabled='specAddDisabled' @click='handleAddSpec'>添加规格项目</el-button>
    </div>
  </section>
</template>
<script>
  import { createUniqueString, uniqueArr } from '../util'
  import { MAX_TAG_LENGTH, MAX_SPEC_LENGTH, MAX_SPEC_NAME_LENGTH, MAX_TAG_NAME_LENGTH } from '../config'
  export default {
    name: 'specList',
    props: {
      noModify: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'small'
      },
      specList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        maxSpecLength: MAX_SPEC_LENGTH,
        maxTagLength: MAX_TAG_LENGTH,
        newSpec: [], // 用来存储添加的规格组
        newTags: [], // 用来存储要添加的规格属性,
        specNameTemp: '',
        tagNameTemp: ''
      }
    },
    computed: {
      specAddDisabled: function() {
        return this.specList.length >= this.maxSpecLength
      }
    },
    methods: {
      centralProcessing(type, spec_index, tag_index) {
        this.$emit('change', { type, spec_index, tag_index })
      },
      querySearchAsync(queryString, callback) {
        if (this.$parent.fetchSuggestions) {
          this.$parent.fetchSuggestions(queryString.trim(), callback)
        } else {
          callback([])
        }
      },
      handleSelect(spec_index, item) {
        this.specList[spec_index].id = item.id
        this.specList[spec_index].tags = item.tags
        this.specList[spec_index].isEdit = false
      },
      // 验证规格名是否合法及重复
      validateSpec(spec_index) {
        const name = this.specList[spec_index].name
        if (!name) {
          this.$message.warning('请先输入规格名')
          return false
        }
        if (name.length > MAX_SPEC_NAME_LENGTH) {
          this.$message.warning(`输入规格名不超过${MAX_SPEC_NAME_LENGTH}个字符`)
          return false
        }
        const isExist = this.specList.some((item, index) => (index !== spec_index && item.name === name))
        if (isExist) {
          this.$message.warning('规格名重复')
          return false
        }
        return true
      },
      // 验证规格值是否合格
      validateTag(spec_index, tag_name) {
        if (!tag_name) {
          this.$message.warning('请先输入规格值')
          return false
        }
        if (tag_name.length > MAX_TAG_NAME_LENGTH) {
          this.$message.warning(`输入规格值名称不超过${MAX_TAG_NAME_LENGTH}个字符`)
          return false
        }
        // 如果是编辑的选项，直接返回 false，否则判断是否相同
        const isExist = (this.specList[spec_index].tags || []).some((tag) => {
          return tag.isEdit ? false : tag.name === tag_name
        })
        if (isExist) {
          this.$message.warning('规格值重复')
          return false
        }
        return true
      },
      // 删除规格组
      handleDeleteSpec(spec_index) {
        this.specList.splice(spec_index, 1)
        this.centralProcessing('delete_spec', spec_index)
      },
      // 编辑规格名
      handleEditSpec(spec_index) {
        this.specNameTemp = this.specList[spec_index].name
        this.specList[spec_index].isEdit = true
      },
      // 取消编辑规格名
      handleCancelEditSpec(spec_index) {
        this.specList[spec_index].isEdit = false
        this.specList[spec_index].name = this.specNameTemp
        this.specNameTemp = ''
      },
      // 添加规格组
      handleAddSpec() {
        this.specList.push({ isEdit: true, name: null, tags: [] })
      },
      // 保存规格组
      handleSaveSpec(spec_index) {
        if (this.validateSpec(spec_index)) {
          this.specList[spec_index].isEdit = false
          if (this.specList[spec_index].id) {
            this.centralProcessing('edit_spec', spec_index)
          } else {
            this.specList[spec_index].id = createUniqueString() + '_spec_id'
            this.centralProcessing('add_spec', spec_index)
          }
        }
      },
      // 切换规格值选中状态
      handleToggleSelected(spec_index, tag_index) {
        const selected = this.specList[spec_index].tags[tag_index].selected
        this.$set(this.specList[spec_index].tags[tag_index], 'selected', !selected)
        this.centralProcessing(selected ? 'delete_tag' : 'add_tag', spec_index, tag_index)
      },
      // 删除规格值
      handleDeleteTag(spec_index, tag_index) {
        this.specList[spec_index].tags.splice(tag_index, 1)
        this.centralProcessing('delete_tag', spec_index, tag_index)
      },
      // 编辑规格值
      handleEditTag(spec_index, tag_index) {
        this.tagNameTemp = this.specList[spec_index].tags[tag_index].name
        this.$set(this.specList[spec_index].tags[tag_index], 'isEdit', true)
      },
      // 保存编辑规格值
      handleSaveEditTag(spec_index, tag_index) {
        if (this.validateTag(spec_index, this.specList[spec_index].tags[tag_index].name)) {
          this.$set(this.specList[spec_index].tags[tag_index], 'isEdit', false)
          this.specNameTemp = ''
          this.centralProcessing('edit_tag', spec_index, tag_index)
        }
      },
      // 取消规格值保存
      handleCancelEditTag(spec_index, tag_index) {
        this.specList[spec_index].tags[tag_index].isEdit = false
        this.specList[spec_index].tags[tag_index].name = this.tagNameTemp
        this.specNameTemp = ''
      },
      // 添加规格值
      handleAddTags(spec_index) {
        if (!this.specList[spec_index].isEdit) { // 标题标记状态中
          let newTagsStr = (this.newTags[spec_index] || '').trim()
          if (newTagsStr) { // 存在才添加
            const oldTags = this.specList[spec_index].tags
            let newTagsArr = uniqueArr(newTagsStr.split(/\s+/)) // 使用空格分割成数组
            // 不符合tag验证条件不执行添加操作
            if (!newTagsArr.every(name => this.validateTag(spec_index, name))) return
            // 把 name 转成对象，id 设置为自动生成
            newTagsArr = newTagsArr.map(name => ({
              id: createUniqueString() + '_tag_id',
              name: name,
              selected: false
            }))

            if (newTagsArr.length <= this.maxTagLength - oldTags.length) {
              this.specList[spec_index].tags = [...oldTags, ...newTagsArr]
              this.$set(this.newTags, spec_index, '') // 清空newTags
            } else {
              this.$message.warning('每组规格最多10个规格值，请删掉部分规格值')
            }
          }
        } else {
          this.$message.warning('请先保存规格名')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .spec-container {
    /deep/ .el-icon-plus.el-input__icon {
      cursor: pointer;
    }

    .spec-title {
      padding: 7px 10px;
      background-color: #f8f8f8;
      line-height: 16px;
      font-weight: 400;
    }

    .spec-group {
      &:first-child {
        margin-top: 10px;
      }

      .spec-title {
        position: relative;

        .spec-name {
          font-size: 13px;
          line-height: 32px;
        }

        .input {
          width: 200px
        }

        .remove-icon {
          display: none;
          position: absolute;
          top: 12px;
          right: 10px;
          z-index: 2;
          width: 18px;
          height: 18px;
          font-size: 14px;
          line-height: 16px;
          color: #fff;
          text-align: center;
          cursor: pointer;
          background: rgba(0,0,0,.3);
          border-radius: 50%;
        }
      }

      .spec-tags {
        padding: 10px 10px 0;
        display: grid;
        grid-template-columns: 48px auto;
        grid-gap: 3px;

        .label {
          display: inline-block;
          vertical-align: top;
          line-height: 32px;
        }

        .tags-list {
          display: inline-block;
          vertical-align: top;

          .tag-item {
            background: #FFF;
            border: 1px solid #DCDFE6;
            padding: 9px 10px;
            display: inline-block;
            margin-right: 10px;
            margin-bottom: 10px;
            vertical-align: middle;
            text-align: center;
            position: relative;
            border-radius: 2px;
            cursor: pointer;

            &.active {
              border: 1px solid #409eff;
              color: #409eff;
            }

            .operates {
              display: none;
              position: absolute;
              left: 0;
              top: 0;
              padding: 4px 4px;
              z-index: 2;
              /*width: 48px;*/
              width: 20px;
              height: 21px;
              font-size: 12px;
              line-height: 12px;
              color: #fff;
              text-align: center;
              background: rgba(0,0,0,.3);

              .edit-icon, .delete-icon {
                display: inline-block;
                vertical-align: middle;
                cursor: pointer;
              }

              /deep/ .el-divider--vertical {
                margin: 0 3px;
              }
            }

            .remove-icon {
              display: none;
              position: absolute;
              top: -5px;
              right: -5px;
              z-index: 2;
              width: 14px;
              height: 14px;
              font-size: 12px;
              line-height: 12px;
              color: #fff;
              text-align: center;
              cursor: pointer;
              background: rgba(0,0,0,.3);
              border-radius: 50%;
            }

            .text {
              height: 12px;
              line-height: 12px;
              display: block;
              width: 74px;
              margin: 0 auto;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              .el-icon-edit {
                display: none;
                margin-left: 2px;
              }
            }

            &:hover {
              .operates {
                display: block;
              }
              .text {
                .el-icon-edit {
                  display: inline-block;
                }
              }
              .remove-icon {
                display: block;
              }
            }
          }

          .input {
            width: 250px;
            margin-bottom: 10px;
            vertical-align: top;
          }
        }
      }

      &:hover {
        .spec-title .remove-icon {
          display: block !important;
        }
      }
    }
  }
</style>
