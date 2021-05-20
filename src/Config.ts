
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

    submit_seed_interval = 5 * 60 * 1000            // submit seed every 5 minutes (unit: ms)

    port = 8081                                     // port that the server runs

    chain_endpoint = 'http://localhost:8545'        
                                                    // endpoint for tfc-chain
    chain_tfc_addr = '0xD2729225e815e49F1058827Bc12a7F72AF0F4778'
                                                    // contract address of TFC

    seed_submitter_privkey = 'd9e87e5a945ad4ac804c6715faa9ca0316306f2159971a3a2e92c62e3b9b95f1'
                                                    // private key with SeedSubmitterRole

}

export default Config