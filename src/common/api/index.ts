

import axios from 'axios' 


import { ErrorInfo, ModType, PkgRemoteInfo } from '@/common/info/data'




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







export function getRepos(login: string): Promise<GitHubRepoInfo[]> {
    const url = `users/${login}/repos`
    return gitHubApi.get(url).then(resp => resp.data)
}


export function getLastRelease(owner: string, repo: string): Promise<GitHubReleaseInfo> {
    const url = `repos/${owner}/${repo}/releases/latest`
    return gitHubApi.get(url).then(resp => resp.data)
                    .catch(err => {
                        if (err.response.status == 404) 
                            return null
                        else
                            Promise.reject(err)
                    })
}






export async function getPkgs(login: string, repoPrefix: string): Promise<PkgRemoteInfo[]> {
    try {
        const repos = await getRepos(login)
        const pkgs: PkgRemoteInfo[] = [] 
        
        for (const repo of repos) {
            if(repo.fork)
                continue
            if(!repo.name.startsWith(repoPrefix))
                continue

            const rel = await getLastRelease(repo.owner.login, repo.name)
            if (rel == null)
                continue

            pkgs.push(new PkgRemoteInfo(repo.name, rel.tag_name, rel.assets[0].browser_download_url))
        }

        return pkgs
    } catch(error) {
        return Promise.reject(new ErrorInfo(ModType.SERVER, 'have exception'))
    }
    
}
