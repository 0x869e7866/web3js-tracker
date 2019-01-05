const ProviderEngine = require('web3-provider-engine')
const Web3 = require('web3')
const validateTransaction = require('./validate')
const confirmEtherTransaction = require('./confirm')
const TOKEN_ABI = require('./abi')

// Instantiate web3 with WebsocketProvider
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL))
// Instantiate web3 with HttpProvider
const web3Http = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL))

let blockchainManager = null

class BlockchainManager {
  constructor() {
    blockchainManager = blockchainManager || this
    return blockchainManager
  }

  // The web3.eth.subscribe function lets you subscribe to specific events in the blockchain.
  // web3.eth.subscribe(type [, options] [, callback])
  watchEtherTransfers(tpe, options, callback) {
    return new Promise((resolve, reject) => {
      const subscription = web3.eth.subscribe(tpe, options, (error, result) => {
        if (error) {console.log(error); reject(error)}
      }).on('data', async (txHash) => { resolve(txHash) })
    })
  }

  watchTokenTransfers(options, callback) {

    // // Instantiate token contract object with JSON ABI and address
    // const tokenContract = new Promise((resolve, reject) => {
    //   new web3.eth.Contract(TOKEN_ABI, process.env.TOKEN_CONTRACT_ADDRESS,(error, result) => { 
    //     return error ? reject(error) : resolve(result)
    //   })
    // }) 
    // // Subscribe to Transfer events matching filter criteria
    // tokenContract
    //   .then(contract => {contract.events.Transfer(options, async (err, evt) => callback(err, evt))})
    //   .catch(err => {console.error('Subscribe to Transfer events error', err)})

    const tokenContract = new web3.eth.Contract(TOKEN_ABI, process.env.TOKEN_CONTRACT_ADDRESS)

    tokenContract.events.Transfer(options, async (error, event) => {
      callback(error,event)
  
      console.log('Transaction event', event);
      console.log('ReturnValues from:', event.returnValues.from);
      console.log('ReturnValues to:', event.returnValues.to);
      console.log('ReturnValues value:', event.returnValues.value);
  
      console.log('Found incoming Pluton transaction from ' + process.env.WALLET_FROM + ' to ' + process.env.WALLET_TO + '\n');
      console.log('Transaction value is: ' + process.env.AMOUNT)
      console.log('Transaction hash is: ' + event.transactionHash + '\n')
  
      // Initiate transaction confirmation
      // confirmEtherTransaction(event.transactionHash)
      return
    })
  }

  // web3.eth.getPastEvents return values.
  getTokenPastEvents() {
    console.log('-----------------------------------Matching Smart Contract Events-----------------------------------')
    const tokenContract = new web3.eth.Contract(TOKEN_ABI, process.env.TOKEN_CONTRACT_ADDRESS)
    // Search the contract events for the hash in the event logs and show matching events.
    tokenContract.getPastEvents('allEvents', options, (error, events) => {
        console.log(events.length)
        events.forEach(event => {
          // console.log('Event      tag: ' + event.event)
          // if (event.event === 'Transfer') {
          //   const newObj = Object.assign(event, {"returnValues": {"from": event.returnValues.from, "to": event.returnValues.to, "value": event.returnValues.value}})
          //   console.log('Address   from: ' + event.returnValues.from)
          //   console.log('Address     to: ' + event.returnValues.to)
          //   console.log('Greeting value: ' + event.returnValues.value)
          // } else {
          //   console.log('Approval    from: ' + event.returnValues.owner)
          //   console.log('Approval spender: ' + event.returnValues.spender)
          //   console.log('Approval   value: ' + event.returnValues.value)
          //   const newObj = Object.assign(event, {"returnValues": {"owner": event.returnValues.owner, "spender": event.returnValues.spender, "value": event.returnValues.value}})
          // }
          // console.log('assign event: ', event)
          // const newObj = Object.assign(event, {"returnValues": {"from": event.returnValues.from, "to": event.returnValues.to, "value": event.returnValues.value}})
          // console.log('Object Assigned: ', newObj)

          if (event.event != 'Transfer') {
          const newObj = Object.assign(event, {"returnValues": {"owner": event.returnValues.owner, "spender": event.returnValues.spender, "value": event.returnValues.value}})
          console.log('Object Assigned: ', newObj)
          }
        })
    })
  }
}