require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');
const web3 = new Web3('https://bsc-dataseed.binance.org/');

// 封装买币函数
async function pancakebuy(web3, route, routerAddress, buypath, buyamountOutMin, walletAddress, deadline, buyvalue, privateKey, nonce) {
    const swapData = route.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
        buyamountOutMin,
        buypath,
        walletAddress,
        deadline
    ).encodeABI();
    const Tx = {
        to: routerAddress,
        gas: 200000,
        gasPrice: await web3.eth.getGasPrice(),
        value: buyvalue,
        data: swapData,
        nonce: nonce,
        chainId: 56,
    };
    const signedSwapTx = await web3.eth.accounts.signTransaction(Tx, privateKey);
    const swapReceipt = await web3.eth.sendSignedTransaction(signedSwapTx.rawTransaction);
    console.log('buy交易哈希:', swapReceipt.transactionHash);
    return swapReceipt;
}

// 封装卖币函数
async function pancakesell(web3, route, routerAddress, sellamountIn, sellamountOutMin, sellpath, walletAddress, deadline, privateKey, nonce) {
    const sellData = route.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
        sellamountIn,
        sellamountOutMin,
        sellpath,
        walletAddress,
        deadline,
    ).encodeABI();
    const selltx = {
        from: walletAddress,
        to: routerAddress,
        gas: 200000,
        gasPrice: await web3.eth.getGasPrice(),
        value: '0',
        data: sellData,
        nonce: nonce,
        chainId: 56,
    };
    const signedSellTx = await web3.eth.accounts.signTransaction(selltx, privateKey);
    const sellReceipt = await web3.eth.sendSignedTransaction(signedSellTx.rawTransaction);
    console.log('sell交易哈希:', sellReceipt.transactionHash);
    return sellReceipt;
}

/*async function main() {
    const walletAddress = process.env.SENDER_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const tokenContractAddress = '0x05008b299d880eeb424f1dd84d3b85a0381b4444';
    const tokenContractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"MODE_NORMAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MODE_TRANSFER_CONTROLLED","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MODE_TRANSFER_RESTRICTED","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_mode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"totalSupply","type":"uint256"}],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"v","type":"uint256"}],"name":"setMode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);
    const routerAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e';
    const routerABI = JSON.parse(fs.readFileSync('pancakeabi.json', 'utf8'));
    const route = new web3.eth.Contract(routerABI, routerAddress);

    // // 交易
    const buypath = ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', tokenContractAddress];
    const buyamountOutMin = web3.utils.toWei('1', 'ether');
    const deadline = Math.floor(Date.now() / 1000) + 60;
    const buyvalue = web3.utils.toWei('0.00001', 'ether');
    let nonce = await web3.eth.getTransactionCount(walletAddress);

    // 调用买币函数
    await buy(web3, route, routerAddress, buypath, buyamountOutMin, walletAddress, deadline, buyvalue, privateKey, nonce);

    nonce++;
    const approveTx = {
        from: walletAddress,
        to: tokenContractAddress,
        gas: 200000,
        gasPrice: await web3.eth.getGasPrice(),
        nonce: nonce,
        chainId: 56,
        data: tokenContract.methods.approve(routerAddress, web3.utils.toWei('1000', 'ether')).encodeABI()
    };
    const signedApproveTx = await web3.eth.accounts.signTransaction(approveTx, privateKey);
    const approveReceipt = await web3.eth.sendSignedTransaction(signedApproveTx.rawTransaction);
    console.log('授权交易哈希:', approveReceipt.transactionHash);
    // 授权完成后，nonce+1，进行卖币
    nonce++;
    const sellamountIn = web3.utils.toWei('1','ether');
    const sellamountOutMin = web3.utils.toWei('0.000005','ether');
    const sellpath = [tokenContractAddress,'0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'];
    // 调用卖币函数
    await sell(web3, route, routerAddress, sellamountIn, sellamountOutMin, sellpath, walletAddress, deadline, privateKey, nonce);
}

main(); */





