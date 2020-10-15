<template>
    <div id="container">
        <!-- ECharts图表 -->
        <div id="employeeChart" style="width: 99%; height: 550px"></div>
    </div>
</template>

<script>
import * as ChartStatistics from '@/api/chartStatistics'
import * as echarts from 'echarts';

export default {
    data() {
        return {
            // 加载中提示Name
            loading: false,
            // 所有的部门名称以及它的员工总数
            departmentEmployeeCharts: [],
            // 所有的部门名称
            departmentNames: []
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
            let myChart = echarts.init(document.getElementById('employeeChart'))
            let loading = this.$loading({
                lock: true,
                target: document.getElementById('container'),
                text: '加载中'
            })

            ChartStatistics.getEmployeeChartInfo()
            .then(response => {
                this.departmentEmployeeCharts = response.data.items
                this.departmentEmployeeCharts.forEach(departmentEmployeeChart => {
                    this.departmentNames.push(departmentEmployeeChart.name)
                })
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
                    text: '员工统计'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '<strong>{a}<br/>{b}：</strong>{c} 人 ({d}%)'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {
                            readOnly: true
                        },
                        restore: {},
                        saveAsImage: {},
                    }
                },
                legend: {
                    data: this.departmentNames,
                    textStyle: {
                        fontWeight: 'bolder',
                        fontSize: 16
                    },
                    orient: 'vertical',
                    right: 0,
                    top: 50,
                    bottom: 20
                },
                series: [
                    {
                        name: '部门人数',
                        type: 'pie',
                        radius: '80%',
                        center: ['50%', '50%'],
                        data: this.departmentEmployeeCharts,
                        hoverOffset: 20,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 15,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            fontWeight: 'bolder',
                            fontSize: 18
                        },
                        labelLine: {
                            lineStyle: {
                                width: 1.5,
                                type: 'dashed'
                            }
                        },
                        itemStyle: {
                            borderWidth: 1,
                            borderType: 'dashed'
                        }
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