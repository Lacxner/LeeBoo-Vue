<template>
    <div>
        <!-- 顶部 -->
        <el-input placeholder="请输入关键字进行筛选" v-model="search" clearable style="width: 500px"  size="medium">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!-- 添加职位按钮 -->
        <el-button type="primary" @click="addDialogVisible = true" style="margin-left: 20px" size="medium" icon="el-icon-plus" :loading="addLoading">添加操作员</el-button>

        <!-- 中间部分 -->
        <!-- Hr列表 -->
        <el-table :data="tableData.filter(data => !search 
            || data.name.toLowerCase().includes(search.toLowerCase()))"
        ref="hrTable" max-height="660" fit v-loading="tableLoading" element-loading-text="加载中" style="margin-bottom: 0px">
            <!-- 下拉表 -->
            <el-table-column type="expand">
                <template slot-scope="props" style="height: 400px">
                    <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="手机">
                        <span>{{ props.row.phone != null ? props.row.phone : '-' }}</span>
                    </el-form-item>
                    <el-form-item label="QQ">
                        <span>{{ props.row.qq != null ? props.row.qq : '-' }}</span>
                    </el-form-item>
                    <el-form-item label="地址">
                        <span>{{ props.row.address != null ? props.row.address : '-' }}</span>
                    </el-form-item>
                    <el-form-item label="角色">
                        <div v-if="props.row.roles.length">
                            <el-tag v-for="(role, index) in props.row.roles" :key="index" disable-transitions size="medium" :style="index !== 0 ? 'margin-left: 10px' : ''">
                                {{ role.nameZh }}
                            </el-tag>
                        </div>
                        <span v-else>-</span>
                    </el-form-item>
                    <el-form-item label="备注">
                        <span>{{ props.row.remark != null ? props.row.remark : '-' }}</span>
                    </el-form-item>
                    </el-form>
                </template>
            </el-table-column>

            <!-- 序号 -->
            <el-table-column :resizable="false" header-align="center" align="center" type="index" prop="id" label="序号" width="100"></el-table-column>
            <!-- Hr创建时间是可以排序的 -->
            <!-- Hr名称 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="name" label="名称" width="340"></el-table-column>
            <!-- 创建时间 -->
            <el-table-column :resizable="false" sortable header-align="center" align="center" prop="createTime" label="创建时间"></el-table-column>
            <!-- 是否启用 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="enabled" label="启用" width="100">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.enabled" @change="changeEnabled(scope.row)" active-color="#13ce66"></el-switch>
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column :resizable="false" header-align="center" align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <!-- 授权按钮 -->
                    <el-button size="mini" style="width: 70px" @click="openRoleDialog(scope.row.id, scope.row.roles)">
                    <i class="fa fa-lock"></i> 授权</el-button>
                    <!-- 编辑按钮 -->
                    <el-button size="mini" style="width: 70px" @click="editDialogVisible = true, editFormData = { ...scope.row }">
                    <i class="el-icon-edit"></i> 编辑</el-button>
                    <!-- 删除按钮 -->
                    <el-button size="mini" type="danger" style="width: 70px" @click="deleteHr(scope.row.id)">
                    <i class="fa fa-trash"></i> 删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加Hr对话框 -->
        <el-dialog title="添加操作员" :visible.sync="addDialogVisible" width="500px" :close-on-click-modal="false" @closed="resetAddFormData">
            <!-- 添加Hr表单 -->
            <el-form :model="addFormData" ref="addHrForm" :rules="addFormRules"  status-icon label-width="80px">
                <!-- Hr名称 -->
                <el-form-item label="名称" prop="name" size="medium">
                    <el-input type="input" v-model="addFormData.name" autocomplete="off"></el-input>
                </el-form-item>
                <!-- Hr用户名 -->
                <el-form-item label="用户名" prop="username" size="medium">
                    <el-input type="input" v-model="addFormData.username" autocomplete="off"></el-input>
                </el-form-item>
                <!-- Hr密码 -->
                <el-form-item label="密码" prop="password" size="medium">
                    <el-input type="input" v-model="addFormData.password" autocomplete="off"></el-input>
                </el-form-item>
                <!-- Hr再次确认密码 -->
                <el-form-item label="确认密码" prop="checkPassword" size="medium">
                    <el-input type="input" v-model="addFormData.checkPassword" autocomplete="off"></el-input>
                </el-form-item>
                <!-- Hr备注 -->
                <el-form-item label="备注" prop="remark" size="medium">
                    <el-input type="textarea" :rows="3" v-model="addFormData.remark"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="addDialogVisible = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="addHr" size="medium">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 授权Hr对话框 -->
        <el-dialog title="授权操作员" :visible.sync="roleDialogVisible" width="690px" :close-on-click-modal="false" @closed="resetRoleData">
            <div class="transfer">
                <!-- 授权穿梭框 -->
                <el-transfer ref="setRoleTransfer" v-model="hrRole.roleIds" :data="roleData" :props="defaultProps"
                :button-texts="['移除', '添加']" :titles="['未选', '已选']" @change="isChange"></el-transfer>
            </div>

            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="roleDialogVisible = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="updateHrRole" size="medium">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑Hr对话框 -->
        <el-dialog title="编辑操作员" :visible.sync="editDialogVisible" width="500px"
        :close-on-click-modal="false" @closed="resetEditFormData">
            <!-- 编辑Hr表单 -->
            <el-form :model="editFormData" ref="editHrForm" :rules="editFormRules" status-icon label-width="80px">
                <!-- Hr名称 -->
                <el-form-item label="名称" prop="name" size="medium">
                    <el-input type="input" v-model="editFormData.name" autocomplete="off"></el-input>
                </el-form-item>
                <!-- Hr手机号 -->
                <el-form-item label="手机号码" prop="phone" size="medium">
                    <el-input type="input" v-model="editFormData.phone" autocomplete="off"></el-input>
                </el-form-item>
                <!-- HrQQ -->
                <el-form-item label="QQ" prop="qq" size="medium">
                    <el-input type="input" v-model="editFormData.qq" autocomplete="off"></el-input>
                </el-form-item>
                <!-- Hr地址 -->
                <el-form-item label="地址" prop="address" size="medium">
                    <el-input type="input" v-model="editFormData.address" autocomplete="off"></el-input>
                </el-form-item>
                <!-- Hr备注 -->
                <el-form-item label="备注" prop="remark" size="medium">
                    <el-input type="textarea" :rows="3" v-model="editFormData.remark"></el-input>
                </el-form-item>
            </el-form>

            <!-- 重设密码对话框 -->
            <el-dialog title="修改密码" width="30%" :visible.sync="resetPassDialogVisible" :close-on-click-modal="false"
            append-to-body @closed="resetPasswordFormData" top="30vh">
                <!-- 编辑Hr表单 -->
                <el-form :model="passwordFormData" ref="passwordForm" :rules="resetPassFormRules" status-icon label-width="80px">
                    <!-- Hr密码 -->
                    <el-form-item label="密码" prop="password" size="medium">
                        <el-input type="input" v-model="passwordFormData.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- Hr再次确认密码 -->
                    <el-form-item label="确认密码" prop="checkPassword" size="medium">
                        <el-input type="input" v-model="passwordFormData.checkPassword" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 对话框底部按钮 -->
                <span slot="footer">
                    <el-button @click="resetPassDialogVisible = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="resetPassword" size="medium">确 定</el-button>
                </span>
            </el-dialog>
            
            <!-- 对话框底部按钮 -->
            <span slot="footer" style="display: flex; justify-content: space-between">
                <el-button @click="resetPassDialogVisible = true" size="medium" type="warning">修改密码</el-button>
                <div>
                    <el-button @click="editDialogVisible = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="editHr" size="medium">确 定</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as Hr from '@/api/hr'
import * as Message from '@/utils/message'

export default {
    data() {
        // 再次确认密码的自定义校验器
        let validateCheckPassword = (rule, value, callback) => {
            // 判断两次密码输入是否一致
            if (value === this.addFormData.password || value === this.passwordFormData.password) {
                callback()
            } else {
                callback(new Error('两次输入密码不一致!'))
            }
        }

        return {
            // 添加中提示
            addLoading: false,
            // 表格加载中提示
            tableLoading: true,
            // 搜索内容
            search: '',
            // 添加时表单的Hr数据
            addFormData: {
                name: null,
                username: null,
                password: null,
                checkPassword: null,
                remark: null
            },
            // 添加表单校验规则
            addFormRules: {
                name: [
                    { required: true, message: '名称不能为空！', trigger: 'blur' },
                    { min: 2, max: 12, message: '名称长度必须在2~12之间！',  trigger: 'blur' },
                    { pattern: /^[\w_-（）\u4e00-\u9fa5]{2,12}$/, message: '名称含有非法字符！', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '用户名不能为空！', trigger: 'blur' },
                    { min: 4, max: 12, message: '用户名长度必须在4~12之间！',  trigger: 'blur' },
                    { pattern: /^\w{4,12}$/, message: '用户名含有非法字符！', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空！', trigger: 'blur' },
                    { min: 4, max: 12, message: '密码长度必须在4~12之间！',  trigger: 'blur' },
                    { pattern: /^\w{4,12}$/, message: '密码含有非法字符！', trigger: 'blur' }
                ],
                checkPassword: [
                    { required: true, message: '请再次确认密码！', trigger: 'blur' },
                    { validator: validateCheckPassword, trigger: 'blur' }
                ],
                remark: [
                    { min: 1, max: 30, message: '备注长度必须在1~30之间！',  trigger: 'blur' }
                ]
            },
            // 编辑时表单的Hr数据
            editFormData: {
                name: null,
                phone: null,
                qq: null,
                address: null,
                remark: null
            },
            // 编辑表单校验规则
            editFormRules: {
                name: [
                    { required: true, message: '名称不能为空！', trigger: 'blur' },
                    { min: 2, max: 12, message: '名称长度必须在2~12之间！',  trigger: 'blur' },
                    { pattern: /^[\w_-（）\u4e00-\u9fa5]{2,12}$/, message: '操作员名称含有非法字符！', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '手机号码不能为空！', trigger: 'blur' },
                    { min: 11, max: 11, message: '手机号码长度必须为11位！',  trigger: 'blur' },
                    { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '手机号码含有非法字符！', trigger: 'blur' }
                ],
                qq: [
                    { required: true, message: 'QQ不能为空！', trigger: 'blur' },
                    { min: 5, max: 16, message: 'QQ长度必须在5~16之间',  trigger: 'blur' },
                    { pattern: /^\d{5,16}$/, message: 'QQ含有非法字符！', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '地址不能为空！', trigger: 'blur' },
                    { min: 4, max: 24, message: '地址长度必须在4~24之间',  trigger: 'blur' },
                    { pattern: /^[\w（）\u4e00-\u9fa5]{4,24}$/, message: '地址含有非法字符！', trigger: 'blur' }
                ],
                remark: [
                    { min: 1, max: 30, message: '备注长度必须在1~30之间！',  trigger: 'blur' }
                ]
            },
            // 重设密码表单数据
            passwordFormData: {
                id: 0,
                password: '',
                checkPassword: ''
            },
            // 重设密码表单校验规则
            resetPassFormRules: {
                password: [
                    { required: true, message: '密码不能为空！', trigger: 'blur' },
                    { min: 4, max: 12, message: '密码长度必须在4~12之间！',  trigger: 'blur' },
                    { pattern: /^\w{4,12}$/, message: '密码含有非法字符！', trigger: 'blur' }
                ],
                checkPassword: [
                    { required: true, message: '请再次确认密码！', trigger: 'blur' },
                    { validator: validateCheckPassword, trigger: 'blur' }
                ]
            },
            // 所有角色
            roleData: [],
            // 穿梭框的字段别名
            defaultProps: {
                key: 'id',
                label: 'nameZh'
            },
            // 用于更新Hr角色的数据
            hrRole: {
                hrId: 0,
                roleIds: []
            },
            isRightListChange: false,
            // 是否打开添加对话框
            addDialogVisible: false,
            // 是否打开编辑对话框
            editDialogVisible: false,
            // 是否打开重设密码对话框
            resetPassDialogVisible: false,
            // 是否打开授权对话框
            roleDialogVisible: false,
            // 表格数据
            tableData: []
        }
    },
    created() {
        this.tableLoading = true
        this.refreshAllHrs()
        this.initRoleData()
    },
    methods: {
        /**
         * 获取所有操作员
         */
        refreshAllHrs(res) {
            // 获取所有Hr
            Hr.getAllHrs()
            .then(response => {
                this.tableData = response.data.items
                Message.handle(res)
                this.tableLoading = false
            })
        },
        /**
         * 添加操作员
         */
        addHr() {
            this.$refs.addHrForm.validate((valid) => {
                if (valid) {
                    // 点击了确定后立马关闭对话框并开启加载中提示，提高用户体验
                    this.addDialogVisible = false
                    this.tableLoading = true
                    this.addLoading = true

                    // 添加Hr
                    Hr.addHr(this.addFormData)
                    .then(response => {
                        this.refreshAllHrs(response)
                        this.addLoading = false
                    })
                } else {
                    return false
                }
            })
        },
        /**
         * 编辑操作员
         */
        editHr() {
            this.$refs.editHrForm.validate((valid) => {
                if (valid) {
                    this.editDialogVisible = false
                    this.tableLoading = true

                    // 修改职位
                    Hr.updateHr(this.editFormData)
                    .then(response => {
                        this.refreshAllHrs(response)
                    })
                } else {
                    return false
                }
            })
        },
        /**
         * 删除操作员
         */
        deleteHr(id) {
            // 再次确认删除
            this.$confirm('是否确定要删除这条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 删除指定Hr
                this.tableLoading = true
                Hr.deleteHrById(id)
                .then(response => {
                    this.refreshAllHrs(response)
                })
            }).catch(action => { })
        },
        /**
         * 重设密码
         */
        resetPassword() {
            this.$refs.passwordForm.validate((valid) => {
                if (valid) {
                    // 设置要重设密码Hr的id
                    this.passwordFormData.id = this.editFormData.id

                    Hr.updateHrPassword(this.passwordFormData)
                    .then(response => {
                        this.resetPassDialogVisible = false
                    })
                } else {
                    return false
                }
            })
        },
        /**
         * 是否可用按钮的点击事件
         */
        changeEnabled(hr) {
            Hr.updateHrEnabled(hr)
        },
        /**
         * 初始化
         */
        initRoleData() {
            Hr.getAllRoles()
            .then(response => {
                this.roleData = response.data.items
            })
        },
        /**
         * 穿梭框右边列表内容是否改变的响应事件
         */
        isChange() {
            // 如果右边列表没有发生改变，就无需发送请求
            this.isRightListChange = true
        },
        /**
         * 打开修改角色对话框
         */
        openRoleDialog(hrId, roles) {
            this.roleDialogVisible = true

            // Hr角色对话框的数据回显
            this.hrRole.hrId = hrId
            if (roles.length > 0) {
                roles.forEach(role => {
                    this.hrRole.roleIds.push(role.id)
                })
            }
        },
        /**
         * 修改操作员的角色
         */
        updateHrRole() {
            this.roleDialogVisible = false
            if (this.isRightListChange) {
                this.tableLoading = true
                Hr.updateHrRole(this.hrRole)
                .then(response => {
                    this.refreshAllHrs(response)
                })
            }
        },
        /**
         * 重置添加表单并清除校验结果
         */
        resetAddFormData() {
            this.$refs.addHrForm.resetFields()
        },
        /**
         * 重置编辑表单并清除校验结果
         */
        resetEditFormData() {
            this.$refs.editHrForm.resetFields()
        },
        /**
         * 重置密码表单并清除校验结果
         */
        resetPasswordFormData() {
            this.$refs.passwordForm.resetFields()
        },
        /**
         * 重置角色穿梭框
         */
        resetRoleData() {
            this.hrRole.roleIds = []
            this.isRightListChange = false
        }
    }
}
</script>

<style scoped>
.el-table {
    margin: 20px 0px;
}
.table-expand {
    font-size: 0;
}
.table-expand /deep/ label {
    width: 60px;
    font-size: 16px;
    color: #99a9bf;
}
.table-expand /deep/ .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
.transfer {
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>
