import { User } from "@tfc-chain/adapter";
import UserShared from "../chain/UserShared";
import Config from "../Config";
import DBSeed from "../db/DBSeed";
import ITask from "./ITask";

class IDistributeAward extends ITask {

    static shared = new IDistributeAward(UserShared)

    user: User

    constructor(user: User) {
        super()
        this.user = user
    }

    initialize() {
        this.user.onReceiveReward(async (type, to, amount, verification) => {
            const doc = await DBSeed.shared.getSeedByVerification(verification)
            if (doc) {
                await this.user.transfer(doc.owner, amount)
            } else {
                
            }
        }, null, 0, this.user.wallet.address)
    }

}

export default IDistributeAward