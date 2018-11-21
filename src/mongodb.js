const MongoClient = require('mongodb').MongoClient

const url = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost:27017'
const databaseName = process.env.MONGODB_DATABASENAME ? process.env.MONGODB_DATABASENAME : 'web3j-tracker'

async function saveTransfer(transfer) {
    save("Transfers", transfer)
}

async function save(collectionName, obj) {
    MongoClient.connect(url, { useNewUrlParser: true } , function(err, client) {
        client.db(databaseName).collection(collectionName).insertOne({...obj} ,function(err, result) {
            if (err) throw err;
            console.log(result.name)
        })
        client.close()
    })
}

async function getLastPastEventBlockNumber(collectionName) {
    MongoClient.connect(url, { useNewUrlParser: true } , function(err, client) {
        client.db(databaseName).collection(collectionName).findOne({...obj} ,function(err, result) {
            if (err) throw err;
            console.log(result.name)
        })
        client.close()
    }) 
}

module.exports = {
    save,
    saveTransfer
}