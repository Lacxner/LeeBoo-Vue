<template>
    <div>
        <!-- 顶部 -->
        <div>
            <el-input placeholder="请输入员工姓名" v-model="name" clearable style="width: 400px; text-align: center" size="medium"></el-input>
            <!-- 查找按钮 -->
            <el-button type="primary" @click="search" style="margin-left: 20px" size="medium" icon="el-icon-search" :loading="searching">查找</el-button>
        </div>

        <!-- 员工工资表 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="font-size: 22px">工资表</span>
            </div>
            <div v-if="salary" class="items">
                <!-- 基础工资 -->
                <div>
                    <span>基础工资</span>{{ salary.basicSalary }} 元
                </div>
                <!-- 奖金 -->
                <div>
                    <span>奖金</span>{{ salary.reward }} 元
                </div>
                <!-- 罚金 -->
                <div>
                    <span>罚金</span>{{ salary.punishment }} 元
                </div>
                <!-- 午餐补助 -->
                <div>
                    <span>午餐补助</span>{{ salary.lunchSalary }} 元
                </div>
                <!-- 交通补助 -->
                <div>
                    <span>交通补助</span>{{ salary.trafficSalary }} 元
                </div>
                <!-- 应发工资 -->
                <div>
                    <span>应发工资</span>{{ salary.allSalary }} 元
                </div>
                <!-- 养老保险 -->
                <div>
                    <span>养老保险</span>{{ (salary.pensionBase * (salary.pensionPer / 100)).toFixed(2) }} 元
                </div>
                <!-- 医疗保险 -->
                <div>
                    <span>医疗保险</span>{{ (salary.medicalBase * (salary.medicalPer / 100)).toFixed(2) }} 元
                </div>
                <!-- 公积金 -->
                <div>
                    <span>公积金</span>{{ (salary.accumulationFundBase * (salary.accumulationFundPer / 100)).toFixed(2) }} 元
                </div>
                <!-- 实发工资 -->
                <div>
                    <span style="font-size: 24px">实发工资</span>{{ salary.actualSalary }} 元
                </div>
            </div>
            <div v-else>
				<div class="emptyTip">暂无内容</div>
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
            salary: null,
            // 查询的员工的名称
            name: null,
            // 查找中提示
            searching: false,
        }
    },
    methods: {
        /**
         * 查询指定员工的工资表
         */
        search() {
            this.searching = true
            this.name = this.name === '' ? null : this.name

            Salary.getSalaryByEmployeeName(this.name)
            .then(response => {
                this.salary = response.data.item
                if (response.data.item == null) {
                    Message.handle(response)
                }
                this.searching = false
            })
        },
    }
}
</script>

<style scoped>
.items div{
    font-size: 14px;
    margin-bottom: 18px;
}
.items div span {
    color: #99a9bf;
    display: inline-block;
    font-size: 18px;
    margin-right: 15px;
}
.clearfix:before, .clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}
.box-card {
    width: 700px;
    margin-top: 20px;
}
.items div:last-child {
    font-size: 22px !important;
    color: orange !important;
    margin-bottom: 0px !important;
}
.emptyTip {
	text-align: center;
	font-size: 22px;
	color: gray;
}
</style>