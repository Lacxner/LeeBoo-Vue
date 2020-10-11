<template>
    <div>
        <!-- 顶部 -->
        <div>
            <el-input placeholder="请输入员工姓名" v-model="name" clearable style="width: 400px; text-align: center" size="medium"></el-input>
            <!-- 查找按钮 -->
            <el-button type="primary" @click="search" style="margin-left: 20px" size="medium" icon="el-icon-search">查找</el-button>
        </div>

        <!-- 中间部分 -->
        <!-- 工资账套列表 -->
        <el-table :data="tableData" ref="employeeSalaryTable" max-height="920" fit v-loading="tableLoading" element-loading-text="加载中" style="margin: 20px 0px">
            <!-- 序号 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="id" label="序号" width="100">
                <template slot-scope="scope">
                    {{ (currentPage - 1) * pageSize + scope.$index + 1 }} <!-- 序号的定义规则 -->
                </template>
            </el-table-column>
            <!-- 姓名 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="name" label="姓名" width="140"></el-table-column>
            <!-- 工号 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="workID" label="工号" width="140"></el-table-column>
            <!-- 邮箱 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="email" label="邮箱" width="220"></el-table-column>
            <!-- 手机号码 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="phone" label="手机号码" width="160"></el-table-column>
            <!-- 部门 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="department.name" label="部门" width="140"></el-table-column>
            <!-- 账套 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="salary.name" label="账套">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" placement="right" :open-delay="250" v-if="scope.row.salary">
                        <!-- 账套名称 -->
                        <el-tag size="medium">{{ scope.row.salary.name }}</el-tag>
                        <!-- 账套详细信息 -->
                        <div slot="content">
                            <table>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">基础工资</el-tag>
                                    <td>￥{{ scope.row.salary.basicSalary }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">奖金</el-tag>
                                    <td>￥{{ scope.row.salary.bonus }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">午餐补助</el-tag>
                                    <td>￥{{ scope.row.salary.lunchSalary }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">交通补助</el-tag>
                                    <td>￥{{ scope.row.salary.trafficSalary }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">应发工资</el-tag>
                                    <td>￥{{ scope.row.salary.allSalary }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">养老保险基数</el-tag>
                                    <td>￥{{ scope.row.salary.pensionBase }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">养老保险比率</el-tag>
                                    <td>{{ scope.row.salary.pensionPer }}%</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">医疗保险基数</el-tag>
                                    <td>￥{{ scope.row.salary.medicalBase }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">医疗保险比率</el-tag>
                                    <td>{{ scope.row.salary.medicalPer }}%</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">公积金基数</el-tag>
                                    <td>￥{{ scope.row.salary.accumulationFundBase }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">公积金比率</el-tag>
                                    <td>{{ scope.row.salary.accumulationFundPer }}%</td>
                                </tr>
                            </table>
                        </div>
                    </el-tooltip>
                    <el-tag size="medium" type="danger" v-else>{{ '暂未设置' }}</el-tag>
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column :resizable="false" fixed="right" header-align="center" align="center" label="操作" width="140">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <el-button size="mini" style="width: 70px" @click="openDialog(scope.row)">
                    <i class="el-icon-edit"></i> 编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或编辑工资账套对话框 -->
        <el-dialog title="修改工资账套" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" @close="resetFormData">
            <!-- 工资账套表单 -->
            <el-form :model="formData" ref="employeeSalaryForm" :rules="formRules" status-icon>
                <!-- 账套名称 -->
                <el-form-item label="账套名称" prop="id" size="medium" label-width="80px">
                    <el-select v-model="formData.id" placeholder="请选择">
                        <el-option v-for="salary in allSalary" :key="salary.id" :label="salary.name" :value="salary.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            
            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="dialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="addOrEditEmployeeSalary" size="medium">确定</el-button>
            </span>
        </el-dialog>

        <!-- 分页 -->
        <div style="display: flex; flex-direction: row-reverse">
            <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page.sync="currentPage"
            :page-sizes="[8, 16, 32, 64, total]" :page-size="pageSize"></el-pagination>
        </div>
    </div>
</template>

<script>
import * as Salary from '@/api/salary'
import * as Message from '@/utils/message'

export default {
    data() {
        return {
            // 表格加载中提示
            tableLoading: true,
            // 搜索的员工姓名
            name: null,
            // 判断是添加还是编辑
            isEdit: true,
            // 当前页码
            currentPage: 1,
            // 每页显示数
            pageSize: 8,
            // 总员工数
            total: 0,
            // 要修改的员工id
            employeeId: null,
            // 编辑时表单的工资账套id
            formData: {
                id: null
            },
            // 校验规则
            formRules: {
                id: [
                    { required: true, message: '请选择工资账套！', trigger: 'blur' }
                ]
            },
            // 所有可选择的工资账套
            allSalary: [],
            // 是否打开对话框
            dialogVisible: false,
            // 表格数据
            tableData: []
        }
    },
    created() {
        this.refreshAllEmployeeSalary()
        this.initSalary()
    },
    methods: {
        /**
         * 获取所有工资账套
         */
        refreshAllEmployeeSalary(res) {
            // 获取所有工资账套
            Salary.getAllEmployeeSalaryByName(this.name, this.currentPage, this.pageSize)
            .then(response => {
                this.tableData = response.data.items
                // 员工总数
                this.total = response.data.total
                Message.handle(res)
                this.tableLoading = false
            })
        },
        /**
         * 搜索按钮的点击事件
         */
        search() {
            this.name = this.name === '' ? null : this.name
            this.tableLoading = true
            this.refreshAllEmployeeSalary()
        },
        /**
         * 初始化工账套下拉框
         */
        initSalary() {
            Salary.getAllBasicSalary()
            .then(response => {
                this.allSalary = response.data.items
            })
        },
        /**
         * 切换页面时的点击事件
         */
        handleCurrentChange() {
            this.tableLoading = true
            this.refreshAllEmployeeSalary()
        },
        /**
         * 切换每页显示数时的点击事件
         */
        handleSizeChange(val) {
            this.pageSize = val
            this.tableLoading = true
            this.refreshAllEmployeeSalary()
        },
        /**
         * 点击添加或编辑按钮时打开对话框，对话框会动态适应
         * 如果是修改操作就传入当前要编辑的工资账套，反之添加就传入null
         */
        openDialog(currentEmployeeSalary) {
            // 数据回显
            this.$nextTick(() => {
                if (currentEmployeeSalary.salary) {
                    this.formData.id = currentEmployeeSalary.salary.id
                    this.isEdit = true
                } else {
                    this.isEdit = false
                }
                this.employeeId = currentEmployeeSalary.id
            })
            this.dialogVisible = true
        },
        /**
         * 编辑工资账套
         */
        addOrEditEmployeeSalary() {
            this.$refs.employeeSalaryForm.validate((valid) => {
                if (valid) {
                    this.dialogVisible = false
                    this.tableLoading = true

                    if (this.isEdit) {
                        Salary.updateEmployeeSalary(this.formData.id, this.employeeId)
                        .then(response => {
                            this.refreshAllEmployeeSalary(response)
                        })
                    } else {
                        Salary.addEmployeeSalary(this.formData.id, this.employeeId)
                        .then(response => {
                            this.refreshAllEmployeeSalary(response)
                        })
                    }
                } else {
                    return false
                }
            })
        },
        /**
         * 重置表单并清除校验结果
         */
        resetFormData() {
            this.$refs.employeeSalaryForm.resetFields()
        }
    }
}
</script>

<style scoped>
.el-pagination /deep/ .el-pagination__total, .el-pagination /deep/  .el-pagination__jump {
    font-weight: 600;
}
</style>
