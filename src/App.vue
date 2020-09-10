<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
body{
  margin: 0;
}

.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix::after{
  clear: both;
  display: block;
  content:""
}

.auto-img{
  width: 100%;
  height: 100%;
}

html{
  user-select: none;

}
</style>
