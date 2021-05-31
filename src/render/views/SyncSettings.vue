
<template>
    <div class="cfg">
        <el-form ref="form" :model="syncInfo" label-width="auto">
            <el-form-item label="github登录名">
                 <el-input class="input"  v-model="syncInfo.githubLoginName" />
            </el-form-item>
            <el-form-item label="仓库前缀名">
                <el-input class="input" v-model="syncInfo.repoPrefixName" />
            </el-form-item>
             <el-form-item label="docset保存目录">
                <el-input class="input" v-model="syncInfo.docsetSavePath" />
            </el-form-item>
            <el-form-item>
                <el-button class="button" @click="saveSyncInfo">保存</el-button>
            </el-form-item>
        </el-form>        
    </div>
    
</template>



<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import * as constant from '@/common/info/const'
    import { SyncConfigInfo } from '@/common/info/config'

    @Component({})
    export default class SyncSettings extends Vue {

        private syncInfo = new SyncConfigInfo()
        

        created() {
            this.$store.get(constant.SKEY_CFG_SYNC)
                       .then(val => this.syncInfo = val)
        }


        saveSyncInfo() {
            this.$store.set(constant.SKEY_CFG_SYNC, this.syncInfo)
        }

    }
</script>

<style lang="scss" scoped>
    .cfg {
        display: flex;
        flex-direction: column;


        .developer-info {
            width: auto;
            margin-left: 10px;
            margin-right: 10px;
            margin-bottom: 10px;

            .oper {
                margin-top: 10px;
            }
        }
        
    }
</style>