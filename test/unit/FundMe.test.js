const { deployments, ethers, getNamedAccounts } = require('hardhat');
const { assert, expect } = require('chai');
const { devChains } = require('../../helper-hardhat-config');

!devChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', () => {
          let fundMe, deployer, mockV3Aggregator;
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture(['all']);
              fundMe = await ethers.getContract('FundMe', deployer);
              mockV3Aggregator = await ethers.getContract(
                  'MockV3Aggregator',
                  deployer
              );
          });
          describe('constructor', () => {
              it('sets the aggregator address correctly', async () => {
                  const response = await fundMe.priceFeed();
                  assert.equal(response, mockV3Aggregator.address);
              });
          });

          describe('fundme', () => {
              const sendValue = ethers.utils.parseEther('1');
              it('wont allow to fund less the 50$', async () => {
                  const response = fundMe.fund();
                  await expect(response).to.be.revertedWith(
                      'You need to spend more ETH!'
                  );
              });
              it('fund amt to contract', async () => {
                  await fundMe.fund({ value: sendValue });
                  const money = await fundMe.addressToAmountFunded(deployer);
                  assert.equal(money.toString(), sendValue.toString());
              });
              it('check funders address', async () => {
                  await fundMe.fund({ value: sendValue });
                  const funder = await fundMe.funders(0);

                  assert.equal(deployer, funder);
              });
              describe('withdraw', () => {
                  beforeEach(async () => {
                      await fundMe.fund({ value: sendValue });
                  });
                  it('Withdraw ETH from a single funder', async () => {
                      const startFundMeBalance =
                          await fundMe.provider.getBalance(fundMe.address);
                      const startDeployerBalance =
                          await fundMe.provider.getBalance(deployer);
                      const transactionResponse = await fundMe.withdraw();
                      const transactionReceipt = await transactionResponse.wait(
                          1
                      );
                      const { gasUsed, effectiveGasPrice } = transactionReceipt;
                      const endFundMeBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      );
                      const endDeployerBalance =
                          await fundMe.provider.getBalance(deployer);
                      const gasCost = gasUsed.mul(effectiveGasPrice);
                      assert.equal(endFundMeBalance, 0);
                      assert.equal(
                          startFundMeBalance
                              .add(startDeployerBalance)
                              .toString(),
                          endDeployerBalance.add(gasCost).toString()
                      );
                  });
                  it('multiple funders', async () => {
                      const accounts = await ethers.getSigners();
                      for (let i = 1; i < 6; i++) {
                          const fundMeConnected = await fundMe.connect(
                              accounts[i]
                          );
                          await fundMeConnected.fund({ value: sendValue });
                      }
                      const startFundMeBalance =
                          await fundMe.provider.getBalance(fundMe.address);
                      const startDeployerBalance =
                          await fundMe.provider.getBalance(deployer);
                      const transactionResponse = await fundMe.withdraw();
                      const transactionReceipt = await transactionResponse.wait(
                          1
                      );
                      const { gasUsed, effectiveGasPrice } = transactionReceipt;
                      const endFundMeBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      );
                      const endDeployerBalance =
                          await fundMe.provider.getBalance(deployer);
                      const gasCost = gasUsed.mul(effectiveGasPrice);
                      assert.equal(endFundMeBalance, 0);
                      assert.equal(
                          startFundMeBalance
                              .add(startDeployerBalance)
                              .toString(),
                          endDeployerBalance.add(gasCost).toString()
                      );
                      await expect(fundMe.funders(0)).to.be.reverted;

                      for (let i = 1; i < 6; i++) {
                          console.log(accounts[i], '--ACC--');
                          assert.equal(
                              await fundMe.addressToAmountFunded(
                                  accounts[i].address
                              ),
                              0
                          );
                      }
                  });
                  it('only owner', async () => {
                      const accounts = await ethers.getSigners();
                      const attacker = await accounts[1];
                      const attackerConnection = await fundMe.connect(attacker);
                      await expect(attackerConnection.withdraw()).to.be
                          .reverted;
                  });
              });
          });
      });
