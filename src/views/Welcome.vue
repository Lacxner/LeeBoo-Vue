<template>
    <div>
        <h1 v-if="user">欢迎您！{{ user.name }}</h1>
    </div>
</template>

<script>
import * as Menu from '@/api/menu'

export default {
    data() {
        return {
            user: localStorage.getItem('usr')
        }
    }
}
</script>