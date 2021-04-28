
/**
 * 
 * This object handles the user-configurable settings
 * 
 * For now, everything is  set to default
 * 
 */
class Config {

    static shared = new Config()

    mongodb_uri = 'mongodb://localhost:27017'

    db_name = 'tfc-db'

    submit_seed_interval = 50000 * 60 // submit seed every minute

    port = 8081

    afs_path = '/aos/ks/afs_bin/afs-x86_64b'

    chain_endpoint = 'http://localhost:8545'
    chain_tfc_addr = ''

    rnode_privkey = ''
    verifier_prikey = ''
    seed_submitter_privkey = ''

}

export default Config