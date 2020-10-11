<template>
    <div>
        <!-- 顶部 -->
        <el-input placeholder="请输入关键字进行筛选" v-model="filterText" clearable  style="width: 500px; text-align: center" size="medium">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>

        <!-- 中间部分 -->
        <!-- 部门树型图 -->
        <el-tree ref="tree" id="departmenTree" default-expand-all :data="departments" :props="defaultProps" :filter-node-method="filterNode"
        :expand-on-click-node="false" empty-text="暂无数据">
            <span slot-scope="{ data }" class="departmentItem">
                <span style="flex: 1">
                    <!-- 部门名 -->
                    <span>{{ data.name }}</span>
                </span>

                <!-- 操作按钮 -->
                <span style="width: 450px">
                    <el-button type="primary" size="mini" @click="dialogVisible = true, formData.parentId = data.id" style="padding: 4px">添加</el-button>
                    <el-button type="danger" size="mini" @click="remove(data)" style="padding: 4px">删除</el-button>
                </span>
            </span>
        </el-tree>

        <!-- 添加部门对话框 -->
        <el-dialog title="添加部门" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" @closed="resetFormData">
            <!-- 添加部门表单 -->
            <el-form :model="formData" ref="departmentForm" :rules="formRules" status-icon label-width="52px">
                <!-- 部门名称 -->
                <el-form-item label="名称" prop="name" size="medium">
                    <el-input type="input" v-model="formData.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>

            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="append" size="medium">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as Department from '@/api/department'
import * as Message from '@/utils/message'

export default {
    data() {
        return {
            // 添加或编辑时表单的部门
            formData: {
                name: null,
                parentId: 0,
            },
            // 过滤文本
            filterText: '',
            // 部门列表加载中提示
            treeLoading: null,
            // 添加部门表单校验规则
            formRules: {
                name: [
                    { required: true, message: '名称不能为空！', trigger: 'blur' },
                    { min: 2, max: 12, message: '名称长度必须在2~12之间！',  trigger: 'blur' },
                    { pattern: /^[\w_-（）\u4e00-\u9fa5]{2,12}$/, message: '名称含有非法字符！', trigger: 'blur' }
                ]
            },
            // 是否打开对话框
            dialogVisible: false,
            // 表格数据
            departments: [],
            // 当前所有要删除的部门id
            deleteDepartmentIds: [],
            // 部门树型结构的映射关系
            defaultProps: {
                label: 'name',
                children: 'children'
            }
        }
    },
    created() {
        this.$nextTick(() => {
            this.treeLoading = this.getTreeLoading()
        })
        this.refreshAllDepartments()
    },
    watch: {
        filterText(val) {
            // 遍历部门树型结构中的每个节点
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        /**
         * 获取所有部门
         */
        refreshAllDepartments(res) {
            // 获取所有部门
            Department.getAllDepartments()
            .then(response => {
                this.departments = response.data.items
                Message.handle(res)
                this.treeLoading.close()
            })
        },
        /**
         * 添加部门
         */
        append() {
            this.$refs.departmentForm.validate((valid) => {
                if (valid) {
                    // 点击了确定后立马关闭对话框并开启加载中提示，提高用户体验
                    this.dialogVisible = false
                    this.treeLoading = this.getTreeLoading()

                    // 添加部门
                    Department.addDepartment(this.formData)
                    .then(response => {
                        this.refreshAllDepartments(response)
                    })
                } else {
                    return false
                }
            })
        },
        /**
         * 删除部门
         */
        remove(department) {
            // 需要将所有要删除的部门id都存入一个数组中
            let deleteDepartmentIds = []
            this.iterateChildren(department, deleteDepartmentIds)

            // 再次确认删除
            this.$confirm('是否确定要删除这 ' + deleteDepartmentIds.length + ' 条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.treeLoading = this.getTreeLoading()

                // 根据要删除部门个数调用不同的方法
                if (deleteDepartmentIds.length === 1) {
                    Department.deleteDepartmentById(department.id, department.parentId)
                    .then(response => {
                        this.refreshAllDepartments(response)
                    })
                } else {
                    Department.deleteBatchDepartmentByIds(deleteDepartmentIds, department.parentId)
                    .then(response => {
                        this.refreshAllDepartments(response)
                    })
                }
            }).catch(action => {})
        },
        /**
         * 删除部门时遍历其所有的子部门，将自身id和所有子部门id添加进一个数组中
         */
        iterateChildren(value, deleteDepartmentIds) {
            // 先获取当前部门的id
            deleteDepartmentIds.push(value.id)
            // 判断当前部门是否还有子部门
            if (value.children.length !== 0) {
                // 如果有子部门就遍历其所有子部门的集合
                value.children.forEach(department => {
                    // 再对每个子部门重复如上操作
                    this.iterateChildren(department, deleteDepartmentIds)
                })
            } else {
                return
            }
        },
        /**
         * 重置表单并清除校验结果
         */
        resetFormData() {
            this.$refs.departmentForm.resetFields()
        },
        /**
         * 内容过滤方法
         * 返回true表示这个节点可以显示，返回false则表示这个节点会被隐藏
         */
        filterNode(value, data) {
            
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        /**
         * 创建并获取树型结构的加载中提示对象
         */
        getTreeLoading() {
            const loading = this.$loading({
                lock: true,
                target: document.getElementById('departmenTree'),
                text: '加载中'
            })
            return loading
        }
    }
}   
</script>

<style scoped>
.el-tree {
    width: 99%;
    margin: 20px 0px;
    font-size: 18px;
}
.departmentItem {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
</style>