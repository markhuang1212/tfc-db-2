import { SeedSubmitter } from "@tfc-chain/adapter";
import SeedSubmitterShared from "../chain/SeedSubmitterShared";
import Config from "../Config";
import DBSeed from "../db/DBSeed";
import PTask from "./PTask";

class PSubmitSeedToChain extends PTask {

    static shared = new PSubmitSeedToChain(Config.shared.submit_seed_interval, SeedSubmitterShared)

    seedSubmitter: SeedSubmitter

    constructor(interval: number, seedSubmitter: SeedSubmitter) {
        super(interval)
        this.seedSubmitter = seedSubmitter
    }

    async task() {
        const doc = await DBSeed.shared.getOneSeedForVerificationPurpose()

        if (doc === undefined)
            return // nothing to submit

        await this.seedSubmitter.submitSeed(Buffer.from(doc.afid, 'hex'))
        await DBSeed.shared.setSeedAsUsed(doc.afid)

    }

}

export default PSubmitSeedToChain