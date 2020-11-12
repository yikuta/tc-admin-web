<template>
  <div class="sku-list-container section">
    <div class="spec-item" v-for="spec in effectiveSpecList" :key="spec.id">
      <span class="label">{{spec.name}}:</span>
      <div class="tags-list">
        <div class="tag-item"
             v-for="tag in spec.tags"
             :key="tag.id"
        >
          <div class="text" v-text="tag.name"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SpecList',
    props: {
      size: {
        type: String,
        default: 'small'
      },
      effectiveSpecList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  .sku-list-container {

    .spec-item {
      padding: 10px 10px 0;
      display: grid;
      grid-template-columns: 48px auto;
      grid-gap: 3px;
      font-weight: 400;

      .label {
        display: inline-block;
        vertical-align: top;
        line-height: 32px;
        width: 80px;
      }

      .tags-list {
        display: inline-block;
        vertical-align: top;

        .tag-item {
          background-color: #f8f8f8;
          border: 1px solid #f8f8f8;
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
            display: block;
            width: 74px;
            margin: 0 auto;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          &:hover {
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
  }
</style>
