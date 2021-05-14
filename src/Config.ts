
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
    db_name = 'tfc-db-2'                            // mongo-db database name

    submit_seed_interval = 5000                     // submit seed every 5 minutes

    port = 8081                                     // port that the server runs

    chain_endpoint = 'http://localhost:8545'        
                                                    // endpoint for tfc-chain
    chain_tfc_addr = '0x56d58799F29f9187a3124E8605eBCA53f047D85d'
                                                    // contract address of TFC

    seed_submitter_privkey = 'd9e87e5a945ad4ac804c6715faa9ca0316306f2159971a3a2e92c62e3b9b95f1'
                                                    // private key with SeedSubmitterRole

}

export default Config