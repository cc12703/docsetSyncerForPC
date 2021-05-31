


import * as fs from 'fs'
import axios from 'axios' 



export async function downloadFile(url: string, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        axios.get(url, {responseType: 'stream', timeout: 30000})
             .then(resp => resp.data.pipe(fs.createWriteStream(fileName)))
             .then(stream => stream.on('finish', () => resolve()) )
             .catch(err => reject(err))
    })
}