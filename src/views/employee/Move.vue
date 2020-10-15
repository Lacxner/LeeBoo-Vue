<template>
    <div>
        <!-- 顶部 -->
        <div>
            <el-input placeholder="请输入员工姓名" v-model="name" clearable style="width: 400px; text-align: center" size="medium"></el-input>
            <!-- 查找按钮 -->
            <el-button type="primary" @click="search" style="margin-left: 20px" size="medium" icon="el-icon-search" :loading="searching">查找</el-button>
        </div>

        <!-- 调动操作 -->
        <el-card class="box-card">
            <div slot="header" style="display: flex; justify-content: space-between">
                <span style="font-size: 22px">基本信息</span>
                <el-button type="primary" size="small" @click="openDialog" style="width: 80px" :disabled="!isSeach" :loading="moving">调动</el-button>
            </div>
            <div v-if="formData.id" class="items">
                <!-- 基础工资   -->
                <div>
                    <span>部门</span>{{ formData.department.name }}
                </div>
                <!-- 奖金 -->
                <div>
                    <span>职位</span>{{ formData.position.name }}
                </div>
                <!-- 罚金 -->
                <div>
                    <span>职称</span>{{ formData.rank.name }}
                </div>
            </div>
            <div v-else>
				<div class="emptyTip">暂无内容</div>
			</div>
        </el-card>

        <!-- 员工调动对话框 -->
        <el-dialog title="员工调动" :visible.sync="moveDialogVisible" width="500px" :close-on-click-modal="false" @closed="resetFormData">
            <el-form :model="formData" ref="employeeMoveForm" :rules="formRules" status-icon label-width="52px">
                <!-- 部门 -->
                <el-form-item label="部门" prop="department.id" size="medium">
                    <el-cascader ref="employeeMoveDepartmentCascader" :options="departments" v-model="formData.department.id" :props="props"
                    :show-all-levels="false"></el-cascader>
                </el-form-item>
                <!-- 职称 -->
                <el-form-item label="职称" prop="rank.id" size="medium">
                    <el-select v-model="formData.rank.id" placeholder="请选择">
                        <el-option v-for="rank in ranks" :key="rank.id" :label="rank.name" :value="rank.id"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 职位 -->
                <el-form-item label="职位" prop="position.id" size="medium">
                    <el-select v-model="formData.position.id" placeholder="请选择">
                        <el-option v-for="position in positions" :key="position.id" :label="position.name" :value="position.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            
            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="moveDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="moveEmployee" size="medium">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as EmployeeMove from '@/api/employeeMove'
import * as Message from '@/utils/message'
import * as Generic from '@/utils/generic'

const DEFAULT_FROM_DATA = {
    id: null,
    department: {
        id: null
    },
    rank: {
        id: null
    },
    position: {
        id: null
    }
}

export default {
    data() {
        return {
            // 员工的调动信息
            employeeMove: null,
            // 查询的员工的名称
            name: null,
            // 查找中提示
            searching: false,
            // 是否打开调动对话框
            moveDialogVisible: false,
            // 是否搜索了员工
            isSeach: false,
            // 调动中提示
            moving: false,
            // 当前所查询的员工的调动基本信息
            currentEmployeeMoveInfo: null,
            // 调动表单的数据
            formData: { ...DEFAULT_FROM_DATA },
            // 调动表单的校验规则
            formRules: {
                'department.id': [
                    { required: true, message: '请选择部门！', trigger: 'blur' },
                ],
                'rank.id': [
                    { required: true, message: '请选择职称！', trigger: 'blur' },
                ],
                'position.id': [
                    { required: true, message: '请选择职位！', trigger: 'blur' },
                ]
            },
            // 部门级联选择器的属性映射
            props: {
				label: 'name',
				value: 'id',
				children: 'children',
                checkStrictly: true,
                expandTrigger: 'hover'
			},
            // 表单的部门选项
            departments: [],
            // 表单的职位选项
            positions: [],
            // 表单的职称选项
            ranks: []
        }
    },
    created() {
        this.initBasicOptions()
    },
    methods: {
        /**
         * 根据员工姓名获取其所有调动信息
         */
        refreshEmployeeMoveByName(res) {
            EmployeeMove.getEmployeeMoveByName(this.name)
            .then(response => {
                if (response.data.item) {
                    this.currentEmployeeMoveInfo = response.data.item
                    this.formData = Generic.deeper(this.currentEmployeeMoveInfo)
                } else {
                    this.currentEmployeeMoveInfo = null
                    this.formData = { ...DEFAULT_FROM_DATA }
                }
                if (this.name) {
                    Message.handle(res)
                } else {
                    Message.handle(response)
                }
                this.searching = false
                if (this.formData) {
                    this.isSeach = true
                } else {
                    this.isSeach = false
                }
                this.moving = false
            })
        },
        /**
         * 打开员工调动对话框
         */
        openDialog() {
            // 数据回显
            this.$nextTick(() => {
                this.formData = Generic.deeper(this.currentEmployeeMoveInfo)
            })
            this.moveDialogVisible = true
        },
        /**
         * 初始化表单下拉菜单的选项
         */
        initBasicOptions() {
            EmployeeMove.initBasicOptions()
            .then(response => {
                this.departments = response.data.departments
                this.positions = response.data.positions
                this.ranks = response.data.ranks
            })
        },
        /**
         * 查询指定员工的工资表
         */
        search() {
            this.searching = true
            this.name = this.name === '' ? null : this.name
            this.refreshEmployeeMoveByName()
        },
        /**
         * 调动员工
         */
        moveEmployee() {
            this.$refs.employeeMoveForm.validate((valid) => {
				if (valid) {
                    this.moveDialogVisible = false
                    this.moving = true
                    // 获取级联选择器当前选中项的id，因为级联选择器获取的是选中项路径中所有项的id数组
                    if (typeof(this.formData.department.id) !== 'number' && this.formData.department.id instanceof Array) {
                        // 当前选中项的id位于数组的末尾
                        let lastIndex = this.formData.department.id.length - 1
                        this.formData.department.id = this.formData.department.id[lastIndex]
                    }

                    EmployeeMove.moveEmployee(this.formData)
                    .then(response => {
                        this.refreshEmployeeMoveByName(response)
                    })
				}
			})
        },
        /**
         * 重置员工调动表单并清除校验结果
         */
        resetFormData() {
            this.$refs.employeeMoveForm.resetFields()
            this.$refs.employeeMoveDepartmentCascader.$refs.panel.clearCheckedNodes()
        }
    }
}
</script>

<style scoped>
.items div{
    font-size: 14px;
    margin-bottom: 18px;
}
.items div span {
    color: #99a9bf;
    display: inline-block;
    font-size: 18px;
    margin-right: 15px;
}
.box-card {
    width: 700px;
    margin-top: 20px;
    border-radius: 8px;
}
.items div:last-child {
    margin-bottom: 0px;
}
.emptyTip {
	text-align: center;
	font-size: 22px;
	color: gray;
}
</style>