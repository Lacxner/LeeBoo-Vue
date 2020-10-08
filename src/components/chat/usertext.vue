<template>
  <div id="uesrtext">
    <textarea placeholder="按 Enter 发送" v-model="content" @keyup="sendMessage"></textarea>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	data() {
		return {
			content: ''
		}
	},
	computed: mapState([
		'sessions',
		'other'
	]),
	methods: {
		sendMessage(e) {
			if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
				// 聊天消息的基本信息
				let message = {
					to: this.other.username,
					content: this.content,
					notSelf: false
				}
				// 发送消息
				this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(message))
				this.$store.commit('addMessage', message)
				// 重置聊天输入框内容
				this.content = ''
			}
		}
	}
}
</script>

<style lang="scss" scoped>
#uesrtext {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 30%;
	border-top: 1px solid #DDD;
	> textarea {
		padding: 10px;
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
	}
}
</style>
