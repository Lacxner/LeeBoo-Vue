<template>
    <div>
        <!-- 顶部 -->
        <el-input placeholder="请输入关键字进行筛选" v-model="search" clearable style="width: 500px; text-align: center" size="medium">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!-- 添加角色按钮 -->
        <el-button type="primary" @click="openDialog(null)" style="margin-left: 20px" size="medium" icon="el-icon-plus" :loading="addLoading">添加角色</el-button>

        <!-- 中间部分 -->
        <!-- 角色列表 -->
        <el-table :data="tableData.filter(data => !search 
            || data.name.toLowerCase().includes(search.toLowerCase())
            || data.nameZh.toLowerCase().includes(search.toLowerCase()))"
        ref="roleTable" max-height="460" fit @selection-change="handleSelectionChange" v-loading="tableLoading" element-loading-text="加载中">
            <!-- 勾选框 -->
            <el-table-column :resizable="false" header-align="center" align="center" type="selection" width="100"></el-table-column>
            <!-- 序号 -->
            <el-table-column :resizable="false" header-align="center" align="center" type="index" prop="id" label="序号" width="100"></el-table-column>
            <!-- 角色名称 -->
            <el-table-column :resizable="false" sortable show-overflow-tooltip header-align="center" align="center" prop="name" label="名称" width="200"></el-table-column>
            <!-- 角色别名 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="nameZh" label="别名" width="220"></el-table-column>
            <!-- 创建时间 -->
            <el-table-column :resizable="false" sortable header-align="center" align="center" prop="createTime" label="创建时间"></el-table-column>
            <!-- 操作 -->
            <el-table-column :resizable="false" header-align="center" align="center" label="操作" width="220">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <el-button size="mini" style="width: 70px" @click="openDialog(scope.row)">
                    <i class="el-icon-edit"></i> 编辑</el-button>
                    <!-- 删除按钮 -->
                    <el-button size="mini" type="danger" style="width: 70px" @click="deleteRole(scope.row.id)">
                    <i class="fa fa-trash"></i> 删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或编辑角色对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" @closed="resetFormData">
            <!-- 角色表单 -->
            <el-form :model="formData" ref="roleForm" :rules="formRules" status-icon label-width="52px">
                <!-- 角色名称 -->
                <el-form-item label="名称" prop="name" size="medium">
                    <el-input type="input" v-model="formData.name" autocomplete="off">
                        <template slot="prepend">ROLE_</template>
                    </el-input>
                </el-form-item>
                <!-- 角色别名 -->
                <el-form-item label="别名" prop="nameZh" size="medium">
                    <el-input type="input" v-model="formData.nameZh" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 角色权限 -->
                <el-form-item label="角色" prop="authorities" size="medium">
                    <el-tree ref="tree" id="roleTree" :props="props" :data="authorities" show-checkbox
                    accordion highlight-current node-key="id" :default-checked-keys="defaultCheckedKeys" empty-text="暂无数据"></el-tree>
                </el-form-item>
            </el-form>
            
            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="dialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="addOrEditRole" size="medium">确定</el-button>
            </span>
        </el-dialog>

        <!-- 底部 -->
        <!-- 批量删除角色按钮 -->
        <el-button type="danger" @click="deleteSelection" size="medium" icon="fa fa-trash" :loading="batchDeleteLoading"> 批量删除</el-button>
        <!-- 取消全部的选中项按钮 -->
        <el-button @click="cancelSelection" size="medium" icon="fa fa-ban"> 全部取消</el-button>
    </div>
</template>

<script>
import * as Role from '@/api/role'
import * as Message from '@/utils/message'
import * as Generic from '@/utils/generic'

export default {
    data() {
        // 添加或编辑角色表单的权限表校验器
        let validateRoleAuthorities = (rule, value, callback) => {
            // 权限表的非空校验
            if (this.$refs.tree.getCheckedKeys(true).length === 0) {
                callback(new Error('请至少选择一个权限！'))
            } else {
                callback()
            }
        }

        return {
            // 批量删除中提示
            batchDeleteLoading: false,
            // 添加中提示
            addLoading: false,
            // 表格加载中提示
            tableLoading: true,
            // 搜索内容
            search: '',
            // 添加或编辑时表单的角色
            formData: {
                name: null,
                nameZh: null,
                authorities: []
            },
            // 权限树型结构的映射关系 
            props: {
                label: 'name',
                children: 'children'
            },
            // 对话框中要显示的的权限
            authorities: [],
            // 对话框权限表默认的选中项
            defaultCheckedKeys: [],
            // 对话框标题
            dialogTitle: '添加角色',
            // 表格数据
            tableData: [],
            // 表单校验规则
            formRules: {
                name: [
                    { required: true, message: '角色名称不能为空！', trigger: 'blur' },
                    { min: 2, max: 12, message: '角色别名长度必须在2~12之间！',  trigger: 'blur' },
                    { pattern: /^\w{2,12}$/, message: '角色名称含有非法字符！', trigger: 'blur' }
                ],
                nameZh: [
                    { required: true, message: '角色别名不能为空！', trigger: 'blur' },
                    { min: 2, max: 12, message: '角色别名长度必须在2~12之间！',  trigger: 'blur' },
                    { pattern: /^[\w\u4e00-\u9fa5]{2,12}$/, message: '角色别名含有非法字符！', trigger: 'blur' }
                ],
                authorities: [
                    { required: true, validator: validateRoleAuthorities, trigger: 'blur' }
                ]
            },
            // 是否打开对话框
            dialogVisible: false,
            // 所有的多选项
            multipleSelection: []
        }
    },
    created() {
        this.refreshAllRoles()
        // 初始化对话框中的权限表
        this.initAuthorities()
    },
    methods: {
        /**
         * 获取所有角色
         */
        refreshAllRoles(res) {
            // 获取所有角色
            Role.getAllRoles()
            .then(response => {
                this.tableData = response.data.items
                Message.handle(res)
                this.tableLoading = false
            })
        },
        /**
         * 点击添加或编辑按钮时打开对话框，对话框会动态适应
         * 如果是修改操作就传入当前要编辑的角色，反之添加就传入null
         */
        openDialog(currentRole) {
            // 根据方法是否传入角色来判断是添加或是编辑对话框
            if (currentRole) {
                this.dialogTitle = '修改角色'

                // 数据回显
                this.$nextTick(() => {
                    this.formData = Generic.deeper(currentRole)
                    // 去除ROLE_
                    this.formData.name = this.formData.name.slice(5)

                    // 获取角色所拥有的所有权限
                    this.getRoleAuthorities()
                })
            } else {
                this.dialogTitle = '添加角色'
            }

            this.dialogVisible = true
        },
        /**
         * 添加或编辑角色
         */
        addOrEditRole() {
            this.$refs.roleForm.validate((valid) => {
                if (valid) {
                    // 格式化角色名称，加上前缀并全部大写
                    this.formData.name = 'ROLE_' + this.formData.name.toUpperCase()

                    // 点击了确定后立马关闭对话框并开启加载中提示，提高用户体验
                    this.dialogVisible = false
                    this.tableLoading = true

                    // 如果当前表单数据的id属性有值就代表要修改，反之就表示添加
                    if (this.formData.id) {
                        /**
                         * 修改权限
                         * 这里getCheckedKeys方法必须设置参数true，表示只获取当前所有选中的子节点的Key，因为我们在存入角色权限时不能存一级菜单
                         */
                        Role.updateRoleWithMenu(this.formData, this.$refs.tree.getCheckedKeys(true))
                        .then(response => {
                            this.refreshAllRoles(response)
                        })
                    } else {
                        this.addLoading = true

                        // 添加权限
                        Role.addRoleWithMenu(this.formData, this.$refs.tree.getCheckedKeys(true))
                        .then(response => {
                            this.refreshAllRoles(response)
                            this.addLoading = false
                        })
                    }
                } else {
                    return false
                }
            })
            
        },
        /**
         * 删除角色
         */
        deleteRole(id) {
            // 再次确认删除
            this.$confirm('是否确定要删除这条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableLoading = true
                // 删除指定角色
                Role.deleteRoleById(id)
                .then(response => {
                    this.refreshAllRoles(response)
                })
            }).catch(action => {})
        },
        /**
         * 批量删除选中项
         */
        deleteSelection() {
            // 再次确认删除
            this.$confirm(`是否确定要删除这 ${this.multipleSelection.length} 条数据?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.multipleSelection.length > 0){
                    this.batchDeleteLoading = true
                    this.tableLoading = true

                    // 提取出所有选中角色的id并封装成一个数组
                    let ids = []
                    this.multipleSelection.forEach(selection => {
                        ids.push(selection.id)
                    })
                    
                    // 批量删除选中的角色，删除成功后刷新角色列表
                    Role.deleteBatchRoleByIds(ids)
                    .then(response => {
                        this.refreshAllRoles(response)
                        this.batchDeleteLoading = false
                    })
                }
            }).catch(action => {})
        },
        /**
         * 取消所有选中项
         */
        cancelSelection() {
            // 取消所有选中项
            if (this.multipleSelection.length > 0) {
                this.$refs.roleTable.clearSelection()
            }
        },
        /**
         * 选中项改变响应事件
         */
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        /**
         * 初始化权限列表
         */
        initAuthorities() {
            Role.getAllBasicMenu()
            .then(response => {
                if (response.data.items.length > 0) {
                    this.authorities = response.data.items

                    // 初始化权限表时设置默认选中项
                    this.authorities.forEach(authority => {
                        this.defaultCheckedKeys.push(authority.id)
                    })
                }
            })
        },
        /**
         * 获取当前用户拥有的所有权限
         */
        getRoleAuthorities() {
            // 权限表的加载中提示
            const loading = this.$loading({
                lock: true,
                target: document.getElementById('roleTree'),
                text: '加载中'
            })

            // 获取指定用户所拥有的所有权限
            Role.getAllMenuIdsByRoleId(this.formData.id)
            .then(response => {
                this.$refs.tree.setCheckedKeys(response.data.items)
                // 关闭加载提示
                loading.close()
            })
        },
        /**
         * 重置表单的响应事件
         */
        resetFormData() {
            // 重置表单的角色数据
            this.$refs.roleForm.resetFields()
            // 重置表单的权限数据
            this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys)
        }
    }
}
</script>

<style scoped>
.el-table {
    width: 99%;
    margin: 20px 0px;
}
</style>
