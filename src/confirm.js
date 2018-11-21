const Web3 = require('web3')
const MongoDB = require('./mongodb')
const trackers = require('./mysql')

async function getConfirmations(txHash) {
  try {
    // Instantiate web3 with HttpProvider
    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL))

    // Get transaction details
    const trx = await web3.eth.getTransaction(txHash)
    console.log('await web3.eth.getTransaction:', trx)
    await MongoDB.saveTransfer(trx)
    // Get current block number
    const currentBlock = await web3.eth.getBlockNumber()
    console.log('await web3.eth.getBlockNumber:', currentBlock)

    const block = await web3.eth.getBlock(trx.blockHash)
    console.log('await block:', block)
    console.log('timestamp:', block.timestamp)

    // When transaction is unconfirmed, its block number is null.
    // In this case we return 0 as number of confirmations
    return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
  } catch (error) {
    console.log('GetConfirmations', error)
  }
}

function etherTransaction(txHash, confirmations = 10) {
  console.log('confirmEtherTransaction', txHash)
  setTimeout(async () => {
    // Get current number of confirmations and compare it with sought-for value
    const trxConfirmations = await getConfirmations(txHash)
    console.log('Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)')

    if (trxConfirmations >= confirmations) {
      // Handle confirmation event according to your business logic

      console.log('Transaction with hash ' + txHash + ' has been successfully confirmed')

      return
    }
    // Recursive call
    return confirmEtherTransaction(txHash, confirmations)
  }, 30 * 1000)
}

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL))
async function tokenTransaction(evt) {
  try {
    const block = await web3.eth.getBlock(evt.blockHash)

    // trackers.query('INSERT INTO ?? (id, blockNumber, transactionHash, transactionIndex, blockHash, logIndex, removed, event, signature, raw, addressFrom, addressTo, amount) VALUES ??', ['transfers', evt.id, evt.blockNumber, evt.transactionHash, evt.transactionIndex, evt.blockHash, evt.logIndex, evt.removed, evt.event, evt.signature, evt.raw, evt.from,evt.to,evt.value])
    trackers.query('INSERT INTO ?? (id, blockNumber, transactionHash, blockHash, event, addressFrom, addressTo, amount, created) VALUES (?,?,?,?,?,?,?,?,?)', ['transfers', evt.id, evt.blockNumber, evt.transactionHash, evt.blockHash, evt.event, evt.returnValues.from, evt.returnValues.to, evt.returnValues.value, block.timestamp])
      // .then(result => console.log('Save transfers', '插入成功'))
    .catch(err => console.error(`Save transfers error1 {code: ${err.code}, sqlState: ${err.sqlState}, sqlMessage: ${err.sqlMessage}}`, evt))  
  } catch (error){
    trackers.query('INSERT INTO ?? (id, blockNumber, transactionHash, blockHash, event, addressFrom, addressTo, amount) VALUES (?,?,?,?,?,?,?,?)', ['transfers', evt.id, evt.blockNumber, evt.transactionHash, evt.blockHash, evt.event, evt.returnValues.from, evt.returnValues.to, evt.returnValues.value])
    // .then(result => console.log('Save transfers', '插入成功'))
    .catch(err => console.error(`Save transfers error1 {code: ${err.code}, sqlState: ${err.sqlState}, sqlMessage: ${err.sqlMessage}}`, evt))
  }
}

function saveTransfers(events) {
  var items = []
  for(var i = 0; i < events.length; i ++) {
    items[i] =  [evt.id, evt.blockNumber, evt.transactionHash, evt.blockHash, evt.event, evt.returnValues.from, evt.returnValues.to, evt.returnValues.value]
  }
  trackers.query('INSERT INTO ?? (id, blockNumber, transactionHash, blockHash, event, addressFrom, addressTo, amount) VALUES ?', ['transfers', items])
  // .then(result => console.log('Save transfers', '插入成功'))
  .catch(err => console.error('Save transfers error1', `{code: ${err.code}, sqlState: ${err.sqlState}, sqlMessage: ${err.sqlMessage}}`))
}

async function updateTransferTime(blockHash) {
  try {
    const block = await web3.eth.getBlock(blockHash)
    trackers.query('UPDATE ?? SET created=? WHERE blockNumber=?', ['transfers', block.timestamp, block.number])
    .catch(err => console.error('updateTransferTime', `{code: ${err.code}, sqlState: ${err.sqlState}, sqlMessage: ${err.sqlMessage}}`))
  } catch(err) {
    console.error(' await web3.eth.getBlock', err)
  }
}

async function getLastBlockNumber() {
  const currentBlock = await web3.eth.getBlockNumber()
  return currentBlock
}

module.exports = {
  saveTransfers,
  updateTransferTime,
  etherTransaction,
  tokenTransaction,
  getLastBlockNumber
}
