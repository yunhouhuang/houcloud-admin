<template>
  <t-popup v-model:visible="showNoticePopup" expand-animation placement="bottom-right" trigger="click">
    <template #content>
      <div class="header-msg">
        <div class="header-msg-top">
          <p>通知</p>
          <t-button v-if="unreadMsgNum > 0" class="clear-btn" variant="text" theme="primary" @click="setRead('all')"
            >本页已读</t-button
          >
        </div>
        <t-list v-if="unreadMsgNum > 0" class="narrow-scrollbar" :split="true">
          <t-list-item v-for="(item, index) in noticeList" :key="index">
            <div @click="goDetail">
              <text-line bold :text="item.title" />
              <text-line :text="item.content" />
              <text-line font-size="12" :text="parseType(item.type)" />
            </div>
            <text-line class="msg-time" font-size="12" :text="diffDate(item.created)" />
            <template #action>
              <t-button size="small" variant="outline" @click="setRead('radio', item)"> 设为已读 </t-button>
            </template>
          </t-list-item>
        </t-list>

        <div v-else class="empty-list">
          <img src="https://tdesign.gtimg.com/pro-template/personal/nothing.png" alt="空" />
          <p>暂无通知</p>
        </div>
        <div class="header-msg-bottom">
          <a class="header-msg-bottom-link" @click="goDetail"
            ><div class="dpr-center-center"><span>消息中心</span> <chevron-right-icon size="14" /></div
          ></a>
        </div>
      </div>
    </template>
    <t-badge :count="unreadMsgNum" :offset="[15, 21]">
      <t-button theme="default" shape="circle" variant="text">
        <mail-icon />
      </t-button>
    </t-badge>
  </t-popup>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { ChevronRightIcon, MailIcon } from 'tdesign-icons-vue-next';
import { NotificationItem } from '@/types/interface';
import TextLine from '@/components/text-line/index.vue';
import { getNoticesApi, readNoticeApi } from '@/api/personal';
import { diffDate } from '@/utils/time';

const router = useRouter();
const unreadMsgNum = ref(0);
const parseType = (type) => {
  switch (type) {
    case 'sys':
      return '系统消息';
    case 'chat':
      return '聊天消息';
    default:
      return '-';
  }
};
const showNoticePopup = ref(false);
const goDetail = () => {
  showNoticePopup.value = false;
  router.push('/personal/notice');
};
const query = ref({
  type: 'unread',
  limit: 10,
  page: 1,
});
const noticeList = ref([]);
const loadNotices = () => {
  getNoticesApi(query.value).then((res) => {
    if (res.success) {
      noticeList.value = res.result.records;
      unreadMsgNum.value = res.result.total;
    }
  });
};
const setRead = (type: string, item?: NotificationItem) => {
  const idList = [];
  if (type === 'all') {
    noticeList.value.forEach((item) => {
      idList.push(item.id);
    });
  } else {
    idList.push(item.id);
  }
  readNoticeApi({ ids: idList }).then((res) => {
    if (res.success) {
      loadNotices();
    }
  });
};
onMounted(() => {
  loadNotices();
});
</script>

<style lang="less" scoped>
.header-msg {
  width: 400px;
  height: 500px;

  .empty-list {
    height: calc(100% - 104px);
    text-align: center;
    padding-top: 135px;
    font-size: 14px;
    color: var(--td-text-color-secondary);

    img {
      width: 63px;
    }

    p {
      margin-top: 30px;
    }
  }

  &-top {
    position: relative;
    height: 56px;
    font-size: 16px;
    color: var(--td-text-color-primary);
    text-align: center;
    line-height: 56px;
    border-bottom: 1px solid var(--td-component-border);

    .clear-btn {
      position: absolute;
      top: 12px;
      right: 24px;
    }
  }

  &-bottom {
    height: 48px;
    align-items: center;
    display: flex;
    justify-content: center;

    &-link {
      text-decoration: none;
      font-size: 14px;
      color: var(--td-brand-color);
      line-height: 48px;
      cursor: pointer;
    }
  }

  .t-list {
    height: calc(100% - 104px);
  }

  .t-list-item {
    overflow: hidden;
    width: 100%;
    padding: 16px 24px;
    border-radius: @border-radius;
    font-size: 14px;
    color: var(--td-text-color-primary);
    line-height: 22px;
    cursor: pointer;

    &:hover {
      transition: background 0.2s ease;
      background: var(--td-bg-color-container)-hover;

      .msg-content {
        color: var(--td-brand-color);
      }

      .t-list-item_Action {
        button {
          bottom: 16px;
          opacity: 1;
        }
      }

      .msg-time {
        bottom: -6px;
        opacity: 0;
      }
    }

    .msg-content {
      margin-bottom: 16px;
    }

    .msg-type {
      color: var(--td-text-color-secondary);
    }

    .t-list-item_Action {
      button {
        opacity: 0;
        position: absolute;
        right: 24px;
        bottom: -6px;
      }
    }

    .msg-time {
      transition: all 0.2s ease;
      opacity: 1;
      position: absolute;
      right: 24px;
      bottom: 16px;
      color: var(--td-text-color-secondary);
    }
  }
}

.t-button {
  margin: 0 8px;

  .t-icon {
    font-size: 20px;
    &.general {
      margin-right: 16px;
    }
  }
}
</style>
