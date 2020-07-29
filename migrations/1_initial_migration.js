const PSToken = artifacts.require('./PSToken.sol')
const AddressSet = artifacts.require('./_testing/AddressSet/AddressSet.sol')
const IdentityRegistry = artifacts.require('./_testing/IdentityRegistry.sol')

const PhoenixToken = artifacts.require('./_testing/PhoenixToken.sol')

const SafeMath = artifacts.require('./zeppelin/math/SafeMath.sol')
const Ownable = artifacts.require('./zeppelin/math/Ownable.sol')
const Snowflake = artifacts.require('./Snowflake.sol')
// const Status = artifacts.require('./resolvers/Status.sol')

const StringUtils = artifacts.require('./resolvers/ClientRaindrop/StringUtils.sol')
const ClientRaindrop = artifacts.require('./resolvers/ClientRaindrop/ClientRaindrop.sol')
const OldClientRaindrop = artifacts.require('./_testing/OldClientRaindrop.sol')


module.exports = async function(deployer, network) {


	await deployer.deploy(AddressSet)
  await deployer.link(AddressSet, IdentityRegistry)


  await deployer.deploy(StringUtils)
  await deployer.link(StringUtils, ClientRaindrop)
  await deployer.link(StringUtils, OldClientRaindrop)

  await deployer.deploy(SafeMath)
  await deployer.link(SafeMath, PhoenixToken)
  await deployer.link(SafeMath, Snowflake)


  await deployer.deploy(Ownable)

  await deployer.deploy(PhoenixToken)
  await deployer.deploy(IdentityRegistry)
	
console.log("SafeMath:", SafeMath.address);
console.log("PhoenixToken:",PhoenixToken.address);

console.log("Network:",network);

var PhoenixTokenAdd
var IdentityRegistryAdd

if (network == "development") {
	PhoenixTokenAdd = PhoenixToken.address
	IdentityRegistryAdd = IdentityRegistry.address
	console.log("DEV",PhoenixTokenAdd,IdentityRegistryAdd )

} else {
	PhoenixTokenAdd = "0x4959c7f62051d6b2ed6eaed3aaee1f961b145f20";
	IdentityRegistryAdd = "0xa7ba71305be9b2dfead947dc0e5730ba2abd28ea";
	console.log("RINK",PhoenixTokenAdd,IdentityRegistryAdd )
}

const deployToken = async () => {
	await deployer.deploy(PSToken,
		1,
		"0x12afe",
		"Phoenix Security",
		"HTST",
		18,
		PhoenixTokenAdd, // PhoenixToken Rinkeby
		IdentityRegistryAdd // IdentityRegistry Rinkeby
		)

	console.log("PSToken Address", PSToken.address);
 	}



  	//await  deployer.link(SafeMath, PSToken)
  	//await  deployer.link(Ownable, PSToken)

};
