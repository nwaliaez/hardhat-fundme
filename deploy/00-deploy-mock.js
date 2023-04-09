const { network } = require('hardhat');
const {
    devChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require('../helper-hardhat-config');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (devChains.includes(network.name)) {
        log('Local network detected! Deploying mocks...');
        await deploy('MockV3Aggregator', {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        });
        log('Mocks Deployed');
        log('------------------------------------------');
    }
};

module.exports.tags = ['all', 'mocks'];
