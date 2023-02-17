const { tokenizer } = require("acorn");
const { expect } = require("chai");
const {ethers} = require("hardhat");
const { extendConfig } = require("hardhat/config");
const { transform } = require("lodash");

const tokens = (n)=>{
    return ethers.utils.parseUnits(n.toString(),'ether')
}

describe('Exchange',async()=>{
    let deployer,feeAccount,exchange
    const feePercent = 10;
    beforeEach(async()=>{

        const Exchange = await ethers.getContractFactory('Exchange')
        const Token = await ethers.getContractFactory('Token')
        token1 = await Token.deploy("Dapp University","DAPP","1000000")
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        feeAccount = accounts[1]
        user1 = accounts[2]

        let transaction = await token1.connect(deployer).transfer(user1.address,tokens(100))
        await transaction.wait()
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

    describe('Depositing Tokens',()=>{

        let transaction,result
        let amount = tokens(10)
        

       describe("Success", async()=>{

        beforeEach(async()=>{
            transaction = await token1.connect(user1).approve(exchange.address,amount)
            result = await transaction.wait()
            transaction = await exchange.connect(user1).depositToken(token1.address,amount)
            result = await transaction.wait()
        })
        it('tracks the token Balance',async()=>{
            expect(await token1.balanceOf(exchange.address)).to.be.equal(amount)
            expect(await exchange.tokens(token1.address,user1.address)).to.be.equal(amount)
        })

        it('emits a Deposit event',async()=>{
            await expect(transaction).to.emit(exchange,'Deposit').withArgs(token1.address,user1.address,amount,amount)
        })
       })

       describe("Failure", async()=>{

        it('fails when no tokens are approved',async()=>{
            await expect(exchange.connect(user1).depositToken(token1.address,amount)).to.be.reverted
        })
           
        })
    })  
    
})



