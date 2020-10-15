<template>
    <!-- 右侧导航 -->
    <el-tabs tab-position="right" v-model="activeName">
        <el-tab-pane label="工资统计" name="salaryStatistics" :lazy="true">
            <SalaryStatistics></SalaryStatistics>
        </el-tab-pane>
        <el-tab-pane label="员工统计" name="employeeStatistics" :lazy="true">
            <EmployeeStatistics></EmployeeStatistics>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import SalaryStatistics from '@/components/statistics/chart/SalaryStatistics.vue'
import EmployeeStatistics from '@/components/statistics/chart/EmployeeStatistics.vue'

export default {
    data() {
        return {
            activeName: 'salaryStatistics'
        }
    },
    // 这里每个导航页面是以组件的形式注册进来的
    components: {
        SalaryStatistics,
        EmployeeStatistics
    }
}
</script>

<style scoped>
.el-tabs {
    margin-top: 20px;
}
.el-tabs /deep/ .el-tabs__item {
    font-weight: 600;
}
</style>