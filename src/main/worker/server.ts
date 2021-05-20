

import * as fs from 'fs'
import axios from 'axios' 
import  log from 'electron-log'


import * as constant from '@/common/info/const'
import * as store from '@/main/store'
import { ErrorInfo, ModType, PkgRemoteInfo } from '@/common/info/data'
import { SyncConfigInfo } from '@/common/info/config'




/*
axios.defaults.proxy = {
    host: '127.0.0.1',
    port: 8888,
    protocol: 'http'
}
*/

const gitHubApi = axios.create({
    baseURL: 'https://api.github.com/',
    headers: {'Accept' : 'application/vnd.github.v3+json'}
})




function getRepos(login: string): Promise<GitHubRepoInfo[]> {
    let url = `users/${login}/repos`
    return gitHubApi.get(url).then(resp => resp.data)
}


function getLastRelease(owner: string, repo: string): Promise<GitHubReleaseInfo> {
    let url = `repos/${owner}/${repo}/releases/latest`
    return gitHubApi.get(url).then(resp => resp.data)
}




export async function downloadFile(url: string, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        axios.get(url, {responseType: 'stream', timeout: 30000})
             .then(resp => resp.data.pipe(fs.createWriteStream(fileName)))
             .then(stream => stream.on('finish', () => resolve()) )
             .catch(err => reject(err))
    })
}


export async function getPkgs(): Promise<PkgRemoteInfo[]> {
    try {
        const cfg: SyncConfigInfo = store.get(constant.SKEY_CFG_SYNC)        
        const repos = await getRepos(cfg.githubLoginName)
        const pkgs: PkgRemoteInfo[] = [] 
        
        for (const repo of repos) {
            if(repo.fork)
                continue
            if(!repo.name.startsWith(cfg.repoPrefixName))
                continue

            const rel = await getLastRelease(repo.owner.login, repo.name)
            if (rel == null)
                continue

            pkgs.push(new PkgRemoteInfo(repo.name, rel.tag_name, rel.assets[0].browser_download_url))
        }

        return pkgs
    } catch(error) {
        log.error('export-appinfo', error)
        return Promise.reject(new ErrorInfo(ModType.SERVER, 'have exception'))
    }
    
}
