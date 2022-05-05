<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.auto-img {
	display: block;
	width: 100%;
	height: 100%;
}
// 清除浮动
.clearflx::after {
	content: '';
	display: block;
	clear: both;
}
.text-ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.fl {
	float: left;
}
.fr {
	float: right;
}
</style>
