require('dotenv').config();
const Web3 = require('web3');
const axios = require('axios');
const fs = require('fs');
const web3 = new Web3('https://bsc-dataseed.binance.org/');
async function getAbiFromBscScan(address, apiKey) {
    const url = `https://api.etherscan.io/v2/api?chainid=56&module=contract&action=getabi&address=${address}&apikey=${apiKey}`;
    const res = await axios.get(url);
    if (res.data.status === "1") {
        return JSON.parse(res.data.result);
    } else {
        throw new Error('获取ABI失败: ' + res.data.result);
    }
}

// 封装买币函数
async function fourmemebuy(web3, router, tokenContractAddress, funds, minAmount, gas, privateKey, nonce) {
    const buyData = router.methods.buyTokenAMAP(
        tokenContractAddress,
        funds,
        minAmount,
    ).encodeABI();
    
    console.log('交易数据:', buyData);
    
    const buyTx = {
        to: router.options.address,
        gas: gas,
        gasPrice: await web3.eth.getGasPrice(),
        value: funds,
        data: buyData,
        nonce: nonce,
        chainId: 56,
    };
    
    console.log('交易对象:', JSON.stringify(buyTx, null, 2));
    
    const signedSwapTx = await web3.eth.accounts.signTransaction(buyTx, privateKey);
    console.log('交易已签名');
    
    const swapReceipt = await web3.eth.sendSignedTransaction(signedSwapTx.rawTransaction);
    console.log('buy交易哈希:', swapReceipt.transactionHash);
    console.log('交易状态:', swapReceipt.status);
    return ;
}

// 封装授权函数
async function approve(web3, tokenContract, spenderAddress, amount, walletAddress, privateKey, nonce) {
    const approveTx = {
        from: walletAddress,
        to: tokenContract.options.address,
        gas: 200000,
        gasPrice: await web3.eth.getGasPrice(),
        nonce: nonce,
        chainId: 56,
        data: tokenContract.methods.approve(spenderAddress, amount).encodeABI()
    };
    const signedApproveTx = await web3.eth.accounts.signTransaction(approveTx, privateKey);
    const approveReceipt = await web3.eth.sendSignedTransaction(signedApproveTx.rawTransaction);
    console.log('授权交易哈希:', approveReceipt.transactionHash);
    return approveReceipt;
}

// 封装卖币函数
async function fourmemesell(web3, router, tokenContractAddress, amount, gas, privateKey, nonce) {
    const sellData = router.methods.sellToken(
        tokenContractAddress,     
        amount,              
    ).encodeABI();

    const sellTx = {
        to: router.options.address,
        gas: gas,
        gasPrice: await web3.eth.getGasPrice(),
        value: '0',
        data: sellData,
        nonce: nonce,
        chainId: 56,
    };
    const signedSellTx = await web3.eth.accounts.signTransaction(sellTx, privateKey);
    const sellReceipt = await web3.eth.sendSignedTransaction(signedSellTx.rawTransaction);
    console.log('sell交易哈希:', sellReceipt.transactionHash);
    return sellReceipt;
}

/*async function main() {
    const walletAddress = process.env.SENDER_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const tokenContractAddress = '0x48d69da2f3f0434808034261531ddd0debaa4444';
    const apikey = 'G9ZSP7JJJVDS7NAT9R4Z3PS9JG7B2CD4CC';
    const tokenConteactABI =await getAbiFromBscScan(tokenContractAddress, apikey);
    //实例化
    const tokenContract = new web3.eth.Contract(tokenConteactABI,tokenContractAddress);
    const rounterAddress = '0x5c952063c7fc8610FFDB798152D69F0B9550762b';
    const routerABI = JSON.parse(fs.readFileSync('abi.json', 'utf8'));
    //实例化
    const router = new web3.eth.Contract(routerABI,rounterAddress);
    const wbnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    const poolAddress = '0x5c952063c7fc8610ffdb798152d69f0b9550762b';

    //买
    const buyamountOutMin = web3.utils.toWei('0.000001','ether'); // 降低滑点保护
    const funds = web3.utils.toWei('0.00001','ether');
    let nonce = await web3.eth.getTransactionCount(walletAddress);
    const gas = 200000; // 增加到30万gas，确保足够
    
    // 调用buy函数
    await fourmemebuy(web3, router, tokenContractAddress, funds, buyamountOutMin, gas, privateKey, nonce);

    // 授权
    nonce++;
    await approve(web3, tokenContract, rounterAddress, web3.utils.toWei('10000', 'ether'), walletAddress, privateKey, nonce);

    // 卖
    nonce++;
    const sellamountln = web3.utils.toWei('2000','ether'); 
    await fourmemesell(web3, router, tokenContractAddress, sellamountln, gas, privateKey, nonce);
}

main();*/