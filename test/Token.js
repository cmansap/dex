const { expect } = require("chai");
const {ethers} = require("hardhat");

describe('Token Contract',async()=>{

    const tokens = (n)=>{
        return ethers.utils.parseUnits(n.toString(),'ether')
    }
    let token,accounts,deployer,receiver
    beforeEach(async()=>{
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('JANASENA','JSP','1000000')
        await token.deployed()

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        receiver = accounts[1]
    })

    describe('Deployment',()=>{
        const name = 'JANASENA'
        const symbol = 'JSP'
        const decimals = '18'
        const totalSupply = tokens(1000000)
        it('has a correct name',async()=>{
            expect(await token.name()).to.equal(name)
        })
    
        it('has a correct symbol',async()=>{
            expect(await token.symbol()).to.equal(symbol)
        })
    
        it('has a correct decimals',async()=>{
            expect(await token.decimals()).to.equal(18)
        })
    
        it('has a correct totalSupply',async()=>{
            expect(await token.totalSupply()).to.equal(totalSupply)
        })

        it('assigns total supply to deployer',async()=>{
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
        })
    })  

    describe('Sending Toekns',async()=>{

        describe("Success", async()=>{
            let amount, transaction, result
            beforeEach(async() => {
                amount = tokens(50)
                transaction = await token.connect(deployer).transfer(receiver.address,amount)
                result = transaction.wait()
            })
            it('Transfer Token Balances',async()=>{
                expect (await token.balanceOf(receiver.address)).to.equal(amount)
            })
    
            it('Emits a Transfer Event',async()=>{
                await expect(transaction).to.emit(token,'Transfer').withArgs(deployer.address,receiver.address,amount)
            })
        })

        describe("Failure",async()=>{
            it('rejects insufficient balances',async()=>{
                const invalidAmount =  tokens(10000000)
                await expect(token.connect(deployer).transfer(receiver.address,invalidAmount)).to.be.reverted
            })

        })
      
    })
})



