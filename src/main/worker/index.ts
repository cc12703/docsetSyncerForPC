import * as fs from 'fs'
import * as fse from 'fs-extra'
import path from 'path' 
import os from 'os'
import { app, ipcMain, Notification } from 'electron'
import log from 'electron-log'
import compressing from 'compressing'
import * as sio from "socket.io-client"

import * as store from '@/main/store'
import * as constant from '@/common/info/const'
import * as NetUtil from '@/common/utils/net'
import * as api from '@/common/api'
import { SyncConfigInfo, ToolConfigInfo } from '@/common/info/config'
import { PkgLocalInfo, PkgRemoteInfo, SyncPkgResultInfo } from '@/common/info/data'







const DLFILE_PATH = path.join(app.getPath('userData'), `dlfiles${constant.SUFFIX_TAG}`)

fse.emptyDir(DLFILE_PATH)




function updateLocalPkgs(pkgs: PkgLocalInfo[], newPkg: PkgLocalInfo) {
    const index = pkgs.findIndex(item => item.name == newPkg.name)
    if (index == -1) {
        pkgs.push(newPkg)
    }
    else {
        pkgs[index] = newPkg
    }
}


function buildLocalPkgPath(lPkg: PkgLocalInfo, cfg: SyncConfigInfo): string {
    return path.join(cfg.docsetSavePath, `${lPkg.name}.docset`)
}

function isDownload(lPkgs: PkgLocalInfo[], rPkg: PkgRemoteInfo, cfg: SyncConfigInfo): boolean {
    const lPkg = lPkgs.find(item => item.name === rPkg.name)
    if (lPkg == null)
        return true
    
    if (rPkg.lastVer !== lPkg.ver)
        return true
    
    const pkgPath = buildLocalPkgPath(lPkg, cfg)
    if (!fs.existsSync(pkgPath))
        return true 

    return false
}


async function download(rPkg: PkgRemoteInfo): Promise<string> {
    const fileName = path.join(DLFILE_PATH, `${rPkg.name}-${rPkg.lastVer}.docset.tgz`)
    return NetUtil.downloadFile(rPkg.lastUrl, fileName).then(() => fileName)
}

async function uncompress(pkgFileName: string, lPkg: PkgLocalInfo, cfg: SyncConfigInfo): Promise<void> {
    const pkgPath = buildLocalPkgPath(lPkg, cfg)
    return fse.remove(pkgPath)
              .then(() => compressing.tgz.uncompress(pkgFileName, cfg.docsetSavePath))
}




async function doSyncPkgsFromRemote(rPkgs: PkgRemoteInfo[]): Promise<boolean> {
    try {
        log.info('sync pkgs from remote is start')

        const cfg: SyncConfigInfo = store.get(constant.SKEY_CFG_SYNC)    
        const lPkgs = store.getWithDef(constant.SKEY_PKG_LOCAL, [])
        log.info(`local pkgs num ${lPkgs.length}`)
        log.info(`remote pkgs num ${rPkgs.length}`)
        for (let rPkg of rPkgs) {
            if(!isDownload(lPkgs, rPkg, cfg))
                continue
            
            log.info(`deal pkg ${rPkg.name} - ${rPkg.lastVer}`)

            const nPkg = new PkgLocalInfo(rPkg.name, rPkg.lastVer)
            log.info(`  download url ${rPkg.lastUrl}`)
            const pkgFile = await download(rPkg)

            log.info(`  uncompress pkg ${pkgFile}`)
            await uncompress(pkgFile, nPkg, cfg) 

            updateLocalPkgs(lPkgs, nPkg)
            store.set(constant.SKEY_PKG_LOCAL, lPkgs)
        }
        
        log.info('sync pkgs from remote is stop')
        return true
    } catch(error) {
        log.error(`sync pkgs from remote fail ${error}`)
        return false
    }
}


async function syncPkgs(): Promise<boolean> {
    const cfg: SyncConfigInfo = store.get(constant.SKEY_CFG_SYNC)    
    const rPkgs = await api.getPkgs(cfg.githubLoginName, cfg.repoPrefixName)
    return doSyncPkgsFromRemote(rPkgs)
}

async function updatePkgs(uPkgs: NotifyerUpdateInfo[]): Promise<boolean> {
    const notify = new Notification({title: 'Update Docset', body: 'Auto Update Docset Pkgs'})

    notify.show()
    const rPkgs = uPkgs.map(item => new PkgRemoteInfo(item.repoName, item.lastVer, item.lastUrl))
    const result = await doSyncPkgsFromRemote(rPkgs)
    notify.close()

    return result
}


function initAutoUpdate() {
    const cfg: SyncConfigInfo = store.get(constant.SKEY_CFG_SYNC)
    const socket = sio.io(cfg.docsetUpdateAddr)
    socket.on('updateInfos', (data: NotifyerUpdateInfo[]) => {
        log.info(`recv update info num ${data? data.length : 0}`)
        updatePkgs(data)
    })
}


function initConfig() {
    if(!store.has(constant.SKEY_CFG_SYNC)) {
        let cfgSync = new SyncConfigInfo()
        const cfgFile = path.join(os.homedir(), constant.TOOL_CFG_FILENAME)
        if(fs.existsSync(cfgFile)) {
            const cfgData = fse.readJSONSync(cfgFile)
            cfgSync.githubLoginName = cfgData['github.name']
            cfgSync.repoPrefixName = cfgData['tag.prefix.name']
            cfgSync.docsetSavePath = cfgData['docset.save.path']
            cfgSync.docsetUpdateAddr = cfgData['docset.update.addr']
        }
        store.set(constant.SKEY_CFG_SYNC, cfgSync)
    }
    if(!store.has(constant.SKEY_CFG_TOOL)) {
        store.set(constant.SKEY_CFG_TOOL, new ToolConfigInfo())
    }

}



export function init() {
    const appDir = app.getPath('userData')
    log.info(`appDir ${appDir}`)
    initConfig()
    initAutoUpdate()
}


ipcMain.handle('syncPkgs', async (event) => {
    const isOK = await syncPkgs()
    return new SyncPkgResultInfo(isOK)
})

ipcMain.handle('setAutoStart', (event, val) => {
    app.setLoginItemSettings({
        openAtLogin: val
    })
})






export function test() {
    syncPkgs()
    //compressing.tgz.uncompress('./learning_note-v3.docset.tgz', './out')

}





