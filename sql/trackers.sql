

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
    //       '0x0000000000000000000000001c212abaee7d405397b3fe4b7f1dfe8e4a96b01f' ] }
    // }

CREATE TABLE IF NOT EXISTS `transfers_v1` (
  `id` varchar(10) NOT NULL COMMENT 'ID transfer event返回数据中的id  ',
  `blockNumber` bigint(20) NOT NULL DEFAULT '0',
  `transactionHash` varchar(128) NOT NULL,
  `transactionIndex` int  DEFAULT NULL ,
  `blockHash` varchar(128) NOT NULL,
  `logIndex` int NULL DEFAULT NULL,
  `removed` boolean DEFAULT '0',
  `event` varchar(32) NOT NULL,
  `signature` varchar(128) DEFAULT NULL,
  `raw` varchar(256) DEFAULT NULL,
  `addressFrom` varchar(64) DEFAULT NULL,
  `addressTo` varchar(64) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `transfers` (
  `id` varchar(20) NOT NULL COMMENT 'ID transfer event返回数据中的id  ',
  `blockNumber` bigint(20) NOT NULL DEFAULT '0',
  `transactionHash` varchar(128) NOT NULL,
  `blockHash` varchar(128) NOT NULL,
  `event` varchar(32) NOT NULL,
  `addressFrom` varchar(64) DEFAULT NULL,
  `addressTo` varchar(64) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;