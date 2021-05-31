




export function isVersionUpdate(cur: string, latest: string): boolean {
    const curVers = cur.split('.').map(item => parseInt(item))
    const latestVers = latest.split('.').map(item => parseInt(item))

    for (let i=0; i<3; i++) {
        if (curVers[i] < latestVers[i])
            return true
        if (curVers[i] > latestVers[i])
            return false
    }
    return false
}