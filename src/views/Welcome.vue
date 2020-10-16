<template>
    <div style="display: flex; justify-content: space-between">
        <!-- 提示标语 -->
        <span style="font-size: 34px">{{ tip }}<span style="color: gray">{{ user.name }}</span></span>
        
        <!-- 通知 -->
        <el-card id="noticeCard" class="box-card">
            <div slot="header" class="clearfix">
                <div style="font-size: 22px; text-align: center">通知</div>
            </div>
            <!-- 以Html形式显示通知内容 -->
            <div class="text item" v-html="notice.content"></div>
        </el-card>
    </div>
</template>

<script>
import * as Notice from '@/api/notice'

export default {
    data() {
        return {
            // 当前用户
            user: JSON.parse(localStorage.getItem('user')),
            // 欢迎提示
            tip: null,
            // 通知内容
            notice: {
                content: null
            },
            // 加载中提示
            loading: null
        }
    },
    mounted() {
        let hour = new Date().getHours()
        if (hour >= 5 && hour < 12) {
            this.tip = '上午好！'
        } else if (hour >= 12 && hour < 13) {
            this.tip = '中午好！'
        } else if (hour >= 13 && hour < 18) {
            this.tip = '下午好！'
        } else {
            this.tip = '晚上好！'
        }

        this.loading = this.$loading({
            lock: true,
            target: document.getElementById('noticeCard'),
            text: '加载中'
        })
        this.initNotice()
    },
    methods: {
        /**
         * 初始化通知
         */
        initNotice() {
            Notice.getNotice()
            .then(response => {
                this.notice = response.data.item
                this.loading.close()
            })
        }
    }
}
</script>

<style scoped>
.tip {
    
}
.text {
    font-size: 14px;
}
.item {
    margin-bottom: 18px;
}
.clearfix:before, .clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}
.box-card {
    width: 550px;
    height: 550px;
    border-radius: 8px;
}
</style>