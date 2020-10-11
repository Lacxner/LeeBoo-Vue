<template>
	<div>
		<!-- 系统配置信息表单 -->
		<el-form ref="systemConfigForm" id="systemConfigForm" :model="formData" label-width="80px" :rules="formRules" status-icon>
			<!-- 系统版本 -->
			<el-form-item label="系统版本">
				<el-tag type="info" effect="dark" size="small">{{ formData.version }}</el-tag>
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
		</el-form>
		
		<!-- 底部按钮 -->
		<el-button type="primary" @click="save" size="medium" :loading="saving">保 存</el-button>
	</div>
</template>

<script>
import * as SystemConfig from '@/api/systemConfig'
import * as Message from '@/utils/message'

export default {
	data() {
		return {
			// 系统配置信息
			formData: {
				version: null,
				company: null
			},
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
		}
	},
	mounted() {
		this.refreshSystemConfig()
	},
	methods: {
		/**
		 * 获取系统配置信息
		 */
		refreshSystemConfig(res) {
			SystemConfig.getSystemConfig()
			.then(response => {
				this.formData = response.data.item
				Message.handle(res)
				this.saving = false
			})
		},
		/**
		 * 保存系统配置信息
		 */
		save() {
			this.saving = true
			SystemConfig.updateSystemConfig(this.formData)
			.then(response => {
				this.refreshSystemConfig(response)
			})
		}
	}
}
</script>