import { Deployer, DeployInitArgs } from '@tfc-chain/adapter'

const endpoint = 'http://localhost:8545'
const privateKey = '3b95a4c29114e2c9fac69813aaf5199b6c2b7f142177e6f1834df94c7c3c312d'

const initArgs: DeployInitArgs = {
    seedReward: 1,
    sectorReward: 1,
    verifyReward: 1,

    submitProofTimeout: 6,
    verifyProofTimeout: 12,
    verifyThreshold: 1,

    lockPeriod: 3
}

Deployer.deploy(endpoint, privateKey, initArgs).then(contractAddr => {
    console.log('success!')
})