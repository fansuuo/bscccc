const Web3 = require('web3');
const web3 = new Web3('https://bsc-dataseed1.defibit.io/');

// 解析 Input Data 参数的函数
function parseInputData(inputData) {
  if (!inputData || inputData === '0x') {
    return { methodId: null, parameters: [] };
  }

  const result = {
    methodId: null,
    parameters: [],
    rawData: inputData
  };

  // 提取方法ID（前4个字节）
  if (inputData.length >= 10) {
    result.methodId = inputData.substring(0, 10);
  }

  // 提取参数数据（去掉方法ID后的部分）
  const paramsData = inputData.substring(10);
  
  if (paramsData.length === 0) {
    return result;
  }

  // 按32字节（64个十六进制字符）切割参数
  const paramLength = 64; // 32字节 = 64个十六进制字符
  const parameters = [];

  for (let i = 0; i < paramsData.length; i += paramLength) {
    const param = paramsData.substring(i, i + paramLength);
    if (param.length > 0) {
      parameters.push(param);
    }
  }

  result.parameters = parameters;
  return result;
}

async function getTransactionDetails(txHash) {
    try {
      // 获取特定交易的详细信息
      const transaction = await web3.eth.getTransaction(txHash);
      return(transaction.input)
    } catch (error) {
      console.error('Error getting transaction details:', error);
    }
}

function getAddress(inputData, paramIndex) {
  // 去掉0x
  const cleanInput = inputData.replace(/^0x/, '');
  const paramsData = cleanInput.substring(8);
  // 取第paramIndex个参数
  const paramHex = paramsData.substring(paramIndex * 64, (paramIndex + 1) * 64);
  // 取低20字节
  const address = '0x' + paramHex.substring(24);
  return { address };
}
function findAdressWith4444(params) {
  for (const p of params) {
    if (p.includes('4444')) {
      // 取低20字节转为address
      return '0x' + p.substring(24);
    }
  }
  return null;
}
function parsedynamicData(inputData) {
  if (!inputData || inputData === '0x') return [];
  const paramsData = inputData.replace(/^0x/, '').substring(8); // 去掉0x和方法ID
  const paramLength = 64;
  const parameters = [];
  for (let i = 0; i < 9 * paramLength; i += paramLength) { // 只取前9个静态参数
    const param = paramsData.substring(i, i + paramLength);
    if (param.length > 0) parameters.push(param);
  }
  // 剩下的是动态参数
  const dynamicData = paramsData.substring(9 * paramLength);
  return { dynamicData };
}

function isZeroAddress(param) {
  // 取后40位
  const addr = param.slice(-40);
  // 判断是不是全0
  return /^0{40}$/.test(addr);
}

/*async function main() {
  const txHash = '0x409c21b136671ba6565943304f309294241bceda91a1eac5579ddd6a565ab597';
  const inputData = await getTransactionDetails(txHash);
  const methodId = inputData.substring(0, 10);
  
  // 解析input data
  const parsed = parseInputData(inputData);
  console.log('inputData:', inputData);
  
  // 在switch前统一声明
  let tokenAddress = null;
  let found = null;
  let tradeType = null;

  switch(methodId){
    //买
    case '0xdf2023a4':
    case '0x1a27cc2c':
    case '0x87f27655' : 
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
    //买
    case '0x4fc456bf': {
      const dynamicData = parsedynamicData(inputData);
      tokenAddress = '0x' + dynamicData.dynamicData.slice(46, 86);
      found = 2;
      tradeType = 1;
      break;
    }
    //卖
    case '0x6f294f5a':
    case '0x3e11741f':
    case '0x71905f2e': //69
    case '0x1c25dd': //69
    case '0x3b164a8e': //69
    case '0x4fc456bf': { //69
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

  // 统一输出
  console.log('tokenAddress:', tokenAddress);
  console.log('tradeplatform:', found);
  console.log('tradeType:', tradeType);
}
main();*/

