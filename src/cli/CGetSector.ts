import {readdir} from 'fs/promises'
import { promisify } from 'util'

/**
 * 
 * Get all the sectors of the rnode running on the current machine
 * 
 */
class CGetSector {

    sectorDirs: string[]

    static shared = new CGetSector(['/local/ks/trfs', '/home/ks/trfs'])

    constructor(sectorDirs: string[]) {
        this.sectorDirs = [...sectorDirs]
    }

    async getAllSectors() {
        let result: string[] = []
        for (const path of this.sectorDirs) {
            const ret = (await readdir(path)).filter(str => str.match('.*\.d'))
            result.push(...ret);
        }
        return result
    }

}

export default CGetSector