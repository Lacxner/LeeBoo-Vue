<template>
	<div>
		<!-- 系统配置信息表单 -->
		<el-form ref="systemConfigForm" :model="formData" label-width="80px" :rules="formRules" status-icon>
			<!-- 系统版本 -->
			<el-form-item label="系统版本">
				<el-tag type="info" effect="dark" size="small" v-if="formData.version">{{ formData.version }}</el-tag>
				<!-- GitHub链接 -->
				<el-link :underline="false" style="margin-left: 16px" href="https://github.com/Nyantocat/Leeboo" target="_blank">
					<i class="fa fa-github" style="font-size: 18px"></i>
					<span> 前往 GitHub 获取最新版本！</span>
				</el-link>
			</el-form-item>
			<!-- 公司名称 -->
			<el-form-item label="公司名称" prop="company" size="medium">
				<el-input v-model="formData.company" style="width: 400px"></el-input>
			</el-form-item>
			<!-- 通知 -->
			<el-form-item label="系统通知" prop="notice" size="medium">
				<div id="wangeditor" style="width: 980px"></div>
			</el-form-item>
		</el-form>
		
		<!-- 底部按钮 -->
		<el-button type="primary" @click="save" size="medium" :loading="saving">保 存</el-button>
	</div>
</template>

<script>
import * as SystemConfig from '@/api/systemConfig'
import * as Message from '@/utils/message'
import Wangeditor from 'wangeditor'

export default {
	data() {
		return {
			// 系统配置信息
			formData: {
				version: null,
				company: null
			},
			// 通知
			notice: {
				id: null,
				content: null
			},
			// 加载中提示
			loading: null,
			// 保存中提示
			saving: false,
			// 校验规则
            formRules: {
                company: [
                    { required: true, message: '公司名称不能为空！', trigger: 'blur' },
                    { min: 6, max: 18, message: '公司名称长度必须在6~18之间！',  trigger: 'blur' },
                    { pattern: /^[\w（）\u4e00-\u9fa5]{6,18}$/, message: '公司名称含有非法字符！', trigger: 'blur' }
                ]
			},
			// 
			editor: null
		}
	},
	mounted() {
		// 为了富文本编辑器的数据回显，需要先初始化该编辑器再设置数据
		this.initWangeditor()
		this.refreshSystemConfig()
	},
	methods: {
		/**
		 * 初始化wangeditor富文本编辑器
		 */
		initWangeditor() {
			this.editor = new Wangeditor('#wangeditor')
			// 设置文本占位符为空
			this.editor.config.placeholder = ''
			// 关闭粘贴样式的过滤
			this.editor.config.pasteFilterStyle = false
			// 忽略粘贴内容中的图片
			this.editor.config.pasteIgnoreImg = true
			// 关闭自动聚焦
			this.editor.config.focus = false
			// 设置表情
			this.editor.config.emotions = [
				{
					title: 'Emoji',  // tab 的标题
					type: 'emoji', // 'emoji' / 'image'
					// emoji 表情，content 是一个数组即可
					content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐 ❤️'.split(/\s/),
				}
			]
			this.editor.create()
		},
		/**
		 * 获取系统配置信息
		 */
		refreshSystemConfig(res) {
			SystemConfig.getSystemConfig()
			.then(response => {
				this.formData = response.data.systemConfig
				this.notice = response.data.notice
				this.editor.txt.html(this.notice.content)
				Message.handle(res)
				this.saving = false
			})
		},
		/**
		 * 保存系统配置信息
		 */
		save() {
			this.saving = true
			// 获取wangeditor富文本编辑器中的Html内容
			this.notice.content = this.editor.txt.html()
			SystemConfig.updateSystemConfig(this.formData)
			.then(response => {
				this.refreshSystemConfig(response)
			})
		}
	}
}
</script>

<style scoped>
.el-button {
    width: 100px;
}
</style>