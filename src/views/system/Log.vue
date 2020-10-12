<template>
    <div>
        <!-- 顶部 -->
        <div>
            <el-input placeholder="请输入操作员用户名" v-model="username" clearable style="width: 400px; text-align: center" size="medium"></el-input>
            <!-- 查找按钮 -->
            <el-button type="primary" @click="search" style="margin-left: 20px" size="medium" icon="el-icon-search" :loading="searching">查找</el-button>
        </div>

        <!-- 中间部分 -->
        <!-- 系统日志列表 -->
        <el-table :data="tableData" ref="logTable" max-height="460" fit v-loading="tableLoading" element-loading-text="加载中" style="margin: 20px 0px" :default-sort="defaultSort">
            <!-- 序号 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="id" label="序号" width="80">
                <template slot-scope="scope">
                    {{ (currentPage - 1) * pageSize + scope.$index + 1 }} <!-- 序号的定义规则 -->
                </template>
            </el-table-column>
            <!-- 名称 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="method" label="名称" width="180"></el-table-column>
            <!-- 方式 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="pattern"
            label="方式" width="100" :filters="[{ text: '查询', value: '查询' }, { text: '添加', value: '添加' }, { text: '修改', value: '修改' }, { text: '删除', value: '删除' }]"
            :filter-method="filterTag">
                <!-- 根据不同的方式显示不同的标签样式 -->
                <template slot-scope="scope">
                    <el-tag :type="changeTagType(scope.row.pattern)" size="medium" effect="dark">{{ scope.row.pattern }}</el-tag>
                </template>
            </el-table-column>
            <!-- URL -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="url" label="URL"></el-table-column>
            <!-- 操作员 -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="username" label="操作员" width="120"></el-table-column>
            <!-- IP -->
            <el-table-column :resizable="false" show-overflow-tooltip header-align="center" align="center" prop="ip" label="IP" width="120"></el-table-column>
            <!-- 访问时间 -->
            <el-table-column :resizable="false" sortable show-overflow-tooltip header-align="center" align="center" prop="visitTime" label="访问时间" width="240"></el-table-column>
            <!-- 执行时长 -->
            <el-table-column :resizable="false" sortable show-overflow-tooltip header-align="center" align="center" prop="executionTime" label="执行时长" width="110">
                <template slot-scope="scope">
                    {{ scope.row.executionTime }} ms
                </template>
            </el-table-column>
        </el-table>

        <!-- 底部 -->
        <div style="display: flex; justify-content: space-between">
            <!-- 清空日志按钮 -->
            <el-button type="danger" @click="deleteAll" size="medium" icon="fa fa-trash" :loading="deleteAllLoading"> 全部删除</el-button>
            <!-- 分页 -->
            <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page.sync="currentPage"
            :page-sizes="[64, 128, 256, total]" :page-size="pageSize"></el-pagination>
        </div>
    </div>
</template>

<script>
import * as Log from '@/api/log'
import * as Message from '@/utils/message'

export default {
    data() {
        return {
            // 表格加载中提示
            tableLoading: true,
            // 清空日志加载中提示
            deleteAllLoading: false,
            // 搜索内容
            username: null,
            // 查找中提示
            searching: false,
            // 当前页码
            currentPage: 1,
            // 每页显示数
            pageSize: 64,
            // 总日志数
            total: 0,
            // 日志表格的排序策略
            defaultSort: {
                prop: 'visitTime',
                order: 'descending'
            },
            // 表格数据
            tableData: []
        }
    },
    created() {
        this.refreshAllLogs()
    },
    computed: {
        changeTagType(pattern) {
            return function(pattern) {
                    switch (pattern) {
                        case '添加':
                            return 'info'
                        case '修改':
                            return 'warning'
                        case '删除':
                            return 'danger'
                    }
                }
            }
    },
    methods: {
        /**
         * 获取所有系统日志
         */
        refreshAllLogs(res) {
            // 获取所有系统日志
            Log.getAllLogs(this.username, this.currentPage, this.pageSize)
            .then(response => {
                this.tableData = response.data.items
                // 日志总数
                this.total = response.data.total
                Message.handle(res)
                this.tableLoading = false
                this.searching = false
            })
        },
        /**
         * 查找按钮的点击事件
         */
        search() {
            this.username = this.username === '' ? null : this.username
            this.tableLoading = true
            this.searching = true
            this.refreshAllLogs()
        },
        /**
         * 清空所有日志
         */
        deleteAll() {
            // 再次确认删除
            this.$confirm(`是否确定要删除全部数据?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                    this.deleteAllLoading = true
                    this.tableLoading = true
                    
                    Log.deleteAllLogs()
                    .then(response => {
                        this.refreshAllLogs(response)
                        this.deleteAllLoading = false
                    })
            }).catch(action => {})
        },
        /**
         * 切换页面时的点击事件
         */
        handleCurrentChange() {
            this.tableLoading = true
            this.refreshAllLogs()
        },
        /**
         * 切换每页显示数时的点击事件
         */
        handleSizeChange(val) {
            this.pageSize = val
            this.tableLoading = true
            this.refreshAllLogs()
        },
        /**
         * 访问方法的方式的筛选
         */
        filterTag(value, row) {
            return row.pattern === value;
        }
    }
}
</script>

<style scoped>
.el-pagination /deep/ .el-pagination__total, .el-pagination /deep/  .el-pagination__jump {
    font-weight: 600;
}
</style>
