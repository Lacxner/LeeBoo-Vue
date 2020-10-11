<template>
    <div>
        <!-- 顶部 -->
        <el-input placeholder="请输入关键字进行筛选" v-model="search" clearable style="width: 500px; text-align: center" size="medium">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!-- 添加职位按钮 -->
        <el-button type="primary" @click="openDialog(null)" style="margin-left: 20px" size="medium" icon="el-icon-plus" :loading="addLoading">添加职位</el-button>

        <!-- 中间部分 -->
        <!-- 职位列表 -->
        <el-table :data="tableData.filter(data => !search 
            || data.name.toLowerCase().includes(search.toLowerCase()))"
        ref="positionTable" max-height="460" fit @selection-change="handleSelectionChange"
        v-loading="tableLoading" element-loading-text="加载中">
            <!-- 勾选框 -->
            <el-table-column :resizable="false" header-align="center" align="center" type="selection" width="100"></el-table-column>
            <!-- 序号 -->
            <el-table-column :resizable="false" header-align="center" align="center" type="index" prop="id" label="序号" width="100"></el-table-column>
            <!-- 职位名称和创建时间是可以排序的 -->
            <!-- 职位名称 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="name" label="名称" width="280"></el-table-column>
            <!-- 创建时间 -->
            <el-table-column :resizable="false" sortable header-align="center" align="center" prop="createTime" label="创建时间"></el-table-column>
            <!-- 是否启用 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="enabled" label="启用" width="100">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.enabled" @change="changeEnabled(scope.row)" active-color="#13ce66"></el-switch>
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column :resizable="false" header-align="center" align="center" label="操作" width="220">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <el-button size="mini" style="width: 70px" @click="openDialog(scope.row)">
                    <i class="el-icon-edit"></i> 编辑</el-button>
                    <!-- 删除按钮 -->
                    <el-button size="mini" type="danger" style="width: 70px" @click="deletePosition(scope.row.id)">
                    <i class="fa fa-trash"></i> 删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或编辑职位对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" @closed="resetFormData">
            <!-- 职位表单 -->
            <el-form :model="formData" ref="positionForm" :rules="formRules" status-icon label-width="52px">
                <!-- 职位名称 -->
                <el-form-item label="名称" prop="name" size="medium">
                    <el-input type="input" v-model="formData.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            
            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="dialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="addOrEditPosition" size="medium">确定</el-button>
            </span>
        </el-dialog>

        <!-- 底部 -->
        <!-- 批量删除职位按钮 -->
        <el-button type="danger" @click="deleteSelection" size="medium" icon="fa fa-trash" :loading="batchDeleteLoading"> 批量删除</el-button>
        <!-- 取消全部的选中项按钮 -->
        <el-button @click="cancelSelection" size="medium" icon="fa fa-ban"> 全部取消</el-button>
    </div>
</template>

<script>
import * as Position from '@/api/position'
import * as Message from '@/utils/message'
import * as Generic from '@/utils/generic'

export default {
    data() {
        return {
            // 批量删除中提示
            batchDeleteLoading: false,
            // 添加中提示
            addLoading: false,
            // 表格加载中提示
            tableLoading: true,
            // 搜索内容
            search: '',
            // 添加或编辑时表单的职位
            formData: {
                name: null
            },
            // 对话框标题
            dialogTitle: '添加职位',
            // 校验规则
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
            tableData: [],
            // 所有的多选项
            multipleSelection: []
        }
    },
    created() {
        this.refreshAllPositions()
    },
    methods: {
        /**
         * 获取所有职位
         */
        refreshAllPositions(res) {
            // 获取所有职位
            Position.getAllPositions()
            .then(response => {
                this.tableData = response.data.items
                Message.handle(res)
                this.tableLoading = false
            })
        },
        /**
         * 点击添加或编辑按钮时打开对话框，对话框会动态适应
         * 如果是修改操作就传入当前要编辑的职位，反之添加就传入null
         */
        openDialog(currentPosition) {
            // 根据方法是否传入职位来判断是添加或是编辑对话框
            if (currentPosition) {
                this.dialogTitle = '修改职位'

                // 数据回显
                this.$nextTick(() => {
                    this.formData = Generic.deeper(currentPosition)
                })
            } else {
                this.dialogTitle = '添加职位'
            }
            this.dialogVisible = true
        },
        /**
         * 添加或编辑职位
         */
        addOrEditPosition() {
            this.$refs.positionForm.validate((valid) => {
                if (valid) {
                    // 点击了确定后立马关闭对话框并开启加载中提示，提高用户体验
                    this.dialogVisible = false
                    this.tableLoading = true
                    // 如果当前表单数据的id属性有值就代表要修改，反之就表示添加
                    if (this.formData.id) {
                        // 修改职位
                        Position.updatePositionName(this.formData)
                        .then(response => {
                            this.refreshAllPositions(response)
                        })
                    } else {
                        this.addLoading = true
                        // 添加职位
                        Position.addPosition(this.formData)
                        .then(response => {
                            this.refreshAllPositions(response)
                            this.addLoading = false
                        })
                    }
                } else {
                    return false
                }
            })
        },
        /**
         * 删除职位
         */
        deletePosition(id) {
            // 再次确认删除
            this.$confirm('是否确定要删除这条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 删除指定职位
                this.tableLoading = true
                Position.deletePositionById(id)
                .then(response => {
                    this.refreshAllPositions(response)
                })
            }).catch(action => { })
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
                if (this.multipleSelection.length > 0) {
                    this.batchDeleteLoading = true
                    this.tableLoading = true
                    // 提取出所有选中职位的id并封装成一个数组
                    let ids = []
                    this.multipleSelection.forEach(selection => {
                        ids.push(selection.id)
                    })
                    
                    // 批量删除选中的职位，删除成功后刷新职位列表
                    Position.deleteBatchPositionByIds(ids)
                    .then(response => {
                        this.refreshAllPositions(response)
                        this.batchDeleteLoading = false
                    })
                }
            }).catch(action => { })
        },
        /**
         * 取消所有选中项
         */
        cancelSelection() {
            if (this.multipleSelection.length > 0) {
                this.$refs.positionTable.clearSelection()
            }
        },
        /**
         * 是否可用按钮的点击事件
         */
        changeEnabled(position) {
            Position.updatePositionEnabled(position)
        },
        /**
         * 更新选中的多选项
         */
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        /**
         * 重置表单并清除校验结果
         */
        resetFormData() {
            this.$refs.positionForm.resetFields()
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
