import { SeedSubmitter } from "@tfc-chain/adapter";
import SeedSubmitterShared from "../chain/SeedSubmitterShared";
import Config from "../Config";
import DBSeed from "../db/DBSeed";
import PTask from "./PTask";
import Pino from 'pino'

class PSubmitSeedToChain extends PTask {

    static shared = new PSubmitSeedToChain(Config.shared.submit_seed_interval, SeedSubmitterShared)

    seedSubmitter: SeedSubmitter

    constructor(interval: number, seedSubmitter: SeedSubmitter) {
        super(interval)
        this.seedSubmitter = seedSubmitter
    }

    async task() {

        const doc = await DBSeed.shared.getOneSeedForVerificationPurpose()

        if (doc === undefined) {
            Pino().info('No seed to upload')
            return // nothing to submit
        }

        Pino().info('Start uploading seed to chain')

        await this.seedSubmitter.submitSeed(Buffer.from(doc.afid, 'hex'))
        await DBSeed.shared.setSeedAsUsed(doc.afid)

        Pino().info('Uploading success')

    }

}

export default PSubmitSeedToChain