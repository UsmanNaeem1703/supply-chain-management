const etherTransfer = artifacts.require("EtherTransfer");
module.exports = function (deployer) {
    deployer.deploy(etherTransfer);
}; 