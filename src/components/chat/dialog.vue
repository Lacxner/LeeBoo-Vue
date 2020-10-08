<template>
	<div id="app">
		<div class="sidebar">
			<Card></Card>
			<List></List>
		</div>
		<div class="main">
			<Message></Message>
			<UserText></UserText>
		</div>
	</div>
</template>

<script>
import Card from '@/components/chat/card'
import List from '@/components/chat/list'
import Message from '@/components/chat/message'
import UserText from '@/components/chat/usertext'

export default {
    components:{
        Card,
        List,
        Message,
        UserText
	},
	mounted() {
        this.$store.dispatch('initData')
	}
}
</script>

<style lang="scss" scoped>
#app {
    margin: 20px auto;
    width: 800px;
    height: 600px;
    overflow: hidden;
    border-radius: 10px;
    border: 4px solid black;
    .sidebar, .main {
        height: 100%;
    }
    .sidebar {
        float: left;
        color: #f4f4f4;
        background-color: black;
        width: 200px;
    }
    .main {
        position: relative;
        overflow: hidden;
        background-color: #eee;
    }
}
</style>