const networkConfig = {
    4: {
        name: 'Rinkeby',
        ethUsdPriceFeed: '',
    },
    137: {
        name: 'Ploygon',
        ethUsdPriceFeed: '',
    },
    11155111: {
        name: 'Sepolia',
        ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    },
};

const devChains = ['hardhat', 'localhost'];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = { networkConfig, devChains, DECIMALS, INITIAL_ANSWER };
