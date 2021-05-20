

<template>
    <div>
       <el-row type="flex"  justify="left" >
            <el-button class="button" plain @click="handleSync" :loading=syncDoing >同步</el-button>
       </el-row>
       <el-row type="flex"  justify="center" >
        <p>本地文档</p>
       </el-row>
       <el-table class="pkgs" stripe :data=localPkgs empty-text="无数据">
            <el-table-column prop="name" label="名字" style="width:30%"/>
            <el-table-column prop="ver" label="版本" style="width:30%"/>
       </el-table>
    </div>
    
</template>


<script lang="ts">
    import { PkgLocalInfo, SyncPkgResultInfo } from '@/common/info/data'
    import { Component, Vue } from 'vue-property-decorator'
    import * as constant from '@/common/info/const'


    @Component({})
    export default class Sync extends Vue {

        private localPkgs: PkgLocalInfo[] = []
        private syncDoing = false

        created() {
            this.refresh()
        }

        refresh() {
            this.$store.get(constant.SKEY_PKG_LOCAL)
                       .then(val => this.localPkgs = val)

        }

        handleSync() {
            this.syncDoing = true
            window.ipcRenderer.invoke('syncPkgs').then((result: SyncPkgResultInfo) => {
                this.syncDoing = false
                if(result.isOK) {
                    this.$message.success('同步成功')
                }
                else {
                    this.$message.error('同步出错')
                }
            })
        }

    }

</script>

<style lang="scss" scoped>
    .button {
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>