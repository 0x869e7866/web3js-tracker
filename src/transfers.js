const MongoDB = require('./mongodb')
const trackers = require('./mysql')

let transfersManager = null
class TransferManager {
  constructor() {
    transfersManager = transfersManager || this
    return transfersManager
  }

  save(evt, block) {
    let sql = 'INSERT INTO ?? (id, blockNumber, transactionHash, blockHash, event, addressFrom, addressTo, amount, created) VALUES (?,?,?,?,?,?,?,?,?)'
    return trackers.query(sql, ['transfers', evt.id, evt.blockNumber, evt.transactionHash, evt.blockHash, evt.event, evt.returnValues.from, evt.returnValues.to, evt.returnValues.value, block.timestamp])
      .then(result => { return result })
      .catch(error => { return new Error(`{action: saveTransfer, code: ${error.code}, sqlState: ${error.sqlState}, sqlMessage: ${error.sqlMessage}}`) })
  }

  insertOrUpdate(evt, block) {
    let sql = 'REPLACE INTO ?? (id, blockNumber, transactionHash, blockHash, event, addressFrom, addressTo, amount, created) VALUES (?,?,?,?,?,?,?,?,?)'
    return trackers.query(sql, ['transfers', evt.id, evt.blockNumber, evt.transactionHash, evt.blockHash, evt.event, evt.returnValues.from, evt.returnValues.to, evt.returnValues.value, block.timestamp])
      .then(result => { return result })
      .catch(error => { return new Error(`{action: insertTransfer, code: ${error.code}, sqlState: ${error.sqlState}, sqlMessage: ${error.sqlMessage}}`) })
  }

  saveTransfers(events) {
    var items = []
    for(var i = 0; i < events.length; i ++) {
      let evt = events[i]
      items[i] =  [evt.id, evt.blockNumber, evt.transactionHash, evt.blockHash, evt.event, evt.returnValues.from, evt.returnValues.to, evt.returnValues.value]
    }
    trackers.query('INSERT INTO ?? (id, blockNumber, transactionHash, blockHash, event, addressFrom, addressTo, amount) VALUES ?', ['transfers', items])
      .then(result => { return result })
      .catch(error => { return new Error(`{action: saveTransfers, code: ${err.code}, sqlState: ${err.sqlState}, sqlMessage: ${err.sqlMessage}}`) })
  }


  updateTransferTime(blockNumber, timestamp) {
     return trackers.query('UPDATE ?? SET created=? WHERE blockNumber=?', ['transfers', timestamp, blockNumber])
      .then(result => { return result })
      .catch(error => { return new Error(`{action: updateTransferTime, code: ${error.code}, sqlState: ${error.sqlState}, sqlMessage: ${error.sqlMessage}}`) })
  }

  getLastPastEventBlockNumber() {
    return trackers.query('SELECT MAX(blockNumber) as block FROM transfers')
      .then(result => { return result[0].block ? result[0].block : 0 })
      .catch(error => { return new Error(`{action: getLastPastEventBlockNumber, code: ${error.code}, sqlState: ${error.sqlState}, sqlMessage: ${error.sqlMessage}}`) })
  }
}

transfersManager = new TransferManager()
module.exports = transfersManager


