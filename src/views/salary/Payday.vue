<template>
    <div>
        <!-- 日历 -->
        <el-calendar v-model="date">
            <template slot="dateCell" slot-scope="{date, data}">
                <div class="cell" @click="confirmPayday(data)">
                    <p :class="data.isSelected ? 'is-selected' : ''" >
                        {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
                    </p>
                </div>
            </template>
        </el-calendar>
    </div>
</template>

<script>
import * as Payday from '@/api/payday'
import * as Message from '@/utils/message'

export default {
    data() {
        return {
            // 选中的日期
            date: null,
            // 当前月份
            currentMonth: null
        }
    },
    created() {
        this.initPayday()
    },
    methods: {
        /**
         * 初始化发薪日
         */
        initPayday() {
            Payday.getPayday()
            .then(response => {
                this.date = new Date().setDate(response.data.item.day)
                // 获取当前月份
                this.currentMonth = new Date(this.date).getMonth() + 1
            })
        },
        /**
         * 确定发薪日
         */
        confirmPayday(data) {
            // 只能修改当前月的发薪日
            let month = data.day.split('-')[1]
            if (month != this.currentMonth) {
                this.$message.error('请选择当前月的日期！');
                return
            }

            // 修改发薪日
            let day = data.day.split('-')[2]
            Payday.updatePayday(day)
            .then(response => {
                Message.handle(response)
            })
        }
    }
}
</script>

<style scoped>
.is-selected {
    color: orange;
}
.el-calendar /deep/ .el-calendar-day {
    padding: 0px;
}
.cell {
    width: 100%;
    height: 100%;
    padding: 8px;
}
</style>