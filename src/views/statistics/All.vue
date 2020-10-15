<template>
    <div id="container" style="display: flex; justify-content: space-between">
        <!-- 综合统计信息 -->
        <!-- 总员工数 -->
        <el-card class="box-card">
            <div slot="header" style="text-align: center">
                <span style="font-size: 22px">总员工数</span>
            </div>
            <div style="font-size: 20px; text-align: center">{{ statistics.totalEmp == null ? '-' : statistics.totalEmp }}</div>
        </el-card>
        <!-- 入职员工数 -->
        <el-card class="box-card">
            <div slot="header" style="text-align: center">
                <span style="font-size: 22px; margin-right: 4px">新入职员工数</span>
                <!-- 入职员工数的提示 -->
                <el-tooltip class="item" effect="dark" :open-delay="250" content="统计的是今年新入职的员工总数" placement="top">
                    <i class="el-icon-info" style="color: gray"></i>
                </el-tooltip>
            </div>
            <div style="font-size: 20px; text-align: center">{{ statistics.newEmp == null ? '-' : statistics.newEmp }}</div>
        </el-card>
        <!-- 总部门数 -->
        <el-card class="box-card">
            <div slot="header" style="text-align: center">
                <span style="font-size: 22px">总部门数</span>
            </div>
            <div style="font-size: 20px; text-align: center">{{ statistics.totalDep == null ? '-' : statistics.totalDep }}</div>
        </el-card>
        <!-- 平均工资 -->
        <el-card class="box-card">
            <div slot="header" style="text-align: center">
                <span style="font-size: 22px">平均工资</span>
                <!-- 入职员工数的提示 -->
                <el-tooltip class="item" effect="dark" :open-delay="250" content="统计的是全部员工的平均工资" placement="top">
                    <i class="el-icon-info" style="color: gray"></i>
                </el-tooltip>
            </div>
            <div style="font-size: 20px; text-align: center">{{ statistics.avgSalary == null ? '-' : statistics.avgSalary }}</div>
        </el-card>
    </div>
</template>

<script>
import * as Statistics from '@/api/statistics'

export default {
    data() {
        return {
            // 加载中提示
            loading: false,
            // 综合统计信息
            statistics: {
                totalEmp: null,
                newEmp: null,
                totalDep: null,
                avgSalary: null
            }
        }
    },
    mounted() {
        this.loading = this.$loading({
                lock: true,
                target: document.getElementById('container'),
                text: '加载中'
            })
        this.refreshStatistics()
    },
    methods: {
        /**
         * 获取综合统计信息
         */
        refreshStatistics() {
            Statistics.getStatistics()
            .then(response => {
                this.statistics = response.data.item
                console.log(this.statistics)
                this.loading.close()
            })
        }
    }
}
</script>

<style scoped>
.item {
    margin: 4px;
}
.box-card {
    width: 280px;
    margin-top: 20px;
    border-radius: 8px;
}
.emptyTip {
	text-align: center;
	font-size: 22px;
	color: gray;
}
</style>