<template>
    <div style="display: flex; justify-content: flex-start">
        <!-- 备份数据库 -->
        <el-card class="box-card" shadow="hover">
            <!-- 标题栏 -->
            <div slot="header" style="display: flex; justify-content: space-between">
                <span style="font-size: 22px">备份数据库</span>
                <el-button type="primary" size="small" :loading="backupButton" @click="backup">备份</el-button>
            </div>
            <!-- 最近备份时间 -->
            <div>
                <span class="title">最近备份时间</span>
                <span style="font-size: 14px">
                    {{ databaseInfo.lastBackupTime != null ? databaseInfo.lastBackupTime : '-' }}
                </span>
            </div>
        </el-card>

        <!-- 还原数据库 -->
        <el-card class="box-card" style="margin-left: 20px" shadow="hover">
            <!-- 标题栏 -->
            <div slot="header" style="display: flex; justify-content: space-between">
                <span style="font-size: 22px">还原数据库</span>
                <el-button type="primary" size="small" :loading="restoreButton" @click="restore">还原</el-button>
            </div>
            <!-- 最近还原时间 -->
            <div>
                <span class="title">最近还原时间</span>
                <span style="font-size: 14px">
                    {{ databaseInfo.lastRestoreTime != null ? databaseInfo.lastRestoreTime : '-' }}
                </span>
            </div>
        </el-card>
    </div>
</template>

<script>
import * as Database from '@/api/database'
import * as Message from '@/utils/message'

export default {
    data() {
        return {
            // 数据库的备份还原信息
            databaseInfo: {
                lastBackupTime: null,
                lastRestoreTime: null
            },
            // 备份按钮
            backupButton: false,
            // 还原按钮
            restoreButton: false
        }
    },
    created() {
        this.refreshDatabaseInfo()
    },
    methods: {
        /**
         * 获取数据库备份和还原信息
         */
        refreshDatabaseInfo(res) {
            Database.getDatabase()
            .then(response => {
                this.databaseInfo = response.data.item
                Message.handle(res)
            })
        },
        /**
         * 备份数据库
         */
        backup() {
            this.$confirm('是否确定备份数据库?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.backupButton = true
                Database.backupDatabase()
                .then(response => {
                    this.refreshDatabaseInfo(response)
                    this.backupButton = false
                })
            }).catch(action => { })
        },
        /**
         * 还原数据库
         */
        restore() {
            this.$confirm('是否确定还原数据库?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.restoreButton = false
                Database.restoreDatabase()
                .then(response => {
                    this.refreshDatabaseInfo(response)
                    this.restoreButton = true
                })
            }).catch(action => { })
        }
    }
}
</script>

<style scoped>
.title {
    color: #99a9bf;
    display: inline-block;
    font-size: 18px;
    margin-right: 15px;
}
.box-card {
    width: 100%;
    border-radius: 8px;
}
.el-button {
    width: 80px;
}
</style>