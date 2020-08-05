const truffleAssert = require('truffle-assertions')
const PhoenixIdentityOwnable = artifacts.require('./components/PhoenixIdentityOwnable.sol')
const utilities = require('./utilities')
const common = require('./common.js')

// all contracts
let instances
// all users
let users
// system owner and deployer (same as users[0])
let owner

let ownerEIN

contract('Testing PhoenixIdentityOwnable', function (accounts) {

  it('Users created', async () => {
    users = await common.createUsers(accounts);
    owner = users[0];
  })
  
  it('Common contracts deployed', async () => {
    instances = await common.initialize(owner.address, users);
  })

  it('PhoenixIdentity identities created for all accounts', async() => {
    for (let i = 0; i < users.length; i++) {
      await utilities.createIdentity(users[i], instances, {from: owner.address});
    }
  })


  describe('Checking IdentityRegistry functionality', async() =>{

    // Try to create duplicate identity
    it('IdentityRegistry create Identity (exists, should revert)', async () => {
      await truffleAssert.reverts(
        instances.IdentityRegistry.createIdentity(
          users[1].address,
          accounts,
          accounts,
          {from: users[0].address}),
          'The passed address has an identity but should not..'
      )
    })

    // Retrieve EIN for an Identity from IdentityRegistry
    it('IdentityRegistry retrieve EIN', async () => {
      _ein = await instances.IdentityRegistry.getEIN(
        users[1].address,
        //{from: users[0].address}
      )
      console.log('      EIN users[1]', _ein)
    })

  })


  describe('Checking PhoenixIdentityOwnable functionality', async() =>{

    // Create PhoenixIdentityOwnable contract
    it('PhoenixIdentityOwnable can be created', async () => {
      newPhoenixIdentityOwnable = await PhoenixIdentityOwnable.new(
        {from: users[1].address}
      )
        console.log('      PhoenixIdentityOwnable Address', newPhoenixIdentityOwnable.address)
        console.log('      users[1]', users[1].address)
    })

    it('PhoenixIdentityOwnable exists', async () => {
      ownerEIN = await newPhoenixIdentityOwnable.ownerEIN()//{from: users[1].address})
      console.log('      Owner EIN', ownerEIN)
    })

    it('PhoenixIdentityOwnable set Identity Registry', async () => {
      console.log('      Identity Registry Address', instances.IdentityRegistry.address)
      await newPhoenixIdentityOwnable.setIdentityRegistryAddress(
        instances.IdentityRegistry.address,
        {from: users[1].address}
      )
    })

    it('PhoenixIdentityOwnable get Identity Registry Address', async () => {
      _snowIDaddress = await newPhoenixIdentityOwnable.getIdentityRegistryAddress(
        //{from: users[1].address}
      )
      console.log('      PhoenixIdentity ownable identity registry address', _snowIDaddress)
    })

    it('PhoenixIdentityOwnable get owner EIN', async () => {
      ownerEIN = await newPhoenixIdentityOwnable.getOwnerEIN(
        //{from: users[1].address}
      )
      console.log('      PhoenixIdentity ownable owner EIN', ownerEIN)
    })

    // Try to transfer ownership to an identity which does not exist
    // owner is users[0]
    it('PhoenixIdentity ownable transfer ownership (no identity, should revert)', async () => {
      await truffleAssert.reverts(
        newPhoenixIdentityOwnable.setOwnerEIN(
          21,
          {from: users[1].address}),
          'New owner identity must exist'
      )
    })

    it('PhoenixIdentityOwnable get owner EIN', async () => {
      ownerEIN = await newPhoenixIdentityOwnable.getOwnerEIN(
        //{from: users[1].address}
      )
      console.log('      PhoenixIdentity ownable new owner EIN after transfer 1', ownerEIN)
    })

    // Try to transfer ownership without being the owner
    // owner is users[1]
    it('PhoenixIdentity ownable transfer ownership (not the owner, should revert)', async () => {
      _ein = await instances.IdentityRegistry.getEIN(
        users[3].address,
        //{from: users[2].address}
      )
      console.log('      EIN users[3]', _ein)
      await truffleAssert.reverts(
        newPhoenixIdentityOwnable.setOwnerEIN(
          _ein,
          {from: users[2].address}),
          'Must be the EIN owner to call this function'
      )
    })

    it('PhoenixIdentityOwnable get owner EIN', async () => {
      ownerEIN = await newPhoenixIdentityOwnable.getOwnerEIN(
        //{from: users[1].address}
      )
      console.log('      PhoenixIdentity ownable new owner EIN after transfer 2', ownerEIN)
    })

    // Transfer ownership being the owner
    // owner is users[0]
    it('PhoenixIdentity ownable transfer ownership', async () => {
      await newPhoenixIdentityOwnable.setOwnerEIN(
        9,
        {from: users[1].address}
      )
    })

    it('PhoenixIdentityOwnable get owner EIN', async () => {
      ownerEIN = await newPhoenixIdentityOwnable.getOwnerEIN(
        //{from: users[1].address}
      )
      console.log('      PhoenixIdentity ownable new owner EIN after transfer 3', ownerEIN)
    })

  })

})
