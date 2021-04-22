
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

}

export default Config