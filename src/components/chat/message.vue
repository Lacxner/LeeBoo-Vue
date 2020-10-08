<template>
	<div id="message" v-scroll-bottom="sessions">
		<!-- 消息显示区域 -->
		<ul v-if="other">
			<li v-for="(session, index) in sessions[myself.username + '#' + other.username]" :key="index">
				<!-- 消息时间 -->
				<p class="time">
					<span>{{ session.date | time }}</span>
				</p>
				<!-- 头像和消息内容 -->
				<div class="main" :class="{ self: session.self }">
					<!-- <el-avatar shape="square" size="medium" :src="myself.avatar"></el-avatar> -->
					<img class="avatar" :src="session.self === true ? myself.avatar : other.avatar">
					<p class="text">{{ session.content }}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	data () {
		return {
			myself: JSON.parse(localStorage.getItem('user'))
		}
	},
	computed: mapState([
		'sessions',
		'other'
	]),
	filters: {
		time (date) {
			if (date) {
				date = new Date(date);
			}
			return `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
		}
	},
	directives: {/*这个是vue的自定义指令,官方文档有详细说明*/
			// 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
			'scroll-bottom' (el) {
			setTimeout(function () {
				el.scrollTop += 9999
			}, 1)
		}
	}
}
</script>

<style lang="scss" scoped>
ul {
	padding-left: 0px;
}
#message {
    padding: 15px;
    max-height: 68%;
    overflow-y: scroll;
    ul {
        list-style-type: none;
        li {
            margin-bottom: 15px;
        }
    }
    .time {
      text-align: center;
      margin: 7px 0;
      > span {
			display: inline-block;
			padding: 0 18px;
			font-size: 12px;
			color: #FFF;
			background-color: #dcdcdc;
			border-radius: 2px;
      	}
    }
    .main {
      .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
        width: 30px;
        height: 30px;

      }
      .text {
        display: inline-block;
        padding: 0 10px;
        max-width: 80%;
        background-color: #fafafa;
        border-radius: 4px;
        line-height: 30px;
      }
    }
    .self {
      text-align: right;
      .avatar {
        float: right;
        margin: 0 0 0 10px;
        border-radius: 3px;
        width: 30px;
        height: 30px;
      }
      .text {
        display: inline-block;
        padding: 0 10px;
        max-width: 80%;
		color: black;
        background-color: #8ac451;
        border-radius: 4px;
        line-height: 30px;
      }
    }
}
</style>
