
<template>
    <div class="cfg">
        <el-row class="setting-list">
            <el-col :span="16" :offset="4">
                <el-row>
                    <el-form ref="form" :model="toolInfo" label-width="auto">
                        <el-form-item label="检查更新">
                            <el-button type="primary" size="mini" @click="checkUpdate" >点击检查</el-button>
                        </el-form-item>
                        <el-form-item label="开机自启">
                            <el-switch v-model="toolInfo.autoStart"
                                active-text="开" inactive-text="关"
                                @change="handleAutoStartChange" />
                        </el-form-item> 
                    </el-form>        
                </el-row>
            </el-col>
        </el-row>
        <update-dialog  />
    </div>
    
</template>



<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import * as constant from '@/common/info/const'
    import { ToolConfigInfo } from '@/common/info/config'
    import UpdateDialog from '@/render/components/UpdateDialog.vue'

    @Component({
        components: {
            UpdateDialog
        }
    })
    export default class ToolSettings extends Vue {

        private toolInfo = new ToolConfigInfo()

        created() {
            this.$store.get(constant.SKEY_CFG_TOOL)
                       .then(val => this.toolInfo = val)
        }

        checkUpdate() {
            this.$bus.$emit(constant.SHOW_UPDATE_DIALOG)
        }


        handleAutoStartChange(val: boolean) {
            this.$store.set(constant.SKEY_CFG_TOOL, this.toolInfo)
            window.ipcRenderer.invoke('setAutoStart', val)
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