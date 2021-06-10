

interface GitHubRepoInfo {

    id: number
    name: string
    full_name: string 
    description: string 
    private: boolean 
    fork: boolean 
    owner: GitHubRepoOwnerInfo

}

interface GitHubRepoOwnerInfo {

    login: string
    url: string

}


interface GitHubReleaseInfo {

    url: string
    name: string
    body: string
    tag_name: string 

    assets: GitHubReleaseAssetInfo[]

}

interface GitHubReleaseAssetInfo {

    url: string 
    name: string 
    content_type: string 
    browser_download_url: string

}


interface NotifyerUpdateInfo {
    repoName: string,
    lastVer: string,
    lastUrl: string
}