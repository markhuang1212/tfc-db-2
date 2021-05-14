import { Deployer } from '@tfc-chain/adapter'

const endpoint = 'http://localhost:8545'
const privateKey = '3b95a4c29114e2c9fac69813aaf5199b6c2b7f142177e6f1834df94c7c3c312d'
const contract_address = '0x56d58799F29f9187a3124E8605eBCA53f047D85d'

const deployer = new Deployer(endpoint, privateKey, contract_address)

const address = '0x7e922e245a529bd136af43477ce2ecf89d07af3f'
const address_privKey = 'd9e87e5a945ad4ac804c6715faa9ca0316306f2159971a3a2e92c62e3b9b95f1'

async function make(){
    await deployer.grantMaintainRole(address)
    await deployer.grantSectorRole(address)
    await deployer.grantSeedRole(address)
    await deployer.grantVerifyRole(address)
}

make().then(()=>{
    console.log('success!!')
})