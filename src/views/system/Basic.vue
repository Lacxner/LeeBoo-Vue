<template>
    <!-- 右侧导航 -->
    <el-tabs tab-position="right" v-model="activeName">
        <el-tab-pane label="部门管理" name="department" :lazy="true">
            <Department></Department>
        </el-tab-pane>
        <el-tab-pane label="职位管理" name="position" :lazy="true">
            <Position></Position>
        </el-tab-pane>
        <el-tab-pane label="职称管理" name="rank" :lazy="true">
            <Rank></Rank>
        </el-tab-pane>
        <el-tab-pane label="奖惩管理" name="rewAndPuni" :lazy="true">
            <RewAndPuni></RewAndPuni>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import Department from '@/components/system/basic/Department.vue'
import Position from '@/components/system/basic/Position.vue'
import Rank from '@/components/system/basic/Rank.vue'
import RewAndPuni from '@/components/system/basic/RewAndPuni.vue'

export default {
    data() {
        return {
            activeName: 'department'
        }
    },
    // 这里每个导航页面是以组件的形式注册进来的
    components: {
        Department,
        Position,
        Rank,
        RewAndPuni
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