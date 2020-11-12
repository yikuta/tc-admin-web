import Layout from '@/pages/layout/Layout'

const message = {
  path: '/message',
  component: Layout,
  redirect: '/message/message-note',
  name: 'message',
  auth: 'MSG_CENTER',
  meta: { title: '消息管理', icon: 'order-manage' },
  children: [
    {
      path: 'messageNote',
      name: 'messageNoteTemplate',
      auth: 'MSG_SM_TEMP',
      component: () => import('@/pages/message/message-note/messageNoteTemplate'),
      meta: { title: '短信消息' },
      keepAlive: true
    },
    {
      path: 'messageNoteList',
      name: 'messageNoteList',
      auth: 'MSG_SMS_TASK_LIST_VIEW',
      component: () => import('@/pages/message/message-note/messageNoteList'),
      meta: { title: '短信列表' },
      keepAlive: true,
      hidden: true
    },
    {
      path: 'messageNoteLog',
      name: 'messageNoteLog',
      auth: 'MSG_SM_SEND_LOG',
      component: () => import('@/pages/message/message-note-log'),
      meta: { title: '短信记录' },
      keepAlive: true
    },
    {
      path: 'messageMail',
      name: 'messageMailTemplate',
      auth: 'MSG_TIPS_TEMP',
      component: () => import('@/pages/message/message-mail/index'),
      meta: { title: '站内信' },
      keepAlive: true
    },
    {
      path: 'messageMailList',
      name: 'messageMailList',
      auth: 'MSG_TIPS_TASK_LIST_VIEW',
      component: () => import('@/pages/message/message-mail/messageMailList'),
      meta: { title: '站内信列表' },
      keepAlive: true,
      hidden: true
    },
    {
      path: 'messageMailLog',
      name: 'messageMailLog',
      auth: 'MSG_TIPS_SEND_LOG',
      component: () => import('@/pages/message/message-mail-log'),
      meta: { title: '站内信记录' },
      keepAlive: true
    },
    {
      path: 'messageLog',
      name: 'messageLog',
      component: () => import('@/pages/message/message-log'),
      meta: { title: '操作日志' },
      keepAlive: true,
      hidden: true
    },
    {
      path: 'messageTemplateLog',
      name: 'messageTemplateLog',
      component: () => import('@/pages/message/message-template-log'),
      meta: { title: '操作日志' },
      keepAlive: true,
      hidden: true
    },
    {
      path: 'messageAdd',
      name: 'messageAdd',
      component: () => import('@/pages/message/message-add'),
      meta: { title: '新建信息' },
      keepAlive: true,
      hidden: true
    },
    {
      path: 'messagePushText',
      name: 'messagePushTextTemplate',
      auth: 'MSG_TEXT_TEMP',
      component: () => import('@/pages/message/message-push-text/index'),
      meta: { title: '文字push' },
      keepAlive: true
    },
    {
      path: 'messagePushTextList',
      name: 'messagePushTextList',
      auth: 'MSG_TEXT_TASK_LIST_VIEW',
      component: () => import('@/pages/message/message-push-text/messagePushTextList'),
      meta: { title: 'push消息(文字)列表' },
      keepAlive: true,
      hidden: true
    },
    {
      path: 'messagePushTextLog',
      name: 'messagePushTextLog',
      auth: 'MSG_TEXT_SEND_LOG',
      component: () => import('@/pages/message/message-push-text-log'),
      meta: { title: '文字push记录' },
      keepAlive: true
    },
    {
      path: 'messagePushAudio',
      name: 'messagePushAudioTemplate',
      auth: 'MSG_AUDIO_TEMP',
      component: () => import('@/pages/message/message-push-audio/index'),
      meta: { title: '语音push' },
      keepAlive: true
    },
    {
      path: 'messagePushAudioList',
      name: 'messagePushAudioList',
      auth: 'MSG_AUDIO_TASK_LIST_VIEW',
      component: () => import('@/pages/message/message-push-audio/messagePushAudioList'),
      meta: { title: 'push消息(语音)列表' },
      keepAlive: true,
      hidden: true
    },
    {
      path: 'messagePushAudioLog',
      name: 'messagePushAudioLog',
      auth: 'MSG_AUDIO_SEND_LOG',
      component: () => import('@/pages/message/message-push-audio-log'),
      meta: { title: '语音push记录' },
      keepAlive: true
    },
    {
      path: 'messageSetting',
      name: 'messageSetting',
      component: () => import('@/pages/message/message-setting'),
      meta: { title: '消息设置' },
      keepAlive: true
    }
  ]
}
export default message
