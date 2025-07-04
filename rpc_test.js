const Web3 = require('web3');
const web3 = new Web3('https://bsc-dataseed1.defibit.io/');
const {findAdressWith4444,parsedynamicData,isZeroAddress,parseInputData} = require('./tx.js');
const {fourmemebuy,fourmemesell,approve,getAbiFromBscScan} = require('./fourmemetest.js');
const {pancakebuy,pancakesell} = require('./pancakeswap.js')
const fs = require('fs');


const web3ws = new Web3(new Web3.providers.WebsocketProvider("wss://bsc-mainnet.core.chainstack.com/cdd3a1f143a59c80b1d59f6b75dcf8bf", {
    clientConfig: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
        keepalive: true,
        keepaliveInterval: 30000,  // 30秒心跳
    },
    reconnect: {
        auto: true,
        delay: 1000,
        maxAttempts: 20,
        onTimeout: true
    },
    timeout: 10000,
    headers: {
        'User-Agent': 'BSC-Pending-Monitor'
    }
}));
const targetAddress = process.env.WALLET;
const apikey = process.env.API_KEY;
const walletAddress = process.env.SENDER_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;


function getTime(){
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10?'0'+month:month
    let day = date.getDate()
    day = day < 10?'0'+day:day
    let hour = date.getHours()
    hour = hour < 10?'0'+hour:hour
    let min = date.getMinutes()
    min = min < 10?'0'+min:min
    let sec = date.getSeconds()
    sec = sec < 10?'0'+sec:sec
    return year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec
}


const main = async ()=>{
    console.log(`[${getTime()}]开始监听交易`)
    web3ws.eth.subscribe('pendingTransactions', async (error, txHash) => {
        if (error) {
            console.error('订阅错误:', error);
            // return;
        }
        
        try{
            // 获取交易详情
            const tx = await web3ws.eth.getTransaction(txHash);
            //console.log(tx);
            if (tx) {
                if (
                    (tx.from && tx.from.toLowerCase() === targetAddress) ||
                    (tx.to && tx.to.toLowerCase() === targetAddress)
                ) {
                    console.log(`[${getTime()}]发现相关交易:`, tx);
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    const methodId = tx.input.substring(0,10);
                    let tokenAddress = null;
                    let found = null;
                    let tradeType = null;
                    const parsed = parseInputData(tx.input);

                    switch (methodId) {
                        // 买
                        case '0xdf2023a4':
                        case '0x1a27cc2c':
                        case '0x87f27655':
                            tokenAddress = findAdressWith4444(parsed.parameters);
                            found = null;
                            tradeType = 1;
                            break;
                        case '0xedf9e251':
                            tokenAddress = findAdressWith4444(parsed.parameters);
                            found = 1;
                            tradeType = 1;
                            break;
                        case '0x3b164a8e':
                            tokenAddress = findAdressWith4444(parsed.parameters);
                            found = 1;
                            tradeType = 1;
                            break;
                        case '0x7d7b857d':
                            tokenAddress = findAdressWith4444(parsed.parameters);
                            found = 1;
                            tradeType = 1;
                            break;
                        case '0xfb9e2e72':
                            tokenAddress = findAdressWith4444(parsed.parameters);
                            found = 2;
                            tradeType = 1;
                            break;
                        case '0x7771fdb0':
                            tokenAddress = findAdressWith4444(parsed.parameters);
                            found = 1;
                            tradeType = 1;
                            break;
                        // 买
                        case '0x4fc456bf': {
                            const dynamicData = parsedynamicData(tx.input);
                            tokenAddress = '0x' + dynamicData.dynamicData.slice(46, 86);
                            found = 2;
                            tradeType = 1;
                            break;
                        }
                        // 卖
                        case '0x6f294f5a':
                        case '0x3e11741f':
                        case '0x71905f2e': // 69
                        case '0x1c25dd': // 69
                        case '0x3b164a8e': // 69
                        case '0x4fc456bf': { // 69
                            tokenAddress = findAdressWith4444(parsed.parameters);
                            found = null;
                            tradeType = 2;
                            break;
                        }
                        case '0xe63aaf3':
                            tokenAddress = findAdressWith4444(parsed.parameters);
                            found = 1;
                            tradeType = 2;
                            break;
                        case '0x9adc3c86':
                            tokenAddress = findAdressWith4444(parsed.parameters);
                            found = 2;
                            tradeType = 2;
                            break;
                        case '0x312f77b5':
                            tokenAddress = findAdressWith4444(parsed.parameters);
                            found = 1;
                            tradeType = 2;
                            break;
                        case '0x2dd327c5': {
                            if (parsed.parameters.length >= 18) {
                                const param16 = parsed.parameters[16];
                                const param17 = parsed.parameters[17];
                                // 提取[16]的后36位
                                const last36Of16 = param16.substring(param16.length - 36);
                                // 提取[17]的前4位
                                const first4Of17 = param17.substring(0, 4);
                                // 拼接并加上0x前缀
                                tokenAddress = '0x' + last36Of16 + first4Of17;
                                found = 2;
                                tradeType = 1;
                            }
                            break;
                        }
                        case '0x5b9e9006': {
                            if (parsed.parameters.length >= 2) {
                                const param0 = parsed.parameters[0];
                                const param1 = parsed.parameters[1];
                                if (!isZeroAddress(param0) && isZeroAddress(param1)) {
                                    tokenAddress = '0x' + param0.slice(-40);
                                    tradeType = 1;
                                } else if (isZeroAddress(param0) && !isZeroAddress(param1)) {
                                    tokenAddress = '0x' + param1.slice(-40);
                                    tradeType = 2;
                                } else {
                                    tokenAddress = null;
                                    tradeType = null;
                                }
                                found = 2;
                            }
                            break;
                        }
                        default:
                            console.log("未知的方法ID:", methodId);
                            break;
                    }
                    const tokenConteactABI = await getAbiFromBscScan(tokenAddress,apikey);
                    const tokenContract = new web3.eth.Contract(tokenConteactABI,tokenAddress);
                    const fourrounterAddress = '0x5c952063c7fc8610FFDB798152D69F0B9550762b';
                    const fourrouterABI = JSON.parse(fs.readFileSync('abi.json', 'utf8'));
                    const pancakerouterAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e';
                    const pancakerouterabi = JSON.parse(fs.readFileSync('pancakeabi.json', 'utf8'));
                    //实例化
                    const fourrouter = new web3.eth.Contract(fourrouterABI,fourrounterAddress);
                    const pancakerouter = new web3.eth.Contract(pancakerouterabi,pancakerouterAddress);
                    const amount = web3.utils.toWei('10000000', 'ether')
                    const deadline = Math.floor(Date.now() / 1000) + 60;
                    if(found == 1 && tradeType == 1  ){
                        const funds = tx.value;
                        const buyamountOutMin = web3.utils.toWei('1','ether');
                        const gas = tx.gas *2;
                        let nonce = await web3.eth.getTransactionCount(walletAddress);
                        await fourmemebuy(web3,fourrouter,tokenAddress,funds,buyamountOutMin,gas,privateKey,nonce);
                        console.log(`[${getTime()}]内盘买入成功`);
                        nonce++
                        await approve(web3, tokenContract, fourrounterAddress, amount, walletAddress, privateKey, nonce);
                    }else if(found == 1 && tradeType == 2){
                        const gas = tx.gas *2;
                        const amount = tx.value;
                        let nonce = await web3.eth.getTransactionCount(walletAddress);
                        await fourmemesell(web3, fourrouter, tokenAddress, amount, gas, privateKey, nonce)
                        console.log(`[${getTime()}]内盘卖出成功`);
                    }else if(found == 2 && tradeType == 1){
                        const buypath = ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', tokenAddress];
                        const buyamountOutMin = web3.utils.toWei('1', 'ether');
                        const buyvalue =tx.value;
                        let nonce = await web3.eth.getTransactionCount(walletAddress);
                        await pancakebuy(web3, pancakerouter, pancakerouterAddress, buypath, buyamountOutMin, walletAddress, deadline, buyvalue, privateKey, nonce);
                        console.log(`[${getTime()}]外盘买入成功`);
                        await approve(web3, tokenContract, pancakerouterAddress, amount, walletAddress, privateKey, nonce);
                    }else if(found == 2 && tradeType ==2){
                        const sellamountIn =tx.value;
                        const sellamountOutMin = web3.utils.toWei('0.000005','ether');    //滑点
                        const sellpath = [tokenAddress,'0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'];
                        let nonce = await web3.eth.getTransactionCount(walletAddress);
                        await pancakesell(web3, pancakerouter, pancakerouterAddress, sellamountIn, sellamountOutMin, sellpath, walletAddress, deadline, privateKey, nonce);
                        console.log(`[${getTime()}]外盘卖出成功`);
                    }else{
                        console.log('不知道的路由，暂时不交易')
                    }

                    
                }
            }
        }catch(e){
            if (e.message && e.message.includes('RPS limit')) {
                console.log(`[${getTime()}]达到RPS限制`);
            } else {
                console.log("main error::", e);
            }
        }
    });
}


main()
