<template>
    <div class="container">
        <div style="font-size: 200px">404</div>
        <div style="font-size: 40px">对不起，未找到网站!</div>
        <div style="font-size: 20px; color: gray">请检查您输入的网址是否正确，请点击以下按钮返回主页</div>
        <el-button type="primary" @click="backToHome">返回主页</el-button>
    </div>
</template>

<script>
export default {
    methods: {
        backToHome() {
            this.$router.replace({ path: '/welcome' })
        }
    }
}
</script>

<style scoped>
/* 提示语通用设置 */
div {
    font-weight: bolder;
    text-align: center;
    margin-bottom: 30px;
}
/* 返回主页按钮 */
.el-button {
    width: 300px;
    margin: 0px auto;
}
/* 容器 */
.container {
    width: 800px;
    height: 460px;
    /* 水平和垂直居中 */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>