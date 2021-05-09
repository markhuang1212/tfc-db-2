
/**
 * 
 * This object handles the user-configurable settings
 * 
 * For now, everything is set to default
 * 
 */
class Config {

    static shared = new Config()

    mongodb_uri = 'mongodb://localhost:27017'       // endpoint for mongo-db
    db_name = 'tfc-db'                              // mongo-db database name

    submit_seed_interval = 50000 * 60               // submit seed every 5 minutes

    port = 8081                                     // port that the server runs

    chain_endpoint = 'http://localhost:8545'        // endpoint for tfc-chain
    chain_tfc_addr = ''                             // contract address of TFC

    seed_submitter_privkey = ''                     // private key with SeedSubmitterRole

}

export default Config