




export function get(key: string): Promise<any> {
    return window.ipcRenderer.invoke('getStoreValue', key)
}

export function set(key: string, val: any) {
    window.ipcRenderer.invoke('setStoreValue', key, val)
}