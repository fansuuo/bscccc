require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3('https://bsc-dataseed.binance.org/');

async function main() {
    const walletAddress = process.env.SENDER_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const tokenContractAddress = '0x48d69da2f3f0434808034261531ddd0debaa4444';
    const tokenConteactABI =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"MODE_NORMAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MODE_TRANSFER_CONTROLLED","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MODE_TRANSFER_RESTRICTED","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_mode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"totalSupply","type":"uint256"}],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"v","type":"uint256"}],"name":"setMode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    //实例化
    const tokenContract = new web3.eth.Contract(tokenConteactABI,tokenContractAddress);
    const rounterAddress = '0x5c952063c7fc8610FFDB798152D69F0B9550762b';
    const routerABI = [
        {
          "inputs": [
            {"internalType": "address", "name": "token", "type": "address"},
            {"internalType": "uint256", "name": "funds", "type": "uint256"},
            {"internalType": "uint256", "name": "minAmount", "type": "uint256"}
          ],
          "name": "buyTokenAMAP",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
            "inputs": [
              {"internalType": "address", "name": "spender", "type": "address"},
              {"internalType": "uint256", "name": "amount", "type": "uint256"}
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
              {"internalType": "address", "name": "token", "type": "address"},
              {"internalType": "uint256", "name": "amount", "type": "uint256"}
            ],
            "name": "sellToken",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
      ];
    //实例化
    const router = new web3.eth.Contract(routerABI,rounterAddress);
    const wbnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    const poolAddress = '0x5c952063c7fc8610ffdb798152d69f0b9550762b';

    //买
    const buyamountOutMin = web3.utils.toWei('0.000001','ether'); // 降低滑点保护
    const funds = web3.utils.toWei('0.00001','ether');
    let nonce = await web3.eth.getTransactionCount(walletAddress);
    
    const buyData = router.methods.buyTokenAMAP(
        tokenContractAddress,
        funds,
        buyamountOutMin,
    ).encodeABI();
    
    console.log('交易数据:', buyData);
    
    const buyTx = {
        to: rounterAddress,
        gas: 200000,
        gasPrice: await web3.eth.getGasPrice(),
        value: funds,
        data: buyData,
        nonce: nonce,
        chainId: 56,
    };
    
    console.log('交易对象:', JSON.stringify(buyTx, null, 2));
    
    const signedSwapTx = await web3.eth.accounts.signTransaction(buyTx, privateKey);
    console.log('交易已签名');
    
    try {
        const swapReceipt = await web3.eth.sendSignedTransaction(signedSwapTx.rawTransaction);
        console.log('buy交易哈希:', swapReceipt.transactionHash);
        console.log('交易状态:', swapReceipt.status);
    } catch (error) {
        console.log('交易失败:', error.message);
        if (error.receipt) {
            console.log('交易收据:', error.receipt);
        }
        throw error;
    }


    //授权
    nonce++
    const approveTx = {
        from: walletAddress,
        to: tokenContractAddress,
        gas: 200000,
        gasPrice: await web3.eth.getGasPrice(),
        nonce: nonce,
        chainId: 56,
        data: tokenContract.methods.approve(rounterAddress, web3.utils.toWei('1000', 'ether')).encodeABI()
    };
    const signedApproveTx = await web3.eth.accounts.signTransaction(approveTx, privateKey);
    const approveReceipt = await web3.eth.sendSignedTransaction(signedApproveTx.rawTransaction);
    console.log('授权交易哈希:', approveReceipt.transactionHash);

    // 卖
    nonce++;
    const sellamountln = web3.utils.toWei('30','ether'); 
    const sellamountOutMin = web3.utils.toWei('0.000005','ether'); 
    const bonusAmount = '0'; 
    const sellData = router.methods.sellToken(
        tokenContractAddress,     
        sellamountln,              
    ).encodeABI();

    const sellTx = {
        to: rounterAddress,
        gas: 200000,
        gasPrice: await web3.eth.getGasPrice(),
        value: '0',
        data: sellData,
        nonce: nonce,
        chainId: 56,
    };
    const signedSellTx = await web3.eth.accounts.signTransaction(sellTx, privateKey);
    const sellReceipt = await web3.eth.sendSignedTransaction(signedSellTx.rawTransaction);
    console.log('sell交易哈希:', sellReceipt.transactionHash);
}
main();