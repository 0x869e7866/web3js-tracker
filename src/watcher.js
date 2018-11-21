const transfers = require('./transfers')
const blockchainManager = require('./blockchainManager')


var taskQueue, eventsQueue = []

const lastPastEventBlockNumber = (lastBlockNumber) => transfers.getLastPastEventBlockNumber().then(blockNumber => { return {lastBlockNumber: lastBlockNumber, blockNumber: blockNumber} })

blockchainManager.getLastBlockNumber()
    .then(lastPastEventBlockNumber)
    .then(numbers => { 
        console.log('Last past event blockNumber and last blockNumber', numbers)
        // blockchainManager.tokenTransfers({fromBlock: 6739960}, (err, event) => {
        //     Object.assign(event, {"returnValues": {"from": event.returnValues.from, "to": event.returnValues.to, "value": event.returnValues.value}})
        //     console.log(event);
        //     console.log('ReturnValues from:', event.returnValues.from);
        //     console.log('ReturnValues to:', event.returnValues.to);
        //     console.log('ReturnValues value:', event.returnValues.value);
        // })
    })

// function tokenTransfers(options) {
//   const tokenContract = new web3.eth.Contract(TOKEN_ABI, process.env.TOKEN_CONTRACT_ADDRESS)
  
//   tokenContract.events.Transfer(options, async (error, event) => {
//     console.log(event);
//     console.log('ReturnValues from:', event.returnValues.from);
//     console.log('ReturnValues to:', event.returnValues.to);
//     console.log('ReturnValues value:', event.returnValues.value);
//   })
// }

function watchTokenTransfers(options) {
  const tokenContract = new web3.eth.Contract(TOKEN_ABI, process.env.TOKEN_CONTRACT_ADDRESS)

  tokenContract.events.Transfer(options, async (error, event) => {
    if (error) {
      console.log(error)
      return
    }
    console.log(`Transaction event: ${event} \n`);

    // { address: '0x025eE4F2C50B49eC26d714BD7B4304698D969854',
    // blockNumber: 4211656,
    // transactionHash:
    //  '0xcbaa6b095d4395ea49de62f7f5bdfc89b2ec581f238471a223c2186906fff9e7',
    // transactionIndex: 0,
    // blockHash:
    //  '0x74c8c6da93a028dc068c92e268baf3626018a589afc5bc80fab4615ee9b5b42e',
    // logIndex: 0,
    // removed: false,
    // id: 'log_02a568e5',
    // returnValues:
    //  Result {
    //    '0': '0x6E75a6A2c6d091c396D325171839E9AFf9D13276',
    //    '1': '0x1C212AbAEe7D405397b3fe4B7f1DFE8E4A96b01f',
    //    '2': '1000000000',
    //    from: '0x6E75a6A2c6d091c396D325171839E9AFf9D13276',
    //    to: '0x1C212AbAEe7D405397b3fe4B7f1DFE8E4A96b01f',
    //    value: '1000000000' },
    // event: 'Transfer',
    // signature:
    //  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    // raw:
    //  { data:
    //     '0x000000000000000000000000000000000000000000000000000000003b9aca00',
    //    topics:
    //     [ '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    //       '0x0000000000000000000000006e75a6a2c6d091c396d325171839e9aff9d13276',
    //       '0x0000000000000000000000001c212abaee7d405397b3fe4b7f1dfe8e4a96b01f' ] } }

    console.log(event);
    console.log('ReturnValues from:', event.returnValues.from);
    console.log('ReturnValues to:', event.returnValues.to);
    console.log('ReturnValues value:', event.returnValues.value);

    // Initiate transaction confirmation
    const newObj = Object.assign(event, {"returnValues": {"from": event.returnValues.from, "to": event.returnValues.to, "value": event.returnValues.value}})

    Confirm.tokenTransaction(newObj)
    // callback(event)
    return
  })
}

// web3.eth.getPastEvents return values.
function getTokenPastEvents(options) {
  const tokenContract = new web3Http.eth.Contract(TOKEN_ABI, process.env.TOKEN_CONTRACT_ADDRESS)

  // Fun console text, you can ignore this.
  console.log('Matching Smart Contract Events', options)

  // Search the contract events for the hash in the event logs and show matching events.
  tokenContract.getPastEvents('Transfer', options, (error, events) => {
      console.log(`PastEvents ${options.fromBlock}-${options.toBlock} has ${events.length} events`)
      // if (error) {
      //   console.log('getPastEvents error', error)
      //   return
      // }

      var newEvents = []
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

        if (event.event === 'Transfer') {
          // const newObj = Object.assign(event, {"returnValues": {"owner": event.returnValues.owner, "spender": event.returnValues.spender, "value": event.returnValues.value}})
          const newObj = Object.assign(event, {"returnValues": {"from": event.returnValues.from, "to": event.returnValues.to, "value": event.returnValues.value}})
          // console.log('Object Assigned: ', newObj)
          // callback(newObj)
          // newEvents.push(newObj)
          Confirm.tokenTransaction(newObj)
        }
      })

      // Confirm.saveTransfers(newEvents)
      // console.log(`PastEvents ${options.fromBlock}-${options.toBlock} has ${events.length} events`)
      // newEvents.forEach(evt => Confirm.tokenTransaction(evt.blockHash))
  })
  // const filter = { fromBlock: 0 , toBlock: 'latest'}; // filter for your address
  // const events = tokenContract.events.allEvents(options, console.log); // get all events

  // // //const subscription = web3.eth.subscribe('pendingTransactions', options)
  // web3.eth.subscribe('logs', options, (error, result) => {if (!error) console.log(result) })
  //   .on("data", function(log){
  //       console.log(log);
  //   })
  //   .on("changed", function(log){
  //   });
}

function tokenPastEvents(options, currentBlockNumber = 0) {
  console.log('Take token past events ', options)
  setTimeout(async () => {
    if (options.toBlock > currentBlockNumber) {
      console.log('Transaction with hash ' + txHash + ' has been successfully confirmed')
      return
    }
    getTokenPastEvents(options)
    // Recursive call
    return tokenPastEvents({"fromBlock": options.toBlock, "toBlock": options.toBlock + 200}, currentBlockNumber)
  }, 15 * 1000)
}

module.exports = {
  tokenPastEvents,
  tokenTransfers,
  getTokenPastEvents,
  watchTokenTransfers
}
