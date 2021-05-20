import Store from 'electron-store'

import { ipcMain } from 'electron'

import * as constant from '@/common/info/const'



const store = new Store({
      name: `data${constant.SUFFIX_TAG}`
})





 


export function get(key: string): any {
  return store.get(key)
}

export function getWithDef(key: string, defVal: any): any {
  return store.get(key, defVal)
}

export function set(key: string, value: any) {
  store.set(key, value)
}

export function has(key: string): boolean {
  return store.has(key)
}

export function insert(key: string, value: any): void {
  let data: any = store.get(key) 
  data.push(value)
  store.set(key, data)
}



ipcMain.handle('getStoreValue', (event, key) => { return get(key) })
ipcMain.handle('setStoreValue', (event, key, value) => { set(key, value) } )

