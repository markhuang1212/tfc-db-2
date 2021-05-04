import { SeedSubmitter } from '@tfc-chain/adapter'
import Config from '../Config'

const SeedSubmitterShared = new SeedSubmitter(
    Config.shared.chain_endpoint,
    Config.shared.seed_submitter_privkey,
    Config.shared.chain_tfc_addr)

export default SeedSubmitterShared