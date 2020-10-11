<template>
    <div>
        <!-- 顶部 -->
        <el-input placeholder="请输入关键字进行筛选" v-model="search" clearable style="width: 500px; text-align: center" size="medium">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!-- 添加职称按钮 -->
        <el-button type="primary" @click="openDialog(null)" style="margin-left: 20px" size="medium" icon="el-icon-plus" :loading="addLoading">添加职称</el-button>

        <!-- 中间部分 -->
        <!-- 职称列表 -->
        <el-table :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        ref="rankTable" max-height="460" fit @selection-change="handleSelectionChange"
        v-loading="tableLoading" element-loading-text="加载中">
            <!-- 勾选框 -->
            <el-table-column :resizable="false" header-align="center" align="center" type="selection" width="100"></el-table-column>
            <!-- 序号 -->
            <el-table-column :resizable="false" header-align="center" align="center" type="index" prop="id" label="序号" width="100"></el-table-column>
            <!-- 职称名称和创建时间是可以排序的 -->
            <!-- 职称名称 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="name" label="名称" width="220"></el-table-column>
            <!-- 职称级别 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="level" label="级别" width="100"
            :filters="[{ text: '专家', value: '专家' }, { text: '高级', value: '高级' }, { text: '中级', value: '中级' }, { text: '初级', value: '初级' }, { text: '见习', value: '见习' }]"
            :filter-method="filterTag">
                <!-- 根据不同的级别显示不同的标签样式 -->
                <template slot-scope="scope">
                    <el-tag :type="changeTagType(scope.row.level)" size="medium">{{ scope.row.level }}</el-tag>
                </template>
            </el-table-column>
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
                    <el-button size="mini" type="danger" style="width: 70px" @click="deleteRank(scope.row.id)">
                    <i class="fa fa-trash"></i> 删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或编辑职称对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" @closed="resetFormData">
            <!-- 职称表单 -->
            <el-form :model="formData" ref="rankForm" :rules="formRules" status-icon label-width="52px">
                <!-- 职称名称 -->
                <el-form-item label="名称" prop="name" size="medium">
                    <el-input type="input" v-model="formData.name" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 职称级别 -->
                <el-form-item label="级别" prop="level" size="medium">
                    <el-select v-model="formData.level" placeholder="请选择职称级别">
                        <el-option label="专家" value="专家"></el-option>
                        <el-option label="高级" value="高级"></el-option>
                        <el-option label="中级" value="中级"></el-option>
                        <el-option label="初级" value="初级"></el-option>
                        <el-option label="见习" value="见习"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            
            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="dialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="addOrEditRank" size="medium">确定</el-button>
            </span>
        </el-dialog>

        <!-- 底部 -->
        <!-- 批量删除职称按钮 -->
        <el-button type="danger" @click="deleteSelection" size="medium" icon="fa fa-trash" :loading="batchDeleteLoading"> 批量删除</el-button>
        <!-- 取消全部的选中项按钮 -->
        <el-button @click="cancelSelection" size="medium" icon="fa fa-ban"> 全部取消</el-button>
    </div>
</template>

<script>
import * as Rank from '@/api/rank'
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
            // 添加或编辑时表单的职称
            formData: {
                name: null,
                level: '初级'
            },
            // 对话框标题
            dialogTitle: '添加职称',
            // 表格数据
            tableData: [],
            // 校验规则
            formRules: {
                name: [
                    { required: true, message: '名称不能为空！', trigger: 'blur' },
                    { min: 2, max: 12, message: '名称长度必须在2~12之间！',  trigger: 'blur' },
                    { pattern: /^[\w（）\u4e00-\u9fa5]{2,12}$/, message: '名称含有非法字符！', trigger: 'blur' }
                ],
                level: [
                    { required: true, message: '级别不能为空！', trigger: 'blur' }
                ]
            },
            // 是否打开对话框
            dialogVisible: false,
            // 所有的多选项
            multipleSelection: []
        }
    },
    created() {
        this.refreshAllRanks()
    },
    computed: {
        changeTagType(level) {
            return function(level) {
                    switch (level) {
                        case '初级':
                            return null
                        case '中级':
                            return 'success'
                        case '高级':
                            return 'warning'
                        case '见习':
                            return 'info'
                        case '专家':
                            return 'danger'
                    }
                }
            }
    },
    methods: {
        /**
         * 获取所有职称
         */
        refreshAllRanks(res) {
            // 获取所有职称
            Rank.getAllRanks()
            .then(response => {
                this.tableData = response.data.items
                Message.handle(res)
                this.tableLoading = false
            })
        },
        /**
         * 点击添加或编辑按钮时打开对话框，对话框会动态适应
         * 如果是修改操作就传入当前要编辑的职称，反之添加就传入null
         */
        openDialog(currentRank) {
            // 根据方法是否传入职称来判断是添加或是编辑对话框
            if (currentRank) {
                this.dialogTitle = '修改职称'
                
                /**
                 * 数据回显
                 * 使用nextTick保证在Dialog的DOM更新完成后再赋值，如果直接赋值会导致Dialog的resetFields方法失效
                 * 解释：https://blog.csdn.net/wangzi1993/article/details/104424844/
                 */
                this.$nextTick(() => {
                    this.formData = Generic.deeper(currentRank)
                })
            } else {
                this.dialogTitle = '添加职称'
            }
            this.dialogVisible = true
        },
        /**
         * 添加或编辑职称
         */
        addOrEditRank() {
            this.$refs.rankForm.validate((valid) => {
                if (valid) {
                    this.dialogVisible = false
                    this.tableLoading = true
                    
                    // 如果当前表单数据的id属性有值就代表要修改，反之就表示添加
                    if (this.formData.id) {
                        // 修改职称
                        Rank.updateRank(this.formData)
                        .then(response => {
                            this.refreshAllRanks(response)
                        })
                    } else {
                        this.addLoading = true
                        // 添加职称
                        Rank.addRank(this.formData)
                        .then(response => {
                            this.refreshAllRanks(response)
                            this.addLoading = false
                        })
                    }
                } else {
                    return false
                }
            })
        },
        /**
         * 删除职称
         */
        deleteRank(id) {
            // 再次确认删除
            this.$confirm('是否确定要删除这条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 删除指定职称
                this.tableLoading = true
                Rank.deleteRankById(id)
                .then(response => {
                    this.refreshAllRanks(response)
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
                if (this.multipleSelection.length > 0) {
                    this.batchDeleteLoading = true
                    this.tableLoading = true
                    // 提取出所有选中职称的id并封装成一个数组
                    let ids = []
                    this.multipleSelection.forEach(selection => {
                        ids.push(selection.id)
                    })
                    
                    // 批量删除选中的职称，删除成功后刷新职称列表
                    Rank.deleteBatchRankByIds(ids)
                    .then(response => {
                        this.refreshAllRanks(response)
                        this.batchDeleteLoading = false
                    })
                }
            }).catch(action => {})
        },
        /**
         * 取消所有选中项
         */
        cancelSelection() {
            if (this.multipleSelection.length > 0) {
                this.$refs.rankTable.clearSelection()
            }
        },
        /**
         * 是否可用按钮的点击事件
         */
        changeEnabled(rank) {
            Rank.updateRankEnabled(rank)
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
            this.$refs.rankForm.resetFields()
        },
        /**
         * 职称级别的过滤方法
         */
        filterTag(value, row) {
            return row.level === value
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
