// http://127.0.0.1:7545//

const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    //const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    /**const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    )**/
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )
    const binary = fs.readFileSync(
        "SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()
    await contract.deployTransaction.wait(1)
    console.log(`Contract address: ${contract.address}`)

    /**console.log("Deploy tx!");
  const nonce = await wallet.getTransactionCount();
  const chain = await wallet.getChainId();
  const tx = {
    nonce: nonce,
    gasPrice: 20000000000,
    gasLimit: 1000000,
    to: null,
    value: 0,
    data: "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea26469706673582212209d3e89e05d4c317db912cb492fd6a9d4cb6f95cf0f709208f1abdd512f73f98364736f6c63430008110033",
    chainId: chain,
  };
  const sentTxResponse = await wallet.sendTransaction(tx);
  await sentTxResponse.wait(1);
  console.log(sentTxResponse);**/

    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Curent Favorite Number: ${currentFavoriteNumber.toString()}`)
    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)
    const updatedFavoriteNumbre = await contract.retrieve()
    console.log(`Updated favorite numbre is : ${updatedFavoriteNumbre}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        ProcessingInstruction.exit(1)
    })
