import { exec } from 'child_process'
import { promisify } from 'util'
import Pino from 'pino'

/**
 * Using the given CLI to verify whether a sector is valid
 */
class CVerifySector {

    static shared = new CVerifySector('/aos/ks/afs_bin/afs-x86_64b')

    afs_path: string

    constructor(afs_path: string) {
        this.afs_path = afs_path
    }

    makeCommand(afid: string, seed_hash: string) {
        return `;afs_f=verify_merkleroot_afid;mkr_afid=${afid};chk_afid=${seed_hash};`
    }

    async verifySector(afid: string, seed_hash: string) {
        const command = this.makeCommand(afid, seed_hash);
        const { stdout } = await promisify(exec)(`${this.afs_path} "${command}"`)
        Pino().info(`check sector cli result`, { afid, stdout })
        if (stdout.match('_r=true')) {
            return true;
        } else {
            return false;
        }
    }
}

export default CVerifySector