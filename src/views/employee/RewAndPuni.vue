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
                    <el-button type="primary" size="small" @click="rewardDialogVisible = true" style="width: 80px" :disabled="!isSeach" :loading="rewardAdding">添加</el-button>
                </div>
                <!-- 遍历所有奖励 -->
                <div v-if="employeeRewards && employeeRewards.length" style="display: flex; flex-wrap: wrap">
                    <el-tag v-for="(employeeReward, index) in employeeRewards" :key="index" style="margin-bottom: 20px; margin-right: 20px"
                    closable type="warning" effect="dark" @close="removeReward(employeeReward)">
                        {{ employeeReward.name }}
                    </el-tag>
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
                    <el-button type="primary" size="small" @click="punishmentDialogVisible = true" style="width: 80px" :disabled="!isSeach" :loading="punishmentAdding">添加</el-button>
                </div>
                <!-- 遍历所有处罚 -->
                <div v-if="employeePunishments && employeePunishments.length">
                    <el-tag v-for="(employeePunishment, index) in employeePunishments" :key="index" style="margin-bottom: 20px; margin-right: 20px"
                    closable type="danger" effect="dark" @close="removePunishment(employeePunishment)">
                        {{ employeePunishment.name }}
                    </el-tag>
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

        <!-- 添加处罚对话框 -->
        <el-dialog title="处罚奖励" :visible.sync="punishmentDialogVisible" width="500px" :close-on-click-modal="false" @closed="resetPunishmentFormData">
            <el-form :model="formData" ref="punishmentForm" :rules="punishmentFormRules" status-icon label-width="80px">
                <!-- 处罚类型 -->
                <el-form-item label="处罚类型" prop="id" size="medium">
                    <el-select v-model="formData.id" placeholder="请选择">
                        <el-option v-for="punishment in punishments" :key="punishment.id" :label="punishment.name" :value="punishment.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            
            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="punishmentDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="addPunishment" size="medium">确定</el-button>
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
			// 奖励的校验规则
            rewardFormRules: {
                id: [
                    { required: true, message: '请选择奖励！', trigger: 'blur' }
                ]
            },
            // 处罚的校验规则
            punishmentFormRules: {
                id: [
                    { required: true, message: '请选择处罚！', trigger: 'blur' }
                ]
			},
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
            isSeach: false,
            // 奖励添加中提示
            rewardAdding: false,
            // 处罚添加中提示
            punishmentAdding: false,
        }	
    },
    created() {
        this.refreshAllRewardsAndPunishments()
    },
    methods: {
        /**
         * 获取所有的奖励和处罚
         */
        refreshAllRewardsAndPunishments() {
			RewAndPuni.getAllRewardsAndPunishments()
			.then(response => {
				this.rewards = response.data.rewards
                this.punishments = response.data.punishments
                this.searching = false
			})
        },
        /**
         * 根据员工姓名获取其所有的奖励和处罚
         */
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
                this.rewardAdding = false
                this.punishmentAdding = false
                this.searching = false
                if (this.employeeId) {
                    this.isSeach = true
                } else {
                    this.isSeach = false
                }
			})
        },
		/**
         * 查询员工所拥有的奖励和处罚
         */
        search(res) {
            this.searching = true
            this.name = this.name === '' ? null : this.name
            this.refreshRewardsAndPunishmentsByEmployeeName()
        },
		/**
		 * 添加奖励
		 */
		addReward() {
			this.$refs.rewardForm.validate((valid) => {
				if (valid) {
                    this.rewardDialogVisible = false
                    this.rewardAdding = true
                    
                    RewAndPuni.addEmployeeReward(this.employeeId, this.formData.id)
                    .then(response => {
                        this.refreshRewardsAndPunishmentsByEmployeeName(response)
                    })
				}
			})
        },
        /**
		 * 添加处罚
		 */
		addPunishment() {
			this.$refs.punishmentForm.validate((valid) => {
				if (valid) {
                    this.punishmentDialogVisible = false
                    this.punishmentAdding = true
                    
                    RewAndPuni.addEmployeePunishment(this.employeeId, this.formData.id)
                    .then(response => {
                        this.refreshRewardsAndPunishmentsByEmployeeName(response)
                    })
				}
			})
        },
		// 删除奖励
		removeReward(reward) {
            this.employeeRewards.splice(this.employeeRewards.indexOf(reward), 1)
            RewAndPuni.removeEmployeeReward(this.employeeId, reward)
        },
        // 删除处罚
        removePunishment(punishment) {
            this.employeePunishments.splice(this.employeePunishments.indexOf(punishment), 1)
            RewAndPuni.removeEmployeePunishment(this.employeeId, punishment)
        },
		/**
		 * 重置奖励表单
		 */
		resetRewardFormData() {
			this.$refs.rewardForm.resetFields()
        },
        /**
		 * 重置处罚表单
		 */
		resetPunishmentFormData() {
			this.$refs.punishmentForm.resetFields()
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
    width: 700px;
    margin-top: 20px;
    border-radius: 8px;
}
</style>