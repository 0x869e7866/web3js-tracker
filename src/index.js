require('./env')

const trackers = require('./mysql')
const watcher = require('./watcher')
const Confirm = require('./confirm')

// watcher.watchEtherTransfers()
// console.log('Started watching Ether transfers')

// watcher.watchTokenTransfers()
// console.log('Started watching Pluton token transfers\n')

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

Confirm.getLastBlockNumber()
    .then(lastBlockNumber => {
        console.log('last block number:', lastBlockNumber)
        trackers.getLastPastEventBlockNumber()
         .then(number => {
            console.log('Last past event blockNumber', number[0].block)
            const blockNumber =  number[0].block ? number[0].block : 0
            const fromBlock = parseInt(blockNumber / 1000) * 1000
            const newOptions = Object.assign(options, {'fromBlock': fromBlock, 'toBlock': fromBlock + 500})
            //watcher.tokenPastEvents(newOptions,  lastBlockNumber)
            watcher.watchTokenTransfers({fromBlock: blockNumber })
        }).catch(err => console.error('===-===>', err))
    }).catch(err => console.error('===--===>', err))

// watcher.watchTokenTransfers({fromBlock: 6690142})

// trackers.getLastPastEventBlockNumber()
//     .then(number => {
//        const blockNumber = number[0].block ? number[0].block + 1  : 0
//        watcher.watchTokenTransfers({fromBlock: blockNumber})
//     })
//     .catch(err => console.error('getLastPastEventBlockNumber', err))

// SELECT * FROM `transfers` WHERE `created` = 0;

// SELECT COUNT(*) FROM `transfers`;

// SELECT DISTINCT(blockNumber) as bl,created FROM `transfers` WHERE `created` != 0;

	
// UPDATE `transfers` INNER JOIN (SELECT DISTINCT(blockNumber) as bl,created FROM `transfers` WHERE `created` != 0) c ON c.bl = blockNumber SET transfers.`created` = c.`created`;
