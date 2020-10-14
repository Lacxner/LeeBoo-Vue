<template>
    <div>
        <!-- 顶部 -->
        <div>
            <el-input placeholder="请输入员工姓名" v-model="name" clearable style="width: 400px; text-align: center" size="medium"></el-input>
            <!-- 查找按钮 -->
            <el-button type="primary" @click="search" style="margin-left: 20px" size="medium" icon="el-icon-search" :loading="searching">查找</el-button>
        </div>

        <!-- 中间部分 -->
        <!-- 工资账套列表 -->
        <el-table :data="tableData" ref="employeeSalarySobTable" max-height="920" fit v-loading="tableLoading" element-loading-text="加载中" style="margin: 20px 0px">
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
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="salarySob.name" label="账套">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" placement="right" :open-delay="250" v-if="scope.row.salarySob">
                        <!-- 账套名称 -->
                        <el-tag size="medium">{{ scope.row.salarySob.name }}</el-tag>
                        <!-- 账套详细信息 -->
                        <div slot="content">
                            <table>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">基础工资</el-tag>
                                    <td>￥{{ scope.row.salarySob.basicSalary }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">午餐补助</el-tag>
                                    <td>￥{{ scope.row.salarySob.lunchSalary }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">交通补助</el-tag>
                                    <td>￥{{ scope.row.salarySob.trafficSalary }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">应发工资</el-tag>
                                    <td>￥{{ scope.row.salarySob.allSalary }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">养老保险基数</el-tag>
                                    <td>￥{{ scope.row.salarySob.pensionBase }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">养老保险比率</el-tag>
                                    <td>{{ scope.row.salarySob.pensionPer }}%</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">医疗保险基数</el-tag>
                                    <td>￥{{ scope.row.salarySob.medicalBase }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">医疗保险比率</el-tag>
                                    <td>{{ scope.row.salarySob.medicalPer }}%</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">公积金基数</el-tag>
                                    <td>￥{{ scope.row.salarySob.accumulationFundBase }}</td>
                                </tr>
                                <tr>
                                    <el-tag size="mini" style="margin-right: 10px">公积金比率</el-tag>
                                    <td>{{ scope.row.salarySob.accumulationFundPer }}%</td>
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
            <el-form :model="formData" ref="employeeSalarySobForm" :rules="formRules" status-icon>
                <!-- 账套名称 -->
                <el-form-item label="账套名称" prop="id" size="medium" label-width="80px">
                    <el-select v-model="formData.id" placeholder="请选择">
                        <el-option v-for="salarySob in allSalarySob" :key="salarySob.id" :label="salarySob.name" :value="salarySob.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            
            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="dialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="addOrEditEmployeeSalarySob" size="medium">确定</el-button>
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
import * as SalarySob from '@/api/salarySob'
import * as Message from '@/utils/message'

export default {
    data() {
        return {
            // 表格加载中提示
            tableLoading: true,
            // 查找中提示
            searching: false,
            // 搜索的员工姓名
            name: null,
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
            allSalarySob: [],
            // 是否打开对话框
            dialogVisible: false,
            // 表格数据
            tableData: []
        }
    },
    created() {
        this.refreshAllEmployeeSalarySob()
        this.initSalarySob()
    },
    methods: {
        /**
         * 获取所有工资账套
         */
        refreshAllEmployeeSalarySob(res) {
            // 获取所有工资账套
            SalarySob.getAllEmployeeSalarySobByName(this.name, this.currentPage, this.pageSize)
            .then(response => {
                this.tableData = response.data.items
                // 员工总数
                this.total = response.data.total
                Message.handle(res)
                this.tableLoading = false
                this.searching = false
            })
        },
        /**
         * 搜索按钮的点击事件
         */
        search() {
            this.name = this.name === '' ? null : this.name
            this.tableLoading = true
            this.searching = true
            this.refreshAllEmployeeSalarySob()
        },
        /**
         * 初始化工账套下拉框
         */
        initSalarySob() {
            SalarySob.getAllBasicSalarySob()
            .then(response => {
                this.allSalarySob = response.data.items
            })
        },
        /**
         * 切换页面时的点击事件
         */
        handleCurrentChange() {
            this.tableLoading = true
            this.refreshAllEmployeeSalarySob()
        },
        /**
         * 切换每页显示数时的点击事件
         */
        handleSizeChange(val) {
            this.pageSize = val
            this.tableLoading = true
            this.refreshAllEmployeeSalarySob()
        },
        /**
         * 点击添加或编辑按钮时打开对话框，对话框会动态适应
         * 如果是修改操作就传入当前要编辑的工资账套，反之添加就传入null
         */
        openDialog(currentEmployeeSalarySob) {
            // 数据回显
            this.$nextTick(() => {
                if (currentEmployeeSalarySob.salarySob) {
                    this.formData.id = currentEmployeeSalarySob.salarySob.id
                }
                this.employeeId = currentEmployeeSalarySob.id
            })
            this.dialogVisible = true
        },
        /**
         * 编辑工资账套
         */
        addOrEditEmployeeSalarySob() {
            this.$refs.employeeSalarySobForm.validate((valid) => {
                if (valid) {
                    this.dialogVisible = false
                    this.tableLoading = true

                    SalarySob.updateEmployeeSalarySob(this.formData.id, this.employeeId)
                    .then(response => {
                        this.refreshAllEmployeeSalarySob(response)
                    })
                } else {
                    return false
                }
            })
        },
        /**
         * 重置表单并清除校验结果
         */
        resetFormData() {
            this.$refs.employeeSalarySobForm.resetFields()
        }
    }
}
</script>

<style scoped>
.el-pagination /deep/ .el-pagination__total, .el-pagination /deep/  .el-pagination__jump {
    font-weight: 600;
}
</style>
