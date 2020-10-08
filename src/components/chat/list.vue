<template>
  <div id="list">
		<!-- 聊天好友列表 -->
		<ul>
			<li v-for="hr in hrs" :key="hr.id" @click="changeSession(hr)"
			:class="{ active: other != null ? hr.name === other.name : false }">
				<!-- 好友头像 -->
				<el-avatar shape="square" size="medium" :src="hr.avatar"></el-avatar>
				<!-- 好友名称 -->
				<p class="name">{{ hr.name }}</p>
			</li>
		</ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	computed: mapState([
		'hrs',
		'other'
	]),
	methods: {
		changeSession(hr) {
			this.$store.commit('changeSession', hr)
		}
	}
}
</script>

<style lang="scss" scoped>
ul {
	padding-left: 0px;
}
#list {
	li {
		padding: 0px 15px;
		border-bottom: 1px solid #292C33;
		list-style: none;
		display: flex;
		align-items: center;
		cursor: pointer;
		&:hover {
			background-color: rgba(255, 255, 255, 0.03);
		}
	}
  	li.active {
			background-color: rgba(255, 255, 255, 0.1);
	}
	.name {
		display: inline-block;
		margin-left: 15px;
	}
}
</style>
