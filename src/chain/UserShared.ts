import { User } from '@tfc-chain/adapter'
import Config from '../Config'

const UserShared = new User(
    Config.shared.chain_endpoint,
    Config.shared.seed_submitter_privkey,
    Config.shared.chain_tfc_addr
)

export default UserShared