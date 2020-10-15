<template>
    <div id="container">
        <!-- ECharts图表 -->
        <div id="salaryChart" style="width: 90%; height: 550px"></div>
    </div>
</template>

<script>
import * as ChartStatistics from '@/api/chartStatistics'
import * as echarts from 'echarts'

export default {
    data() {
        return {
            // 加载中提示Name
            loading: false,
            // 所有的部门名称
            departmentNames: [],
            // 各个部门的最低工资
            minSalaryList: [],
            // 各个部门的最高工资
            maxSalaryList: [],
            // 各个部门的平均工资
            avgSalaryList: []
        }
    },
    mounted() {
        this.initChart()
    },
    methods: {
        /**
         * 初始化图表
         */
        initChart() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('salaryChart'))
            let loading = this.$loading({
                lock: true,
                target: document.getElementById('container'),
                text: '加载中'
            })

            ChartStatistics.getSalaryChartInfo()
            .then(response => {
                this.departmentNames = response.data.departmentNames
                this.minSalaryList = response.data.minSalaryList
                this.maxSalaryList = response.data.maxSalaryList
                this.avgSalaryList = response.data.avgSalaryList
                // 绘制图表
                myChart.setOption({ ...this.chartOption() })
                loading.close()
            })
        },
        /**
         * 设置图表详细信息
         */
        chartOption() {
            let option = {
                title: {
                    text: '工资统计',
                    textStyle: {
                        fontWeight: 'bolder',
                        fontSize: 22
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow',
                        label: {
                            backgroundColor: '#283b56'
                        }
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {
                            readOnly: true
                            },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                legend: {
                    data: ['最低工资', '最高工资', '平均工资'],
                    textStyle: {
                        fontWeight: 'bolder',
                        fontSize: 16
                    }
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: '10%',
                    containLabel: true
                },
                dataZoom: {   // 这个dataZoom组件，默认控制x轴
                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                    start: 0, // 左边在 0% 的位置
                    end: 40, // 右边在 40% 的位置
                    fillerColor: 'rgba(190,190,190,0.6)',
                    showDetail: false
                },
                xAxis: {
                    type: 'category',
                    data: this.departmentNames,
                    axisLabel: {
                        fontWeight: 'bolder',
                        fontSize: 14
                    }
                }
                ,
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        fontWeight: 'bolder',
                        fontSize: 14
                    }
                },
                series: [
                    {
                        name: '最低工资',
                        type: 'bar',
                        data: this.minSalaryList
                    },
                    {
                        name: '最高工资',
                        type: 'bar',
                        data: this.maxSalaryList
                    },
                    {
                        name: '平均工资',
                        type: 'bar',
                        data: this.avgSalaryList
                    }
                ]
            }
            return option
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
</style>