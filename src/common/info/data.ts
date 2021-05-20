

export enum ModType {
    SERVER = 'server'
}


export class ErrorInfo {

    mod: ModType
    info: string

    constructor(mod: ModType, info: string) {
        this.mod = mod
        this.info = info
    }
}


export class PkgRemoteInfo {

    name: string

    lastVer: string
    lastUrl: string

    constructor(name: string, lastVer: string, lastUrl: string) {
        this.name = name
        this.lastVer = lastVer
        this.lastUrl = lastUrl
    }

}


export class PkgLocalInfo {

    name: string 
    ver: string 

    constructor(name: string, ver: string) {
        this.name = name
        this.ver = ver
    }
}


export class SyncPkgResultInfo {

    isOK: boolean
    
    constructor(isOK: boolean) {
        this.isOK = isOK
    }
}