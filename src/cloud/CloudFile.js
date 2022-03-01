
// ***** USER ACTIONS ******
////////////////////////////
Moralis.Cloud.define("adjustUserSettings", async (request) => {

    let email = request.params.email;
    let trackingMethods = request.params.trackingMethods;
    let user = request.user;
    const logger = Moralis.Cloud.getLogger();

    // logger.info(`User - ${user} Unsubscribed from ${address}`)
    
    // Add email
    var currentEmail = user.get("email");
    if(currentEmail !== email && email !== '') user.set("email",email);
    // Add Tracking methods
    user.set("trackingEmail",`${trackingMethods.email}`);
    try {
        await user.save(null, { useMasterKey: true });
    } catch (err) {
        logger.info(err);
    }
    return "Success?"
})
Moralis.Cloud.define("unwatchAddress", async (request) => {

    let address = request.params.address;
    let user = request.user;
    const logger = Moralis.Cloud.getLogger();

    const countQuery = new Moralis.Query("WatchedEthAddress");
    countQuery.equalTo("address", address);
    const watchedAddy = await countQuery.first();
    const watchedAddyFollowers = watchedAddy.get("followers");


    // If user is only follower, unwatch address
    if(watchedAddyFollowers.length === 1){
        
        const results = await Moralis.Cloud.run("unwatchEthAddress", {
            address: address,
        },{useMasterKey:true});

    }

    // Remove Address from this user object
    var currentTrackedWallets = user.get("watchedEthWallets");
    currentTrackedWallets.length == 1 ?user.set("watchedEthWallets",[]) : user.remove("watchedEthWallets",address);
    
    try {
        await user.save(null, { useMasterKey: true });
    } catch (err) {
        logger.info(err);
    }
    logger.info(`User - ${user} Unsubscribed from ${address}`)
    return "Success?"
})
Moralis.Cloud.define("watchAddress", async (request) => {
    
    const logger = Moralis.Cloud.getLogger();
  
    let address = request.params.address;
    let opensea_username = request.params.opensea_username;
    let user = request.user;

    let userId = user.id;
    
    // check 2/2: address is not already being watched
    const countQuery = new Moralis.Query("WatchedEthAddress");
    countQuery.equalTo("address", address);
    const watchCount = await countQuery.count();
    
    // Check if followedWallet has this user as a follower

    if (watchCount > 0) {
        var watchedEth_row_object = await countQuery.first();
        var followerArray = watchedEth_row_object.get("followers");
        logger.info('There is more than 0');
        
        // Check if already following
        var alreadyFollowing = false;
        for(var i = 0;i<followerArray.length;i++){
            if(followerArray[i] == userId){
                alreadyFollowing = true;
            }
        }
        if(alreadyFollowing) return "Already Following"
        else{
            // If follower is not already following
            // Set user object to follow address
            await addAddressToUser();
            followerArray.push(userId);
            watchedEth_row_object.set("followers",followerArray);
            // save it
            try {
                await row_object.save();
            } catch (err) {
                logger.info(err);
            }
        }
    }else{
        // If followed Wallet does not exist
        // add address to watch list
        // sync all txs in realtime to WatchedEthAddress class
        logger.info('There 0');
        await Moralis.Cloud.run("watchEthAddress", {
            address,
            sync_historical: false,
        },{useMasterKey:true});
        
        // check address has saved
        const query = new Moralis.Query("WatchedEthAddress");
        // get row of saved address
        query.equalTo("address", address);
        const row_object = await query.first();
        // logger.info(row_object);
        var singleFollowerArray = [userId];
        row_object.set("followers", singleFollowerArray);
        row_object.set("opensea_username", opensea_username);
        // save it
        try {
            await row_object.save();
            await addAddressToUser();
        } catch (err) {
            logger.info(err);
        }
    }
    return true;
    

    // Additional watch Functions
    async function addAddressToUser(){
        var watchedEthWallets = user.get("watchedEthWallets");

        user.addUnique("watchedEthWallets",address)

        // var newWatchedEthWallets = []
        // logger.info(watchedEthWallets);
        // if(watchedEthWallets && watchedEthWallets.length !== 1){
        //     logger.info('exist');
        //     newWatchedEthWallets.push(address)
        //     newWatchedEthWallets.push(watchedEthWallets)
        // }else{
        //     logger.info('Noexist');
        //     newWatchedEthWallets.push(address)
        // }
        // user.set("watchedEthWallets",newWatchedEthWallets)


        try {
            await user.save(null, { useMasterKey: true });
        } catch (err) {
            logger.info(err);
        }
    }

},{
    fields : {
      address : {
        required: true,
        type: String,
        options: val => {
          return true;
        },
        error: "Address must be less than 20 characters"
      },
    },
    requireUser: true
});

// ***** JOB ACTIONS ******
////////////////////////////
Moralis.Cloud.afterSave("EthNFTTransfers", async function (request) {
const confirmed = request.object.get("confirmed");
if(confirmed){
    let to_address = request.object.get("to_address");
    let from_address = request.object.get("from_address");
    let transaction_hash = request.object.get("transaction_hash");
    let token_id = request.object.get("token_id");
    let token_address = request.object.get("token_address");
    
    const countQuery = new Moralis.Query("WatchedEthAddress");
    countQuery.containedIn("address", [to_address,from_address]);
    const matchedAddresses = await countQuery.find();
    // Check to see if follower follows any of the match transaction addresses
    logger.info(matchedAddresses.length);
    for(var i = 0;i<matchedAddresses.length;i++){
        const followerArray = matchedAddresses[i].get("followers");
        const opensea_username = matchedAddresses[i].get("opensea_username");

        // Pull transaction data from OpenSea
        var watchedAddress = matchedAddresses[i].get("address");
        var purchaseType = from_address == watchedAddress ? 'sold' : 'bought';
        const fetchedData = await Moralis.Cloud.httpRequest({
            url: `https://api.opensea.io/api/v1/assets?token_ids=${token_id}&asset_contract_address=${token_address}&order_direction=desc&offset=0&limit=20`,
            headers: {
                'Accept': 'application/json',
                'X-API-KEY': '13251e61da9545b6a58085a79f394144'
            }
        })
        var nftData = fetchedData.data;
        var collection_name = nftData.assets[0].name;
        var external_link = nftData.assets[0].permalink;
        var thumbnail_pic = nftData.assets[0].image_thumbnail_url;
        logger.info(collection_name+'   '+external_link);

        // Add emails notifications to all users following 
        for(var j=0; j<followerArray.length;j++){
            const userQuery = new Moralis.Query("User");
            const userRow = await userQuery.get(followerArray[j],{useMasterKey:true});
            
            logger.info(followerArray[j])
            
            const transactionNotification = {
                collection_name: collection_name,
                external_link: external_link,
                thumbnail_pic: thumbnail_pic,
                watchedAddress: watchedAddress,
                purchaseType: purchaseType,
                transactionHash: transaction_hash,
                opensea_username: opensea_username,
            };
            userRow.add("transactionNotifications",transactionNotification,{useMasterKey:true});
            try {
                await userRow.save(null, {useMasterKey: true});
            } catch (err) {
                logger.info(err);
            }
        
        }
    }
}


});
Moralis.Cloud.job("notificationScheduler", async (request) => {
    
    const logger = Moralis.Cloud.getLogger();
    const userQuery = new Moralis.Query("User");
    userQuery.equalTo('trackingEmail', "true");
    const usersToEmail = await userQuery.find({useMasterKey:true});
    
    logger.info(usersToEmail.length);
    //For each user that has emails turned on
    for(var i =0; i<usersToEmail.length;i++){
        const email = usersToEmail[i].get("email");
        const unsentTransactions = usersToEmail[i].get("transactionNotifications");
        var emailString = '' 

        // Loop through and build email
        for(var j=0; j<unsentTransactions.length;j++){
            const {collection_name, external_link, thumbnail_pic, watchedAddress, purchaseType, transactionHash, opensea_username} = unsentTransactions[j];
            emailString += `
                <div>
                    <h3>New Transaction</h3>
                </div>
                <message_container>
                    <img class='thumbnail_pic' src=${thumbnail_pic}></img>
                    ${opensea_username ? opensea_username : watchedAddress} <a href='https://etherscan.io/tx/'${transactionHash}>${purchaseType}</a> a ${collection_name}. Find it on <a href='${external_link}'>OpenSea.
                </message_container>
            `
        }
        
        logger.info(email);
        var beginEmailString = `
            <style>
                .thumbnail_pic{
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    width: 50px;
                };
                .message_container{
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }
            </style>
        `
        var emailMessage = beginEmailString + emailString;

        // Actually send the email
        if(email && unsentTransactions.length > 0){
            Moralis.Cloud.sendEmail({
                to: email,
                subject: 'New NFT transaction',
                html: emailMessage,
            },{useMasterKey:true});
            logger.info('sent email');
            // Set email notifications to empty array
            usersToEmail[i].set("transactionNotifications",[],{useMasterKey:true});
            try {
                await usersToEmail[i].save(null, {useMasterKey: true});
            } catch (err) {
                logger.info(err);
            }

        }
    }
})

// ***** FETCHING ACTIONS ******
////////////////////////////
Moralis.Cloud.define("pullAssetData", async (request) => {
    const logger = Moralis.Cloud.getLogger();
    var soldAssets = request.params.soldAssets;
    var paramsArray= [];
    var params = {
        token_addresses: '',
        token_ids: '',
    };
    var returnData = []

    logger.info("soldAssets"+soldAssets.length);
    // Loop through and make params in batches of 30
    var newArray = true;
    for(var i=0; i<soldAssets.length; i++){
        var idArray = soldAssets[i].tokenFullID.split("/");
        newArray ? params.token_addresses += `${idArray[0]}` : params.token_addresses += `&asset_contract_addresses=${idArray[0]}`;
        newArray ? params.token_ids += `${idArray[1]}` : params.token_ids += `&token_ids=${idArray[1]}`;
        newArray = false;
        if(((i+1) % 30) == 0 || soldAssets.length-1 == i) {
            logger.info('pushing params, i = '+i);
            paramsArray.push(params);
            params = {
                token_addresses: '',
                token_ids: '',
            };
            newArray = true;
        };
    }

    logger.info('paramsArray'+paramsArray.length);
    // Pull asset data in batches of 30
    for(var i =0; i< paramsArray.length;i++){
        
        logger.info(paramsArray[i].token_ids);
        var token_id = paramsArray[i].token_ids;
        var token_address = paramsArray[i].token_addresses;
        const fetchedData = await Moralis.Cloud.httpRequest({
            url: `https://api.opensea.io/api/v1/assets?token_ids=${token_id}&asset_contract_addresses=${token_address}&order_direction=desc&offset=0&limit=50`,
            headers: {
                'Accept': 'application/json',
                'X-API-KEY': '13251e61da9545b6a58085a79f394144'
            }
        });
        var concatArray = returnData.concat(fetchedData.data.assets);
        returnData = concatArray;
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await sleep(300);
    }


    return returnData;

});
Moralis.Cloud.define("pullOpenSeaCollections", async (request) => {
    const logger = Moralis.Cloud.getLogger();
    var address = request.params.address;

    var walletData = []
    var currentOffset = 0;
    var pullData = true;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    while(pullData){
      const fetchedData = await Moralis.Cloud.httpRequest({
          url: `https://api.opensea.io/api/v1/collections?asset_owner=${address}&offset=${currentOffset}&limit=50`,
          headers: {
              'Accept': 'application/json',
              'X-API-KEY': '13251e61da9545b6a58085a79f394144'
          }
      })
      if(fetchedData.data.length <= 1){
        pullData = false;
      }else{
        walletData = walletData.concat(fetchedData.data);
        currentOffset += 50;
        await sleep(600);
      }
    }
    // logger.info("made it through all "+walletData.length);

    return walletData;

});
Moralis.Cloud.define("pullOpenSeaAssets", async (request) => {
    const logger = Moralis.Cloud.getLogger();
    var address = request.params.address;

    var walletData = []
    var currentOffset = 0;
    var pullData = true;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    while(pullData){
      const fetchedData = await Moralis.Cloud.httpRequest({
          url: `https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=${currentOffset}&limit=50`,
          headers: {
              'Accept': 'application/json',
              'X-API-KEY': '13251e61da9545b6a58085a79f394144'
          }
      })
      logger.info(fetchedData.data);
      if(fetchedData.data.assets.length <= 1){
        pullData = false;
      }else{
        walletData = walletData.concat(fetchedData.data.assets);
        currentOffset += 50;
        await sleep(600);
      }
    }
    // logger.info("made it through all "+walletData.length);

    return walletData;

});

// ***** TESTING ACTIONS ******
////////////////////////////
Moralis.Cloud.define("testEmail", async (request) => {
    const logger = Moralis.Cloud.getLogger();

    var watchedAddress = 'testtt';
    var transaction_hash = '0x002b6f8468c6b06668863ee0133e4c315202251376ea313381c56e3f21312c9c';
    var token_address = '0x47bd71b482b27ebdb57af6e372cab46c7280bf44';
    var token_id = '6114';
    var opensea_username = 'Datamosh';
    // await getNFTData('6114','0x47bd71b482b27ebdb57af6e372cab46c7280bf44');
    const fetchedData = await Moralis.Cloud.httpRequest({
        url: `https://api.opensea.io/api/v1/assets?token_ids=${token_id}&asset_contract_address=${token_address}&order_direction=desc&offset=0&limit=20`,
        headers: {
            'Accept': 'application/json',
            'X-API-KEY': '13251e61da9545b6a58085a79f394144'
        }
    })

    // GlYS7qfnNNjyHpbVVLpjOoX5
    var nftData = fetchedData.data;
    var collection_name = nftData.assets[0].name;
    var external_link = nftData.assets[0].permalink;
    var thumbnail_pic = nftData.assets[0].image_thumbnail_url;
    logger.info(collection_name+'   '+external_link);

    // Send emails to everyone who follows wallet
    const userQuery = new Moralis.Query("User");
    const userRow = await userQuery.get('GlYS7qfnNNjyHpbVVLpjOoX5',{useMasterKey:true});
    const transactionNotification = {
        collection_name: collection_name,
        external_link: external_link,
        thumbnail_pic: thumbnail_pic,
        watchedAddress: watchedAddress,
        transactionHash: transaction_hash,
        opensea_username: opensea_username,
    };
    logger.info(transactionNotification);
    logger.info(userRow.get("trackingEmail"));
    userRow.add("transactionNotifications",transactionNotification,{useMasterKey:true});
    try {
        await userRow.save(null, {useMasterKey: true});
    } catch (err) {
        logger.info(err);
    }



    return "Sent???"

    
});
