<template>
  <div class="coupon-phone-boxx">
    <phone-box>
      <vue-draggable v-model="moduleList">
        <div v-for="(item, index) in moduleList" :key="index" @click="handleEdit(item)" class="view-list" :class="{ active: item.moduleIndex === moduleActiveIndex }">
          <title-view v-if="item.module === 'title'" :config="item" />
          <editor-view v-if="item.module === 'editor'" :config="item" />
          <divider-view v-if="item.module === 'divider'" :config="item" />
          <blank-view v-if="item.module === 'blank'" :config="item" />
          <video-view v-if="item.module === 'video'" :config="item" />
          <div class="delete" @click.stop="handleDelete(item, index)">删除</div>
        </div>
      </vue-draggable>
    </phone-box>
  </div>
</template>
<script>
import VueDraggable from 'vuedraggable'
import PhoneBox from '@/components/PhoneBox/index'
export default {
  name: 'GoodsInfoDetail',
  components: {
    PhoneBox,
    VueDraggable
  },
  data() {
    return {
      moduleList: [] // 内容列表
    }
  }
}
</script>