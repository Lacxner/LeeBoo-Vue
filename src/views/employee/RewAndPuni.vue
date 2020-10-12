<template>
    <div>
        <!-- 顶部 -->
        <div>
            <el-input placeholder="请输入员工姓名" v-model="name" clearable style="width: 400px; text-align: center" size="medium"></el-input>
            <!-- 查找按钮 -->
            <el-button type="primary" @click="search" style="margin-left: 20px" size="medium" icon="el-icon-search" :loading="searching">查找</el-button>
        </div>

        <div id="list" style="width: 700px">
            <!-- 奖励列表 -->
            <el-card id="rewardCard" class="box-card" shadow="hover">
                <!-- 标题栏 -->
                <div slot="header" style="display: flex; justify-content: space-between">
                    <span style="font-size: 22px">奖励</span>
                    <el-button type="primary" size="small" @click="rewardDialogVisible = true" style="width: 80px" :disabled="!isSeach">添加</el-button>
                </div>
                <!-- 遍历所有奖励 -->
                <div v-if="employeeRewards && employeeRewards.length" style="display: flex; flex-wrap: wrap">
                    <el-row :gutter="20">
                        <el-col :span="6" v-for="(employeeReward, index) in employeeRewards" :key="index" style="margin-bottom: 20px">
                            <el-tag closable type="warning" effect="dark">
                                {{ employeeReward.name }}
                            </el-tag>
                        </el-col>
                    </el-row>
                </div>
                <div v-else>
                    <div class="emptyTip">暂无内容</div>
                </div>
            </el-card>

            <!-- 处罚列表 -->
            <el-card id="punishmentCard" class="box-card" shadow="hover">
                <!-- 标题栏 -->
                <div slot="header" style="display: flex; justify-content: space-between">
                    <span style="font-size: 22px">处罚</span>
                    <el-button type="primary" size="small" @click="punishmentDialogVisible = true" style="width: 80px" :disabled="!isSeach">添加</el-button>
                </div>
                <!-- 遍历所有处罚 -->
                <div v-if="employeePunishments && employeePunishments.length">
                    <el-row :gutter="20">
                        <el-col :span="6" v-for="(employeePunishment, index) in employeePunishments" :key="index" style="margin-bottom: 20px">
                            <el-tag  closable type="error" effect="dark">
                                {{ employeePunishment.name }}
                            </el-tag>
                        </el-col>
                    </el-row>
                </div>
                <div v-else>
                    <div class="emptyTip">暂无内容</div>
                </div>
            </el-card>
        </div>

        <!-- 添加奖励对话框 -->
        <el-dialog title="添加奖励" :visible.sync="rewardDialogVisible" width="500px" :close-on-click-modal="false" @closed="resetRewardFormData">
            <el-form :model="formData" ref="rewardForm" :rules="rewardFormRules" status-icon label-width="80px">
                <!-- 奖励类型 -->
                <el-form-item label="奖励类型" prop="id" size="medium">
                    <el-select v-model="formData.id" placeholder="请选择">
                        <el-option v-for="reward in rewards" :key="reward.id" :label="reward.name" :value="reward.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            
            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="rewardDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="addReward" size="medium">确定</el-button>
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
            // 查询的员工的名称
            name: null,
			// 是否打开添加奖励对话框
            rewardDialogVisible: false,
            // 是否打开添加处罚对话框
            punishmentDialogVisible: false,
            // 所查询的员工的id
            employeeId: null,
            // 添加奖励或处罚的id
            formData: {
                id: null
			},
			// 校验规则
            rewardFormRules: {
                id: [
                    { required: true, message: '请选择奖励！', trigger: 'blur' }
                ]
			},
			// 加载中提示
            loading: false,
            // 查找中提示
            searching: false,
			// 所有奖励
			rewards: [],
			// 所有处罚
            punishments: [],
            // 员工所拥有的奖励
            employeeRewards: [],
            // 员工所拥有的处罚
            employeePunishments: [],
            // 是否搜索了员工
            isSeach: false
        }	
    },
    mounted() {
        this.loading = this.$loading({
                lock: true,
                target: document.getElementById('list'),
                text: '加载中'
            })
        this.refreshAllRewardsAndPunishments()
    },
    methods: {
        /**
         * 获取所有的处罚
         */
        refreshAllRewardsAndPunishments() {
			RewAndPuni.getAllRewardsAndPunishments()
			.then(response => {
				this.rewards = response.data.rewards
                this.punishments = response.data.punishments
                this.loading.close()
                this.searching = false
			})
        },
        refreshRewardsAndPunishmentsByEmployeeName(res) {
            RewAndPuni.getRewardsAndPunishmentsByEmployeeName(this.name)
			.then(response => {
				this.employeeRewards = response.data.employeeRewards
                this.employeePunishments = response.data.employeePunishments
                this.employeeId = response.data.id
                if (this.name) {
                    Message.handle(res)
                } else {
                    Message.handle(response)
                }
                this.loading.close()
                this.searching = false
			})
        },
		/**
         * 查询员工所拥有的奖励和处罚
         */
        search(res) {
            this.loading = this.$loading({
                lock: true,
                target: document.getElementById('list'),
                text: '加载中'
            })
            this.searching = true

            if (this.name == null || this.name === '') {
                this.isSeach = false
                this.name = null
            } else {
                this.isSeach = true
            }
            this.refreshRewardsAndPunishmentsByEmployeeName()
        },
		/**
		 * 添加奖励或处罚
		 */
		addReward() {
			this.$refs.rewardForm.validate((valid) => {
				if (valid) {
					this.rewardDialogVisible = false
					this.loading = this.$loading({
						lock: true,
						target: document.getElementById('rewardCard'),
						text: '加载中'
                    })
                    
                    RewAndPuni.addEmployeeReward(this.employeeId, this.formData.id)
                    .then(response => {
                        this.refreshRewardsAndPunishmentsByEmployeeName(response)
                    })
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
					target: document.getElementById('list'),
					text: '加载中'
				})

				if (isReward) {
					RewAndPuni.deleteRewardById(id)
					.then(response => {
						this.search(response)
					})
				} else {
					RewAndPuni.deletePunishmentById(id)
					.then(response => {
						this.search(response)
					})
				}
            }).catch(action => { })
		},
		/**
		 * 重置表单
		 */
		resetRewardFormData() {
			this.$refs.rewardForm.resetFields()
		}
    }
}
</script>

<style scoped>
.container {
	margin-right: 10px;
	display: flex;
	justify-content: flex-start;
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
    margin-top: 20px;
    width: 700px;
}
</style>