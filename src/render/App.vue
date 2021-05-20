<template>
  <div id="app">
    <el-container style="height:600px;width:800px" >
      <el-header class="header">docset自动同步工具 {{version}}</el-header>

      <el-container>
        <el-aside style="width:15%; background-color:rgb(238, 241, 246)">
          <navmenu></navmenu>
        </el-aside>

        <el-main style="background-color:white">
          <router-view v-wechat-title="$route.meta.title" ></router-view>
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<script lang="ts">
  import NavMenu from "@/render/components/NavMenu.vue"
  import { Component, Vue } from 'vue-property-decorator'
  import pkg from 'root/package.json'


  @Component({
    components: {navmenu: NavMenu}
  })
  export default class App extends Vue {
    private version = process.env.NODE_ENV === 'production' ? pkg.version : 'Dev'

  }


</script>

<style lang="scss">

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;

    .header {
      line-height: 60px;
      background-color:rgb(0, 241, 246);
      text-align: center;
      font-size: 1.875em;
    }
  }

</style>
