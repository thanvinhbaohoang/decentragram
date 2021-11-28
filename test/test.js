const { assert } = require('chai')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      // Check So Contract Address Isnt EMPTY
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })
  })
  // Image Functions Check
  describe('images', async () => {
    let result, imageCount
    const hash = "abc123" // Random Temporary Hash For Checking

    before(async () => {
      // {from: author} metadata from Line 7 ~~ msg.sender
      result = await decentragram.uploadImage(hash, 'Image description', {from: author});
      imageCount = await decentragram.imageCount()
    })
    // 1. Create Image
    it('creates images', async () => {
      // Check imageCount after 1 Contract Call if == 1
      assert.equal(imageCount,1)
      const event = result.logs[0].args
      // SUCCESS
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "ID is correct")
      assert.equal(event.hash, hash, "Hash is correct")
      assert.equal(event.imgDescription, 'Image description', "Description is correct")
      assert.equal(event.tipAmount, '0', "Tip Amount is correct")
      assert.equal(event.author, author, "Author is correct")
      //FAILURE: Image must have HASH 
      await decentragram.uploadImage('','Image description', {from: author}).should.be.rejected
      //FAILURE: Image must have description
      await decentragram.uploadImage('Image hash','', {from: author}).should.be.rejected

    })
    // 2 . check Image from Struct
    it('lists images', async () => {
      // Check imageCount after 1 Contract Call if == 1
      const image = await decentragram.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), "ID is correct")
      assert.equal(image.hash, hash, "Hash is correct")
      assert.equal(image.imgDescription, 'Image description', "Description is correct")
      assert.equal(image.tipAmount, '0', "Tip Amount is correct")
      assert.equal(image.author, author, "Author is correct")
    })
  })
})