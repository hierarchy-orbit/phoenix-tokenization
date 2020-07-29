console.log(accounts)
const PSTIssuer = artifacts.require('./PSTIssuer.sol')


module.exports = async function(deployer) {
	console.log(accounts);
	console.log("1");

	await deployer.deploy(PSTIssuer,
		1,
		"0xa7f15e4e66334e8214dfd97d5214f1f8f11c90f25bbe44b344944ed9efed7e29",
		"Phoenix Security token for testing purposes",
		"PTST",
		18,
		"0x4959c7f62051D6b2ed6EaeD3AAeE1F961B145F20", // PhoenixToken Rinkeby
		"0xa7ba71305bE9b2DFEad947dc0E5730BA2ABd28EA" // IdentityRegistry Rinkeby
		)
  	console.log("2");
};
