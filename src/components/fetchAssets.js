import Moralis from "moralis";



function fetchAssets(wallet_id,currentEthPrice,setFetchStatus){
  return new Promise((resolve,reject)=>{
    
    var ALL_ASSETS = [];
    var WALLET_STATS = [];

    var ETH_PRICE = currentEthPrice;
    var walletAssets = [];
    var soldAssets = [];
    var walletID = wallet_id;
    var moralisAPIKey = '0x5010EBae2C4d0B300A754AEF5A9d0f739198ec65';
    var nftTransactions = [];
    var block_timestamps = [];
    var transaction_hashs = [[],[]];
    var erc20Transactions = [];
    var allTransactions = [];
    var tokenData = [];
    var walletData = [];
    var openseaUsername = ''
    var openseaProPic = ''
    const EtherDivNum = 1000000000000000000;
    const BLACKLIST_COLLECTIONS = ['Foundation (FND)','Rarible','ENS: Ethereum Name Service','SuperRare','KnownOrigin','Uniswap V3 Positions'];
    const AcceptedSymbols = ['WETH','ETH']
    
    ///// ********* MAIN FUNCTION **********

    // Pull active wallet holdings
    console.log('pullWalletAssets');
    pullWalletAssets(walletID).then((res)=>{
      walletData = res[0];
      erc20Transactions = res[1];
      allTransactions = res[2];
      nftTransactions = res[3];
      console.log('sortWalletAssets');
      setFetchStatus('Sorting pulled Data')
      walletAssets = sortWalletAssets(walletData);
      
      console.log('updateWallets');
      updateWallets().then(()=>{
        
        console.log('updateTransactionQuantity');
        updateTransactionQuantity();
        
        console.log('updateEtherPrices');
        setFetchStatus('Getting historic Eth prices');
        updateEtherPrices().then(()=>{
          
          setFetchStatus('Updating floor prices');
          updateFloorPrices().then(()=>{
            addAdditionalProps();
            getWalletStats();

            /// ****** RETURN *********
            console.log('returning!');
            resolve([ALL_ASSETS,WALLET_STATS])
          })

        })

        
      })
      
    })
    
  
    
    class Asset {
      constructor(floor_price,tokenFullID,contract_type,collection_name,collection_slug,asset_name,asset_thumbnail,asset_permalink,position,purchase_price,sell_price,purchase_time,sell_time,purchase_transaction_hash,sell_transaction_hash,purchase_etherPrice,sell_etherPrice,transactionQuantity,transactionType) {
        this.floor_price = floor_price;
        this.tokenFullID = tokenFullID;
        this.contract_type = contract_type;
        this.collection_name = collection_name;
        this.collection_slug = collection_slug;
        this.asset_name = asset_name;
        this.asset_thumbnail = asset_thumbnail;
        this.asset_permalink = asset_permalink;
        this.position = position;
        this.purchase_price = purchase_price;
        this.sell_price = sell_price;
        this.purchase_time = purchase_time;
        this.sell_time = sell_time;
        this.purchase_transaction_hash = purchase_transaction_hash;
        this.sell_transaction_hash = sell_transaction_hash;
        this.purchase_etherPrice = purchase_etherPrice;
        this.sell_etherPrice = sell_etherPrice;
        this.transactionQuantity = transactionQuantity;
        this.transactionType = transactionType;
      }
    }
    
    async function pullWalletAssets(walletID) {
      
      
      // var walletData = []
      // var currentOffset = 0;
      // var pullData = true;
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      // setFetchStatus('Pulling Active NFTs');
      // while(pullData){
      //   const options = {
      //     method: 'GET',
      //     headers: {
      //       'X-API-KEY': '13251e61da9545b6a58085a79f394144',
      //       'Accept': 'application/json',
      //     },
      //   };
      //   var response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${walletID}&order_direction=desc&offset=${currentOffset}&limit=50`, options);
      //   var responseParsed = await response.json();
      //   if(responseParsed.assets.length <= 1){
      //     pullData = false;
      //   }else{
      //     walletData = walletData.concat(responseParsed.assets);
      //     currentOffset += 50;
      //     await sleep(600);
      //   }
      // }
      const params = {
        address: walletID,
      };
      const walletData = await Moralis.Cloud.run("pullOpenSeaAssets",params);
      if(!walletData){
        return false;
      };

      setFetchStatus('Pulling NFT transactions');
      console.log('Pulling nft transactions')
      // Pull all NFT transactions - used for seeing previous purchases
      var currentOffset = 0;
      var pullData = true;
      var nftTransactions = [];
      while(pullData){
        const nftOptions = { chain: "Eth", address: walletID, offset : currentOffset};
        var nftTransactionsRes = await Moralis.Web3API.account.getNFTTransfers(nftOptions);
        if(nftTransactionsRes.result.length < 1){
          pullData = false;
        }else{
          nftTransactions = nftTransactions.concat(nftTransactionsRes.result);
          currentOffset += 500;
          await sleep(600);
        }
      }
      
      setFetchStatus('Pulling ERC20 transactions');
      console.log('Pulling erc20 transactions')
      // Pull all erc20 transactions - used for seeing if purchase was payed for in something other than eth
      var currentOffset = 0;
      var pullData = true;
      var erc20Transactions = [];
      while(pullData){
        const erc20Options = { chain: "Eth", address: walletID, offset : currentOffset, limit : 500};
        var erc20TransactionsRes = await Moralis.Web3API.account.getTokenTransfers(erc20Options);
        if(erc20TransactionsRes.result.length < 2){
          pullData = false;
        }else{
          erc20Transactions = erc20Transactions.concat(erc20TransactionsRes.result);
          currentOffset += 500;
          await sleep(600);
        }
      }
      
      
      setFetchStatus('Pulling all transactions');
      console.log('Pulling all transactions')
      // Pull all transactions - used for connecting burned pieces and for transaction that took 2 to mint
      var currentOffset = 0;
      var pullData = true;
      var all_transactions = [];
      while(pullData){
        const options = { chain: "Eth", address: walletID, offset : currentOffset, limit : 500};
        const transactions = await Moralis.Web3API.account.getTransactions(options)
        if(transactions.result.length < 2){
          pullData = false;
        }else{
          all_transactions = all_transactions.concat(transactions.result);
          currentOffset += 500;
          await sleep(600);
        }
      }

      allTransactions = all_transactions;
  
      return([walletData,erc20Transactions,allTransactions,nftTransactions])
  
    }
  
  
    function sortWalletAssets(walletData){
      var sortedData = [];
      for(var i = 0; walletData.length > i; i++){
        var tokenID = walletData[i].token_id;
        var tokenAddress = walletData[i].asset_contract.address;
        
        var tokenFullID = tokenAddress+'/'+tokenID;
        var contract_type = walletData[i].asset_contract.schema_name;
        var collection_name = walletData[i].collection.name;
        var collection_slug = walletData[i].collection.slug;
        var asset_name = walletData[i].name == null ? tokenID : walletData[i].name;
        var asset_thumbnail = walletData[i].image_thumbnail_url;
        var asset_permalink = walletData[i].permalink;
        var position = 'open';
  
        // Find floor_price if erc1155
        var floor_price = '';
        if(contract_type == 'ERC1155'){
          floor_price = walletData[i].sell_orders ? walletData[i].sell_orders[0].current_price/EtherDivNum: '';
          if(floor_price === '' && walletData[i].last_sale){
            var tokenIsAccepted = false;
            var symbol = walletData[i].last_sale.payment_token.symbol;
            AcceptedSymbols.map(type => symbol == type ? tokenIsAccepted = true: tokenIsAccepted =false);
            if(tokenIsAccepted) floor_price = walletData[i].last_sale.total_price/EtherDivNum;
          }
        }else if(openseaUsername == ''){
          openseaUsername = walletData[i].owner.user.username;
          openseaProPic = walletData[i].owner.profile_img_url;
        }
  
        // console.log(asset_name);
        // console.log(contract_type == 'ERC1155' ? walletData[i].sell_orders ? walletData[i].sell_orders : '' : '');
  
        if(!checkBlacklist(collection_name)){
          // If not blacklisted, push asset to walletAssets
          var newAsset = new Asset(floor_price,tokenFullID,contract_type,collection_name,collection_slug,asset_name,asset_thumbnail,asset_permalink,position);
          sortedData.push(newAsset)
        }
      }
  
      return sortedData;
    }
  
    async function updateWallets(){
      var ImportedNFTNum = 0;

      for(var i = 0; i<nftTransactions.length;i++){
        var type = nftTransactions[i].contract_type;
        var beginTime = new Date();
        if(type == 'ERC721' || type == 'ERC1155'){
          var soldAsset = nftTransactions[i].from_address == walletID.toLowerCase();
          var transactionValue = await getTransactionValue(nftTransactions[i],i,false,soldAsset);
          if(!soldAsset){
            // Insert transaction data retrieved from Moralis
            // console.log(transactionValue[1])
            insertAssetData(nftTransactions[i],i,transactionValue, beginTime);
            ImportedNFTNum ++;
            setFetchStatus('Importing NFT #'+ImportedNFTNum);
          }else{
            // Import any transactions that were sold
            await importSoldAssets(nftTransactions[i],i,transactionValue, beginTime);
            ImportedNFTNum ++;
            setFetchStatus('Importing NFT #'+ImportedNFTNum);
          }
        }
      }
    }
  
    async function getTransactionValue(transaction,i,incomingSoldPurchase,secondSold){
      var TransactionType = secondSold ? 'Sell - Eth' : 'Purchase - Eth';
  
      if(transaction.value == '0'){
        const TimeAtributionThreshold = 10;
        var TransactionValue = 0;
  
        // Find if there has been an associated erc20 transaction
        var transactionHash = transaction.transaction_hash;
        var erc20TransactionValue = erc20Transactions.filter( txn => {
          return txn.transaction_hash === transactionHash; 
        });
        // If there has been one, pull it. Else return 0
        if(erc20TransactionValue.length > 0){
          var matchingToken = tokenData.filter(token =>{
            return erc20TransactionValue[0].address === token.address;
          })

          var symbol = matchingToken.length < 1 ?  await pullERC20Data(erc20TransactionValue[0].address) : matchingToken[0].symbol;
          // console.log(symbol);
          // console.log(matchingToken);
          var tokenIsAccepted = false;
          // console.log(symbol);
          AcceptedSymbols.map(type => symbol == type ? tokenIsAccepted = true: '');
          TransactionValue = tokenIsAccepted ? parseInt(erc20TransactionValue[0].value) : erc20TransactionValue[0].value.toString() + symbol;
          TransactionType = secondSold ? 'Sell - '+symbol : 'Purchase -'+symbol;
        }else{
          var burned = false;
          // If purchase transaction matches sold transaction - Ex: Someone burned an NFT for another
          if(transaction.to_address.toLowerCase() == walletID.toLowerCase() && nftTransactions.length>i+1){
            var previousTransaction = nftTransactions[i+1];
            var previousTransactionHash = previousTransaction.transaction_hash;
            if(previousTransactionHash == transactionHash && previousTransaction.to_address.toLowerCase() !== walletID.toLowerCase()){
              // console.log(previousTransactionHash);
              var previousTransactionID = previousTransaction.token_address+'/'+previousTransaction.token_id;
              var matchedTxn = nftTransactions.filter( txn => {
                return previousTransactionID === txn.token_address+'/'+txn.token_id && txn.transaction_hash !== transactionHash; 
              });
              if(matchedTxn.length > 0) {
                if(transactionHash === '0x9f4597d824afaed6b6e13faa13bee28ac61b2cb1fc0608dabc2f007773c4150c' && incomingSoldPurchase) console.log('matchedTxn'+matchedTxn[0].value)
                nftTransactions[i+1].value = parseInt(matchedTxn[0].value);
                nftTransactions[i+1].transactionType = 'Burned';
                TransactionType = 'From burn';
                console.log(TransactionType);
                TransactionValue = parseInt(matchedTxn[0].value);
                burned = true;
              } 
            }
          }
          
          // find if there was a previous non erc20 transaction with same address - ex - Someone payed for mint and then mint happened in a differnt transaction
          if(transaction.from_address.toLowerCase() !== walletID.toLowerCase() && !burned){
  
            // Find Block Hash transaction
            var matchingAllTxn = allTransactions.filter( txn => {
              return txn.block_hash === transaction.block_hash; 
            });
            var matchedToAddress = matchingAllTxn[0] != undefined ? matchingAllTxn[0].to_address : 0;
            // Find transactions with same to_address
            var matchingTxns = allTransactions.filter( txn => {
              return txn.to_address === matchedToAddress; 
            });
  
            // Find other transactions to this add
            // Loop through All transactions
            for(var j = 0;j<matchingTxns.length;j++){
              var block_timestamp = new Date(matchingTxns[j].block_timestamp);
              var erc20_block_timestamp = new Date(transaction.block_timestamp);
              if(erc20_block_timestamp.getTime()-TimeAtributionThreshold < block_timestamp.getTime() < erc20_block_timestamp.getTime() ){
                
                // console.log(matchingTxns[j].value+'   '+matchingTxns[j].to_address+'  '+matchingTxns[j].block_hash);
                TransactionValue = matchingTxns[j].value != 0 ? parseInt(matchingTxns[j].value) : 0;
                TransactionType = 'Seperate transaction'
              }
              if(block_timestamp.getTime()-TimeAtributionThreshold > block_timestamp.getTime()) break;
            }
  
            
          }
        }
        return [TransactionValue,(nftTransactions[i].transactionType !== undefined ? nftTransactions[i].transactionType : TransactionType)];
        
      }else return [parseInt(transaction.value),TransactionType];
    }

    async function pullERC20Data(address){
      console.log(address);
      const options = { addresses: address};
      const token = await Moralis.Web3API.token.getTokenMetadata(options);
      tokenData.push(token[0]);
      return token[0].symbol;
    }
  
    function insertAssetData(transaction,i,transactionValue){
      var token_address = transaction.token_address;
      var token_id = transaction.token_id;
      var transaction_assetID = token_address + '/' + token_id;
  
      // Loop through all assets
      for(var j = 0; j<walletAssets.length; j++){
        var assetID = walletAssets[j].tokenFullID;
        // Check to see if transaction = current loop transaction and is purchase
        if(transaction_assetID==assetID && transaction.to_address==walletID.toLowerCase()){
  
          walletAssets[j].purchase_price = transactionValue[0];
          walletAssets[j].transactionType = transactionValue[1];
          walletAssets[j].purchase_transaction_hash = transaction.transaction_hash;
          walletAssets[j].purchase_time = transaction.block_timestamp;
          walletAssets[j].contract_type = transaction.contract_type;
          block_timestamps.push(transaction.block_timestamp);
          transaction_hashs[0].push(transaction.transaction_hash);
            
        }
      }
  
      // console.log(transactionQuantity)
    }
  
    async function importSoldAssets(transaction,i,transactionValue,beginTime){
      var id = transaction.token_address + '/' + transaction.token_id;
  
      // Find purchase txn
      for(var j = i; j<nftTransactions.length;j++){
        var current_id = nftTransactions[j].token_address + '/' + nftTransactions[j].token_id;
        var soldCurrentAsset = nftTransactions[j].to_address == walletID.toLowerCase();
        var imported = nftTransactions[j].imported === true;
        if(id == current_id && soldCurrentAsset && !imported){
  
          // Found purchase txn, create new sold asset
          var tokenData = await getDatafromToken(transaction.token_address,transaction.token_id);
          // console.log(tokenData)
  
          // Assign new asset properties
          var contract_type = transaction.contract_type;
          var collection_name = tokenData ? tokenData.collection.name : '';
          var collection_slug = tokenData ? tokenData.collection.slug: '';
          var asset_name = tokenData ? tokenData.name: ''; 
          var asset_thumbnail = tokenData ? tokenData.image_thumbnail_url: '';
          var asset_permalink = tokenData ? tokenData.permalink : '';
          var position = 'closed';
          var transactionType = nftTransactions[i].transactionType !== undefined ? nftTransactions[i].transactionType : transactionValue[1];
          var purchase_price = await getTransactionValue(nftTransactions[j],j,true);
          // console.log(purchase_price)
          var sell_price = transactionValue[0]/EtherDivNum;
          var purchase_time = nftTransactions[j].block_timestamp;
          var sell_time = transaction.block_timestamp;
          var purchase_transaction_hash = nftTransactions[j].transaction_hash;
          var sell_transaction_hash = transaction.transaction_hash;
          // console.log(transactionType);
  
          block_timestamps.push(purchase_time,sell_time);
          if(!checkBlacklist(collection_name)){
            var newAsset = new Asset('',id,contract_type,collection_name,collection_slug,asset_name,asset_thumbnail,asset_permalink,position,purchase_price[0],sell_price,purchase_time,sell_time,purchase_transaction_hash,sell_transaction_hash,null,null,null,transactionType)
            transaction_hashs[0].push(purchase_transaction_hash);
            transaction_hashs[1].push(sell_transaction_hash);
            nftTransactions[j].imported = true;
            soldAssets.push(newAsset);
            break
          }
  
          break
          
        }
      }
  
    }
  
    function updateTransactionQuantity(){
  
      // Update walletAssets with correct txn quantity
      for(var i= 0;i<walletAssets.length;i++){
        var transactionHash = walletAssets[i].purchase_transaction_hash;
  
        var transactionQuantity = transaction_hashs[0].filter( txn => {
          return txn === transactionHash; 
        }).length;
  
        walletAssets[i].transactionQuantity = transactionQuantity;
        if(typeof walletAssets[i].purchase_price === 'string'){
          var value = (parseInt(walletAssets[i].purchase_price.replace(/\D/g,''))/transactionQuantity)/EtherDivNum;
          var tokenSymbol = ' $'+walletAssets[i].purchase_price.replace(/[0-9]/g, '')
          walletAssets[i].purchase_price = value+tokenSymbol
        }else{
          walletAssets[i].purchase_price = (walletAssets[i].purchase_price/transactionQuantity)/EtherDivNum;
  
        }
        // console.log(walletAssets[i].collection_name+'    '+transactionQuantity+'    '+walletAssets[i].purchase_transaction_hash+'    '+walletAssets[i].purchase_price);
      }
  
      // Update soldAssets with correct txn quantity
      for(var i= 0;i<soldAssets.length;i++){
        var transactionHash = soldAssets[i].purchase_transaction_hash;
  
        var transactionQuantity = transaction_hashs[0].filter( txn => {
          return txn === transactionHash; 
        }).length;
  
        soldAssets[i].transactionQuantity = transactionQuantity;
        if(typeof soldAssets[i].purchase_price === 'string'){
          var value = (parseInt(soldAssets[i].purchase_price.replace(/\D/g,''))/transactionQuantity)/EtherDivNum;
          var tokenSymbol = ' $'+soldAssets[i].purchase_price.replace(/[0-9]/g, '')
          soldAssets[i].purchase_price = value+tokenSymbol;
        }else{
          soldAssets[i].purchase_price = (soldAssets[i].purchase_price/transactionQuantity)/EtherDivNum;
        }
  
  
        // console.log(soldAssets[i].collection_name+'    '+transactionQuantity+'    '+soldAssets[i].purchase_transaction_hash+'    '+soldAssets[i].purchase_price);
      }
  
    }
  
    async function updateEtherPrices(){
      var FetchedEtherPrices;
  
      // Sort by date range
      block_timestamps.sort((a,b) => {
        return new Date(a) - new Date(b)
      })
  
      var startEpoch = new Date(block_timestamps[0]);
      startEpoch = startEpoch.getTime().toString().slice(0,-3);
      var endEpoch = new Date(block_timestamps[block_timestamps.length-1])
      endEpoch = endEpoch.getTime().toString().slice(0,-3);
      console.log(startEpoch+'   '+endEpoch+'  '+block_timestamps[block_timestamps.length-1]);
    
      const options = {method: 'GET'};
      const response = await fetch(`https://poloniex.com/public?command=returnChartData&currencyPair=USDT_ETH&start=${startEpoch}&end=${endEpoch}&period=7200`, options)
      var responseData = await response.json();
  
      FetchedEtherPrices = responseData;
      // console.log(FetchedEtherPrices)
  
      // Find and update Wallet Assets
      for(var i = 0; i<walletAssets.length;i++){
        var purchaseTimestamp = walletAssets[i].purchase_time;
        var closestPurchasePrice = findEtherPriceFromTime(purchaseTimestamp,FetchedEtherPrices);
        walletAssets[i].purchase_etherPrice = closestPurchasePrice;
      }
      // Find and update Sold Assets
      for(var i = 0; i<soldAssets.length;i++){
        var purchaseTimestamp = soldAssets[i].purchase_time;
        var closestPurchasePrice = findEtherPriceFromTime(purchaseTimestamp,FetchedEtherPrices);
        soldAssets[i].purchase_etherPrice = closestPurchasePrice;
        var sellTimestamp = soldAssets[i].sell_time;
        var closestSellPrice = findEtherPriceFromTime(sellTimestamp,FetchedEtherPrices);
        soldAssets[i].sell_etherPrice = closestSellPrice;
      }
  
  
    }
  
    function findEtherPriceFromTime(timestamp,fetchedEtherPrices){
      var searchDate = new Date(timestamp);
      var searchEpoch = searchDate.getTime().toString().slice(0,-3);
      var closestPrice = closest(searchEpoch,fetchedEtherPrices);
  
      // console.log(searchEpoch)
      // console.log(closestPrice)
  
      // var closestPrice = fetchedEtherPrices.reduce(function(a, b){
      //   return Math.abs(b.date - searchEpoch) < Math.abs(a.date - searchEpoch) ? b.weightedAverage : a.weightedAverage;
      // });
      // const findClosest = (arr,num) => {
      //   return arr.sort((a,b) => Math.abs(b - num) - Math.abs(a-num)).pop();
      // }
  
      
      return closestPrice
    }
  
    async function updateFloorPrices(){
  
      // Update Wallet Assets, only if erc721 token. ERC1155 fetched when assets were pulled from opensea
      // var floorData = [];
      // var currentOffset = 0;
      // var pullData = true;
      // while(pullData){
      //   const options = {method: 'GET'};
      //   const response = await fetch(`https://api.opensea.io/api/v1/collections?asset_owner=${walletID}&offset=${currentOffset}&limit=50`, options);
      //   var responseData = await response.json();

      //   if(responseData.length <= 1){
      //     pullData = false;
      //   }else{
      //     for(var i = 0;i<responseData.length;i++){
      //       var floorObj = { collection_slug : responseData[i].slug, floor_price : responseData[i].stats.one_day_average_price}
      //       floorData.push(floorObj);
      //     }
      //     currentOffset += 50;
      //   }
      // }
      const params = {
        address: walletID,
      };
      const floorData = await Moralis.Cloud.run("pullOpenSeaCollections",params);
      
      // Actually update walletAsset floor prices
      console.log(floorData);
      for(var i=0; i<walletAssets.length;i++){
        if(walletAssets[i].floor_price === ''){
          var price = floorData.filter( data => {
            return data.slug === walletAssets[i].collection_slug; 
          });
          walletAssets[i].floor_price = price.length > 0 ? price[0].stats.one_day_average_price : 'Nan';
        } 
      }
  
      // Update sold assets
  
      for(var i=0; i<soldAssets.length;i++){
        // soldAssets[i].floor_price = '=ImportJSON("https://api.opensea.io/collection/"&$E24,"/collection/stats/floor_price","noHeaders")*1'
      }
  
    }

    function addAdditionalProps(){

    ALL_ASSETS = walletAssets.concat(soldAssets);
      for(var i=0;i<ALL_ASSETS.length;i++){
        var asset = ALL_ASSETS[i]
        ALL_ASSETS[i].roiPercent = asset.position == 'open' ? asset.purchase_price !== 0 || asset.floor_price !== 0 ? asset.floor_price/asset.purchase_price : 1 : asset.sell_price/asset.purchase_price;
        ALL_ASSETS[i].roiEth = asset.position == 'open' ? asset.floor_price-asset.purchase_price : asset.sell_price-asset.purchase_price;
        ALL_ASSETS[i].roiDollar = asset.position == 'open' ? asset.floor_price*ETH_PRICE-asset.purchase_price*ETH_PRICE : asset.sell_price*ETH_PRICE-asset.purchase_price*ETH_PRICE;
        ALL_ASSETS[i].roiHist = asset.position == 'open' ? asset.purchase_price !== 0 ? (asset.floor_price*ETH_PRICE)-(asset.purchase_price*asset.purchase_etherPrice):asset.floor_price*ETH_PRICE : asset.purchase_price !== 0 ? (asset.sell_price*asset.sell_etherPrice)-(asset.purchase_price*asset.purchase_etherPrice):asset.purchase_price*asset.purchase_etherPrice;
      }

      function correctNumber(){
        
      }
    }

    function getWalletStats(){
      WALLET_STATS = {
        historical_quantity: soldAssets.length,
        active_quantity: walletAssets.length,
        first_transaction: ALL_ASSETS[ALL_ASSETS.length-1].purchase_time,
        opensea_username: openseaUsername,
        opensea_pro_pic: openseaProPic,
      }
    }
  
  
    // Helper Functions
  
    async function getDatafromToken(token_address,token_id){
      const params = {
        token_address: token_address,
        token_id: token_id,
      };
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await sleep(300);
      const walletData = await Moralis.Cloud.run("pullAssetData",params);
      if(!walletData){
        return false;
      };
      if(walletData.data.assets.length > 0){
        return walletData.data.assets[0];
      }else return false
    }
  
    function checkBlacklist(name){
      var blacklisted = false;
      for(var b = 0; b<BLACKLIST_COLLECTIONS.length;b++){
        if(name == BLACKLIST_COLLECTIONS[b]) blacklisted = true;
      }
      return blacklisted;
    }
  
    function closest (num, arr) {
      var curr = parseInt(arr[0].date);
      var price;
      var diff = Math.abs (num - curr);
      for (var val = 0; val < arr.length; val++) {
          var newdiff = Math.abs (num - arr[val].date);
          if (newdiff <= diff) {
              diff = newdiff;
              curr = parseInt(arr[val].date);
              price = arr[val].weightedAverage;
          }
      }
      return price;
    }

    async function pullAPIData(type,offset,string){
      var returnArray = [];

      
      var currentOffset = 0;
      var pullData = true;
      while(pullData){
        if(type === 'getTokenMetadata'){
          const options = { addresses: string};// TODO fix string to address
          var responseParsed = await Moralis.Web3API.token.getTokenMetadata(options);
          returnArray = returnArray.concat(responseParsed);
        }
        if(type === 'getNFTTransfers'){
          const options = { chain: "Eth", address: walletID, offset : currentOffset, limit : 500};
          var responseParsed = await Moralis.Web3API.account.getNFTTransfers(options);
          if(responseParsed.length <= 1){
            pullData = false;
          }else{
            currentOffset += 500;
            returnArray = returnArray.concat(responseParsed);
          }
        }
        if(type === 'getTokenTransfers'){
          const options = { chain: "Eth", address: walletID, offset : currentOffset, limit : 500}
          var responseParsed = await Moralis.Web3API.account.getTokenTransfers(options);
          returnArray = returnArray.concat(responseParsed);
        }
        if(type === 'getTransactions'){
          const options = { chain: "Eth", address: walletID, offset : currentOffset, limit : 500}
          var responseParsed = await Moralis.Web3API.account.getTransactions(options).assets;
          returnArray = returnArray.concat(responseParsed);
        }
        if(type === 'opensea'){
          const options = {method: 'GET'};
          var response = await fetch(`${string}&order_direction=desc&offset=${currentOffset}&limit=50`, options);
          var responseParsed = await response.json();
          if(!offset) pullData=false;
          if(responseParsed.assets.length <= 1){
            pullData = false;
          }else{
            returnArray = returnArray.concat(responseParsed);
            currentOffset += 50;
          }
        }
        if(type === 'openseaCollections'){
          const options = {method: 'GET'};
          var response = await fetch(`${string}&order_direction=desc&offset=${currentOffset}&limit=50`, options);
          var responseParsed = await response.json();
          if(!offset) pullData=false;
          if(responseParsed.assets.length <= 1){
            pullData = false;
          }else{
            returnArray = returnArray.concat(responseParsed);
            currentOffset += 50;
          }
        }
      }
      //       const token = await Moralis.Web3API.token.getTokenMetadata(options);
      //       // Pull all NFT transactions - used for seeing previous purchases
      //       const nftOptions = { chain: "Eth", address: walletID };
      //       var nftTransactionsRes = await Moralis.Web3API.account.getNFTTransfers(nftOptions);
            
      //       // Pull all erc20 transactions - used for seeing if purchase was payed for in something other than eth
      //       const erc20Options = { chain: "Eth", address: walletID };
      //       var erc20TransactionsRes = await Moralis.Web3API.account.getTokenTransfers(erc20Options);
        
      //       // Pull all transactions - used for connecting burned pieces and for transaction that took 2 to mint
      //       const allOptions = { chain: "Eth", address: walletID, order: "desc" };
      //       const transactions = await Moralis.Web3API.account.getTransactions(allOptions)
      // (`https://api.opensea.io/api/v1/collections?asset_owner=${walletID}&offset=${currentOffset}&limit=50`, options);
      // (`https://api.opensea.io/api/v1/assets?owner=${walletID}&order_direction=desc&offset=${currentOffset}&limit=50`, options)
      // (`https://api.opensea.io/api/v1/assets?token_ids=${token_id}&asset_contract_address=${token_address}&order_direction=desc&offset=0&limit=50`, options);


      return returnArray;
    }

  // end of promise
  })



}

export {fetchAssets}


    






















