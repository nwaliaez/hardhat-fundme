require('@nomicfoundation/hardhat-toolbox');
require('hardhat-deploy');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: '0.8.8',
    defaultNetwork: 'hardhat',
    solidity: {
        compilers: [{ version: '0.8.8' }, { version: '0.6.6' }],
    },
    networks: {
        sepolia: {
            url: 'https://eth-sepolia.g.alchemy.com/v2/DZtY2xbb5xviSrxORfsIClPeYQIjQiL4',
            accounts: [
                '5044e4c5226a420563797efd037088bd49ac3c4835fc4f54ebc24b16c3376b40',
            ],
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },
    etherscan: {
        apiKey: '2UEJBV85JA93NBBY67NURD1ERS1M1PUVPK',
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
};
