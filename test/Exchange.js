const { expect } = require("chai");
const {ethers} = require("hardhat");

const tokens = (n)=>{
    return ethers.utils.parseUnits(n.toString(),'ether')
}

describe('Exchange',async()=>{
    let deployer,feeAccount,exchange
    const feePercent = 10;
    beforeEach(async()=>{
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        feeAccount = accounts[1]

        const Exchange = await ethers.getContractFactory('Exchange')
        exchange = await Exchange.deploy(feeAccount.address,feePercent)
    })
    describe('Deployment',()=>{
        it('tracks the feeAccount',async()=>{
            expect(await exchange.feeAccount()).to.equal(feeAccount.address)
        })

        it('tracks the fee Percent',async()=>{
            expect(await exchange.feePercent()).to.equal(feePercent)
        })
    })  
    
})


