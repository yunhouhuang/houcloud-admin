<template>
  <transition name="topper">
    <div v-if="showTopper" class="topper">
      <t-button shape="circle" theme="primary" @click="handleToTop">
        <template #icon>
          <arrow-up-icon size="20" />
        </template>
      </t-button>
    </div>
  </transition>
</template>

<script setup lang="ts" name="Topper">
import { ArrowUpIcon } from 'tdesign-icons-vue-next';
import { onMounted, PropType, ref } from 'vue';
import scrollTo from '@/utils/scroll';

const showTopper = ref(false);
const handleScroll = () => {
  showTopper.value = window.scrollY + 200 > window.innerHeight;
};

const props = defineProps({
  target: {
    type: Object as PropType<any>,
    default: null,
  },
  duration: {
    type: Number as PropType<number>,
    default: 400,
  },
});
const domRef = ref();
const getDefaultTarget = () => (domRef.value && domRef.value.ownerDocument ? domRef.value.ownerDocument : window);
const { target = getDefaultTarget, duration } = props;
const handleToTop = () => {
  console.log('回到顶部');
  scrollTo(0, {
    getContainer: target || getDefaultTarget,
    duration,
  });
  // window.scrollTo({ top: 0 });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
</script>

<style lang="less" scoped>
.topper-enter,
.topper-leave-to {
  opacity: 0;
}
.topper-enter-to,
.topper-leave {
  opacity: 1;
}
.topper-enter-active,
.topper-leave-active {
  transition: all 1s;
}

.topper {
  z-index: 9999;
  position: fixed;
  bottom: 100px;
  right: 50px;
  button {
    height: 45px;
    width: 45px;
    border-radius: 25px;
  }
}

@media (max-width: var(--tdvns-screen-sm-max)) {
  .topper {
    bottom: 100px;
    right: 20px;
    button {
      height: 45px;
      width: 45px;
      border-radius: 25px;
    }
  }
}
</style>
