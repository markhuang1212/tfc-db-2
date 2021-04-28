import Config from "../Config";
import DBSeed from "../db/DBSeed";
import PTask from "./PTask";

class PSubmitSeedToChain extends PTask {

    static shared = new PSubmitSeedToChain(Config.shared.submit_seed_interval)

    async task() {
        const doc = await DBSeed.shared.getOneSeedForVerificationPurpose()

        if (doc === undefined)
            return // nothing to submit

        // TODO: submit it to Tfc-Chain

        // ============================
        
        await DBSeed.shared.setSeedAsUsed(doc.afid)

    }

}

export default PSubmitSeedToChain