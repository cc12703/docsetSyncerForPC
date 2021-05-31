<template>
    <el-dialog
      title="检查更新"
      :visible.sync="showUpdateVisible"
      :modal-append-to-body="false">
      <div>
        当前版本：{{ version }}
      </div>
      <div>
        最新版本：{{ latestVersion ? latestVersion : '正在获取中...' }}
      </div>
      <div v-if="needUpdate">
        {{ appName }} 更新啦，请点击确定打开下载页面
      </div>
      <span slot="footer">
        <el-button @click="handleCancel" round>取消</el-button>
        <el-button type="primary" @click="handleConfirm" round>确定</el-button>
      </span>
    </el-dialog>
</template>


<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import pkg from 'root/package.json'

  import * as constant from '@/common/info/const'
  import * as updateUtil from '@/common/utils/update'
  import * as api from '@/common/api'



  @Component({})
  export default class UpdateDialog extends Vue {

      private showUpdateVisible = false

      private version = pkg.version
      private appName = pkg.name

      private latestVersion = ''
      private latestUrl = ''


      created() {
        this.$bus.$on(constant.SHOW_UPDATE_DIALOG, () => {
          this.showUpdateVisible = true
          this.checkUpdate()
        })
      }

      get needUpdate() {
          if (!this.latestVersion)
              return false
          
          if (!updateUtil.isVersionUpdate(this.version, this.latestVersion))
              return false

          return true
      }

      checkUpdate() {
          api.getLastRelease('cc12703', 'docsetSyncerForPC')
              .then(relInfo => {
                  if(relInfo != null) {
                      this.latestVersion = relInfo.tag_name
                      this.latestUrl = relInfo.assets[0].browser_download_url
                  } 
              })
      }

      handleConfirm() {
        if(this.needUpdate) {
          window.shell.openExternal(this.latestUrl)
        }
        this.showUpdateVisible = false
      }

      handleCancel() {
        this.showUpdateVisible = false
      }
  }
</script>