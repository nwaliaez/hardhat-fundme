const { network } = require('hardhat');
const { networkConfig, devChains } = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    console.log(chainId, '--CHAIN--');
    let ethUsdPriceFeedAddress;
    if (devChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get('MockV3Aggregator');
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    }
    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy('FundMe', {
        from: deployer,
        args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    if (!devChains.includes(network.name)) {
        await verify(fundMe.address, args);
    }
    log('----------------------------------------------------');
};
module.exports.tags = ['all', 'fundme'];
