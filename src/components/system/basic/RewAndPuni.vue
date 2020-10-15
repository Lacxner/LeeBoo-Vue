<template>
	<div id="container" class="container">
		<!-- 奖励列表 -->
		<el-card class="box-card" shadow="hover">
			<!-- 标题栏 -->
			<div slot="header" style="display: flex; justify-content: space-between">
				<span style="font-size: 22px">奖励</span>
				<el-button type="primary" size="small" @click="openDialog(true)" style="width: 80px">添加</el-button>
			</div>
			<!-- 遍历所有奖励 -->
			<div  v-if="rewards.length">
				<div v-for="reward in rewards" :key="reward.id" class="item" style="display: flex; justify-content: space-between">
					<div>
						<span class="title">{{ reward.name }}</span>
						<span>
							{{ reward.money }} 元
						</span>
					</div>
					<el-button type="danger" size="mini" @click="remove(false, punishment.id)" style="padding: 5px">删除</el-button>
				</div>
			</div>
			<div v-else>
				<div class="emptyTip">暂无内容</div>
			</div>
		</el-card>

		<!-- 处罚列表 -->
		<el-card class="box-card" style="margin-left: 20px" shadow="hover">
			<!-- 标题栏 -->
			<div slot="header" style="display: flex; justify-content: space-between">
				<span style="font-size: 22px">处罚</span>
				<el-button type="primary" size="small" @click="openDialog(false)" style="width: 80px">添加</el-button>
			</div>
			<!-- 遍历所有处罚 -->
			<div v-if="punishments.length">
				<div v-for="punishment in punishments" :key="punishment.id" class="item" style="display: flex; justify-content: space-between">
					<div>
						<span class="title">{{ punishment.name }}</span>
						<span>
							{{ punishment.money }} 元
						</span>
					</div>
					<el-button type="danger" size="mini" @click="remove(false, punishment.id)" style="padding: 5px">删除</el-button>
				</div>
			</div>
			<div v-else>
				<div class="emptyTip">暂无内容</div>
			</div>
		</el-card>

		<!-- 添加奖励或处罚对话框 -->
		<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" @closed="resetFormData">
			<!-- 表单 -->
			<el-form :model="formData" ref="rewAndPuniForm" :rules="formRules" status-icon label-width="52px">
				<!-- 名称 -->
				<el-form-item label="名称" prop="name" size="medium">
					<el-input type="input" v-model="formData.name" autocomplete="off"></el-input>
				</el-form-item>
				<!-- 金额 -->
				<el-form-item label="金额" prop="money" size="medium">
					<el-input-number v-model="formData.money" :min="0" :step="50" label="金额"></el-input-number>
				</el-form-item>
			</el-form>
			
			<!-- 对话框底部按钮 -->
			<span slot="footer">
				<el-button @click="dialogVisible = false" size="medium">取消</el-button>
				<el-button type="primary" @click="add" size="medium">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import * as RewAndPuni from '@/api/rewAndPuni'
import * as Message from '@/utils/message'

export default {
    data() {
        return {
			// 对话框标题
			dialogTitle: '添加奖励',
			// 是否打开对话框
			dialogVisible: false,
            // 添加奖励或处罚的表单数据
            formData: {
                name: null,
                money: 0
			},
			// 校验规则
            formRules: {
                name: [
                    { required: true, message: '名称不能为空！', trigger: 'blur' },
                    { min: 2, max: 8, message: '名称长度必须在2~8之间！',  trigger: 'blur' },
                    { pattern: /^[\w（）\u4e00-\u9fa5]{2,8}$/, message: '名称含有非法字符！', trigger: 'blur' }
                ],
                money: [
                    { required: true, message: '金额不能为空！', trigger: 'blur' }
                ]
			},
			// 加载中提示
			loading: false,
			// 所有奖励
			rewards: [],
			// 所有处罚
			punishments: [],
			// 判断当前添加的是奖励还是处罚
			isAddReward: true
        }	
    },
    mounted() {
		this.loading = this.$loading({
			lock: true,
			target: document.getElementById('container'),
			text: '加载中'
		})
		this.refreshAllRewardsAndPunishments()
    },
    methods: {
		/**
         * 获取所有的处罚
         */
        refreshAllRewardsAndPunishments(res) {
			RewAndPuni.getAllRewardsAndPunishments()
			.then(response => {
				this.rewards = response.data.rewards
				this.punishments = response.data.punishments
				Message.handle(res)
				this.loading.close()
			})
		},
		/**
		 * 打开对话框
		 */
		openDialog(isReward) {
			this.dialogVisible = true
			if (isReward) {
				this.dialogTitle = '添加奖励'
				this.isAddReward = true
			} else {
				this.dialogTitle = '添加处罚'
				this.isAddReward = false
			}
		},
		/**
		 * 添加奖励或处罚
		 */
		add() {
			this.$refs.rewAndPuniForm.validate((valid) => {
				if (valid) {
					this.dialogVisible = false
					this.loading = this.$loading({
						lock: true,
						target: document.getElementById('container'),
						text: '加载中'
					})

					if (this.isAddReward) {
						RewAndPuni.addReward(this.formData)
						.then(response => {
							this.refreshAllRewardsAndPunishments(response)
						})
					} else {
						RewAndPuni.addPunishment(this.formData)
						.then(response => {
							this.refreshAllRewardsAndPunishments(response)
						})
					}
				}
			})
		},
		// 删除奖励或处罚
		remove(isReward, id) {
			this.$confirm('是否确定要删除这条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
				this.loading = this.$loading({
					lock: true,
					target: document.getElementById('container'),
					text: '加载中'
				})

				if (isReward) {
					RewAndPuni.deleteRewardById(id)
					.then(response => {
						this.refreshAllRewardsAndPunishments(response)
					})
				} else {
					RewAndPuni.deletePunishmentById(id)
					.then(response => {
						this.refreshAllRewardsAndPunishments(response)
					})
				}
            }).catch(action => {})
		},
		/**
		 * 重置表单
		 */
		resetFormData() {
			this.$refs.rewAndPuniForm.resetFields()
		}
    }
}
</script>

<style scoped>
.container {
	margin-right: 10px;
	display: flex;
	justify-content: flex-start;
	height: 100%;
	padding-bottom: 20px;
}
.item {
    font-size: 14px;
    margin-bottom: 18px;
}
.title {
    color: #99a9bf;
    display: inline-block;
    font-size: 18px;
	margin-right: 15px;
}
.emptyTip {
	text-align: center;
	font-size: 22px;
	color: gray;
}
.box-card {
    width: 100%;
	border-radius: 8px;
}
</style>