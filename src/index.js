require('./env')

const transfers = require('./transfers')
const blockchainManager = require('./blockchainManager')

//   Generate filter options
const options = { //5961000-5962000 //5964600-5964700 // 5995500-5995600
    filter: {},
    fromBlock: 6530000, //6528604
    toBlock: 6531000, //6505911
    // address: process.env.TOKEN_CONTRACT_ADDRESS,
    // topics: [ 
    //     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    //     '0x0000000000000000000000006e75a6a2c6d091c396d325171839e9aff9d13276',
    //     '0x0000000000000000000000001c212abaee7d405397b3fe4b7f1dfe8e4a96b01f' 
    // ]
}

var taskQueue = [], eventsQueue = [], noTimestamp = []

const lastPastEventBlockNumber = (lastBlockNumber) => transfers.getLastPastEventBlockNumber().then(blockNumber => { return {lastBlockNumber: lastBlockNumber, blockNumber: blockNumber} })

// blockchainManager.getLastBlockNumber()
//     .then(lastPastEventBlockNumber)
//     .then(numbers => { 
//         console.log('Last past event blockNumber and last blockNumber', numbers)
//         blockchainManager.tokenTransfers({fromBlock: numbers.blockNumber}, (err, event) => {
//             err ? taskQueue.push({action: 'transfers', fromBlock: numbers.blockNumber}) : 
//                   eventsQueue.push(Object.assign(event, {"returnValues": {"from": event.returnValues.from, "to": event.returnValues.to, "value": event.returnValues.value}}))
//         })
//     })
//     .catch(err => console.error('blockchainManager.tokenTransfers', err))
// // watcher.getTokenPastEvents(options, evt => { console.log('watcher.getTokenPastEvents', evt) })

var tokenTransfers = function() {
  blockchainManager.getLastBlockNumber()
    .then(lastPastEventBlockNumber)
    .then(numbers => { 
        console.log('Last past event blockNumber and last blockNumber', numbers)
        blockchainManager.tokenTransfers({fromBlock: numbers.blockNumber}, (err, event) => {
            err ? taskQueue.push({action: 'transfers', fromBlock: numbers.blockNumber}) : 
                  eventsQueue.push(Object.assign(event, {"returnValues": {"from": event.returnValues.from, "to": event.returnValues.to, "value": event.returnValues.value}}))
        })
    })
    .catch(err => { console.error('blockchainManager.tokenTransfers', err); tokenTransfers() })  
}

// watcher.getTokenPastTransferEvents(options)
//   .then(events => console.log(`watcher.getTokenPastTransferEvents(${options})`, events.length))
//   .catch(err => console.error(`watcher.getTokenPastTransferEvents(${options})`, err))
let saveTransfer = function(evt) {
    blockchainManager.getBlock(evt.blockHash)
        .then(block => { return transfers.save(evt, block) })
        .catch(err  => { console.error('save token transfers', err); noTimestamp.push(evt) })
}

var eventTimer = setInterval(async () => {
    console.log(`Received ${ eventsQueue.length } events `)
    console.log(`Received ${ taskQueue.length } tasks `)
}, 3 * 1000)

tokenTransfers()
// transfers.getLastPastEventBlockNumber()
//     .then(blockNumber => { console.log('Last past event blockNumber', blockNumber) })

// blockchainManager.getBlock('0xb92db8262ce55e170b02266263f2650b576f616585cc65a3c5a0c469c8500527')
//     .then(block => { console.log('blockchainManager get block', block) })

// blockchainManager.getTokenPastTransferEvents(options)
//     .then(evts => {
//         evts.forEach(evt => { console.log('Token Past Transfer Events', evt) 
//             transfers.save(evt)
//         })
//     })

// blockchainManager.tokenTransfers(options, (error, event) => {
//     queue.push(event)
// })

// transfers.getLastPastEventBlockNumber()
//  .then(blockNumber => {
//     console.log('Last past event blockNumber', blockNumber)
//     // const blockNumber =  number[0].block ? number[0].block : 0
//     const fromBlock = parseInt(blockNumber / 1000) * 1000
//     const newOptions = Object.assign(options, {'fromBlock': fromBlock, 'toBlock': fromBlock + 500})
//     //watcher.tokenPastEvents(newOptions,  lastBlockNumber)
//     // watcher.watchTokenTransfers({fromBlock: blockNumber })

//     blockchainManager.tokenTransfers({fromBlock: blockNumber}, (err, event) => {
//         console.log(event);
//         console.log('ReturnValues from:', event.returnValues.from);
//         console.log('ReturnValues to:', event.returnValues.to);
//         console.log('ReturnValues value:', event.returnValues.value);
//     })

//     // BlockchainManager.watchTokenTransfers({fromBlock: blockNumber}).then( event => {
//     //     console.log(event);
//     //     console.log('ReturnValues from:', event.returnValues.from);
//     //     console.log('ReturnValues to:', event.returnValues.to);
//     //     console.log('ReturnValues value:', event.returnValues.value);
//     // })

// }).catch(err => console.error('===-===>', err))


    // blockchainManager.tokenTransfers({fromBlock: 6739960}, (err, event) => {
    //     console.log(event);
    //     console.log('ReturnValues from:', event.returnValues.from);
    //     console.log('ReturnValues to:', event.returnValues.to);
    //     console.log('ReturnValues value:', event.returnValues.value);
    // })

// Confirm.getLastBlockNumber()
//     .then(lastBlockNumber => {
//         console.log('last block number:', lastBlockNumber)
//         transfers.getLastPastEventBlockNumber()
//          .then(blockNumber => {
//             console.log('Last past event blockNumber', blockNumber)
//             // const blockNumber =  number[0].block ? number[0].block : 0
//             const fromBlock = parseInt(blockNumber / 1000) * 1000
//             const newOptions = Object.assign(options, {'fromBlock': fromBlock, 'toBlock': fromBlock + 500})
//             //watcher.tokenPastEvents(newOptions,  lastBlockNumber)
//             // watcher.watchTokenTransfers({fromBlock: blockNumber })

//             blockchainManager.tokenTransfers({fromBlock: blockNumber}, (err, event) => {
//                 console.log(event);
//                 console.log('ReturnValues from:', event.returnValues.from);
//                 console.log('ReturnValues to:', event.returnValues.to);
//                 console.log('ReturnValues value:', event.returnValues.value);
//             })

//             // BlockchainManager.watchTokenTransfers({fromBlock: blockNumber}).then( event => {
//             //     console.log(event);
//             //     console.log('ReturnValues from:', event.returnValues.from);
//             //     console.log('ReturnValues to:', event.returnValues.to);
//             //     console.log('ReturnValues value:', event.returnValues.value);
//             // })

//         }).catch(err => console.error('===-===>', err))
//     }).catch(err => console.error('===--===>', err))

