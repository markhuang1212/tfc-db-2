import { SeedSubmitter } from "@tfc-chain/adapter";
import SeedSubmitterShared from "../chain/SeedSubmitterShared";
import Config from "../Config";
import DBSeed from "../db/DBSeed";
import PTask from "./PTask";
import Pino from 'pino'
import { randomBytes } from 'crypto'

class PSubmitSeedToChain extends PTask {

    static shared = new PSubmitSeedToChain(Config.shared.submit_seed_interval, SeedSubmitterShared)

    seedSubmitter: SeedSubmitter

    constructor(interval: number, seedSubmitter: SeedSubmitter) {
        super(interval)
        this.seedSubmitter = seedSubmitter
    }

    async task() {

        const doc = await DBSeed.shared.getOneSeedForVerificationPurpose()
        let afid: Buffer

        if (doc === undefined) {
            Pino().info('No seed to upload, generate random number.')
            afid = randomBytes(28)
        } else {
            afid = Buffer.from(doc.afid, 'hex')
        }

        Pino().info('Start uploading seed to chain')

        try {
            const ret = await this.seedSubmitter.submitSeed(afid)
            if (doc) {
                await DBSeed.shared.setSeedAsUsed(doc.afid)
                await DBSeed.shared.updateSeedVerification(doc.afid, ret.verification)
            }
            Pino().info('Uploading success')
        } catch {
            Pino().info('Submit seed error')
        }

    }

}

export default PSubmitSeedToChain