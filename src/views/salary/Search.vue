<template>
    <div>
        <!-- 顶部 -->
        <div>
            <el-input placeholder="请输入员工姓名" v-model="name" clearable style="width: 400px; text-align: center" size="medium"></el-input>
            <!-- 查找按钮 -->
            <el-button type="primary" @click="search" style="margin-left: 20px" size="medium" icon="el-icon-search">查找</el-button>
        </div>

        <!-- 员工工资表 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="font-size: 22px">工资表</span>
            </div>
            <!-- 基础工资 -->
            <div class="item">
                <span class="title">基础工资</span>{{ salary.basicSalary }} 元
            </div>
            <!-- 奖金 -->
            <div class="item">
                <span class="title">奖金</span>{{ salary.bonus }} 元
            </div>
            <!-- 罚金 -->
            <div class="item">
                <span class="title">罚金</span>{{ salary.punishment }} 元
            </div>
            <!-- 午餐补助 -->
            <div class="item">
                <span class="title">午餐补助</span>{{ salary.lunchSalary }} 元
            </div>
            <!-- 交通补助 -->
            <div class="item">
                <span class="title">交通补助</span>{{ salary.trafficSalary }} 元
            </div>
            <!-- 应发工资 -->
            <div class="item">
                <span class="title">应发工资</span>{{ salary.allSalary }} 元
            </div>
            <!-- 养老保险 -->
            <div class="item">
                <span class="title">养老保险</span>{{ (salary.pensionBase * (salary.pensionPer / 100)).toFixed(2) }} 元
            </div>
            <!-- 医疗保险 -->
            <div class="item">
                <span class="title">医疗保险</span>{{ (salary.medicalBase * (salary.medicalPer / 100)).toFixed(2) }} 元
            </div>
            <!-- 公积金 -->
            <div class="item">
                <span class="title">公积金</span>{{ (salary.accumulationFundBase * (salary.accumulationFundPer / 100)).toFixed(2) }} 元
            </div>
            <!-- 实发工资 -->
            <div class="item" style="font-size: 22px; color: orange">
                <span class="title" style="font-size: 24px; width: 110px">实发工资</span>{{ salary.actualSalary }} 元
            </div>
        </el-card>
    </div>
</template>

<script>
import * as Salary from '@/api/salary'
import * as Message from '@/utils/message'

export default {
    data() {
        return {
            // 员工的工资信息
            salary: {
                basicSalary: 0,
                bonus: 0,
                punishment: 0,
                lunchSalary: 0,
                trafficSalary: 0,
                allSalary: 0,
                pensionBase: 0,
                pensionPer: 0,
                medicalBase: 0,
                medicalPer: 0,
                accumulationFundBase: 0,
                accumulationFundPer: 0,
                actualSalary: 0
            },
            // 查询的员工的名称
            name: null
        }
    },
    methods: {
        /**
         * 查询指定员工的工资表
         */
        search() {
            this.name = this.name === '' ? null : this.name

            Salary.getSalaryByName(this.name)
            .then(response => {
                if (response.data.item != null) {
                    this.salary = response.data.item
                } else {
                    Message.handle(response)
                }
            })
        },
    }
}
</script>

<style scoped>
.item {
    font-size: 14px;
    margin-bottom: 18px;
}
.title {
    color: #99a9bf;
    display: inline-block;
    font-size: 16px;
    width: 80px;
}
/* .title:last-child {
    font-size: 22px;
} */
.clearfix:before, .clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}
.box-card {
    width: 600px;
    margin-top: 20px;
}
</style>