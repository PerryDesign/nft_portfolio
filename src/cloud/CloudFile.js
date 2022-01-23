
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
    user.set("trackingMethods",trackingMethods);
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

    const results = await Moralis.Cloud.run("unwatchEthAddress", {
        address: address,
    },{useMasterKey:true});

    logger.info(`User - ${user} Unsubscribed from ${address}`)
    
    var currentTrackedWallets = user.get("watchedEthWallets")
    currentTrackedWallets.length == 1 ?user.set("watchedEthWallets",[]) : user.remove("watchedEthWallets",address);

    try {
        await user.save(null, { useMasterKey: true });
    } catch (err) {
        logger.info(err);
    }
    return "Success?"
})

Moralis.Cloud.define("watchAddress", async (request) => {
    
    const logger = Moralis.Cloud.getLogger();
  
    let address = request.params.address;
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
        // save it
        try {
            await row_object.save();
            await addAddressToUser();
        } catch (err) {
            logger.info(err);
        }
    }

    Moralis.Cloud.afterSave("EthTransactions", async function (request) {
        const confirmed = request.object.get("confirmed");
        if(confirmed){
            logger.info('confirmed');
            
            let to_address = request.object.get("to_address");
            let from_address = request.object.get("from_address");
            let transaction_hash = request.object.get("hash");
            let token_id = request.object.get("token_id");
            let token_address = request.object.get("token_address");
            var purchaseType = from_address == address ? 'sold' : 'bought';
            
            const countQuery = new Moralis.Query("WatchedEthAddress");
            countQuery.containedIn("address", [to_address,from_address]);
            const matchedAddresses = await countQuery.find();
            // Check to see if follower follows any of the match transaction addresses
            logger.info(matchedAddresses.length);
            for(var i = 0;i<matchedAddresses.length;i++){
                const followerArray = matchedAddresses[i].get("followers");
                if(followerArray[i] === userId){
                    var watchedAddress = matchedAddresses[i].get("address");
                    const fetchedData = await Moralis.Cloud.httpRequest({
                        url: `https://api.opensea.io/api/v1/assets?token_ids=${token_id}&asset_contract_address=${token_address}&order_direction=desc&offset=0&limit=20`,
                        headers: {
                            'Accept': 'application/json',
                            'X-API-KEY': '13251e61da9545b6a58085a79f394144'
                        }
                    })
                    var nftData = fetchedData.data;
                    logger.info(nftData)
                    var collection_name = nftData.assets[0].name;
                    var external_link = nftData.assets[0].external_link;
                    var email = user.get("email");
                    logger.info(collection_name)
                    var message = `
                        <div>
                            <h3>New Transaction</h3>
                        </div>
                        <div>
                            ${watchedAddress} ${purchaseType} a ${collection_name}. Find it on <a href='${external_link}'>OpenSea.
                        </div>
                
                    `
                    Moralis.Cloud.sendEmail({
                        to: email,
                        subject: 'New NFT transaction',
                        html: message,
                    },{useMasterKey:true});
                    logger.info('sent email');
                }
            }
        }

        
    });
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

    async function getNFTData(token_id, token_address){

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-API-KEY': '13251e61da9545b6a58085a79f394144'
            }
        };
        var response = await fetch(`https://api.opensea.io/api/v1/assets?token_ids=${token_id}&asset_contract_address=${token_address}&order_direction=desc&offset=0&limit=20`, options);
        var responseParsed = await response.json();
        return responseParsed;
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


Moralis.Cloud.define("testEmail", async (request) => {
    let user = request.user;
    const logger = Moralis.Cloud.getLogger();

    var watchedAddress = 'testtt';
    var token_address = '0x47bd71b482b27ebdb57af6e372cab46c7280bf44';
    var token_id = '6114';
    // await getNFTData('6114','0x47bd71b482b27ebdb57af6e372cab46c7280bf44');
    const fetchedData = await Moralis.Cloud.httpRequest({
        url: `https://api.opensea.io/api/v1/assets?token_ids=${token_id}&asset_contract_address=${token_address}&order_direction=desc&offset=0&limit=20`,
        headers: {
            'Accept': 'application/json',
            'X-API-KEY': '13251e61da9545b6a58085a79f394144'
        }
    })
    var nftData = fetchedData.data;
    logger.info(nftData)
    var collection_name = nftData.assets[0].name;
    var external_link = nftData.assets[0].external_link;
    var email = user.get("email");
    var purchaseType = true ? 'sold' : 'bought';
    logger.info(collection_name)
    var message = `
        <div>
            <h3>New Transaction</h3>
        </div>
        <div>
            ${watchedAddress} ${purchaseType} a ${collection_name}. Find it on <a href='${external_link}'>OpenSea.
        </div>

    `
    Moralis.Cloud.sendEmail({
        to: email,
        subject: 'New NFT transaction',
        html: message,
    },{useMasterKey:true});
    // Moralis.Cloud.sendEmail({
    //     to: email,
    //     subject: 'New NFT transaction',
    //     templateID: "d-5e080156c8c1424c88f526899deed2f0",
    //     dynamic_template_data: {
    //         watchedAddress: watchedAddress,
    //         purchaseType: 'bought',
    //         collection_name: collection_name,
    //         external_link: external_link,
    //     }
    // },{useMasterKey:true});


    //     res => {
    //         var responseParsed = res.text;
    //         logger.info(res.text);
    //         nftData= responseParsed;
    //         return responseParsed;
    //     },(httpResponse) => {
    //         logger.info('Request failed with response code ' + httpResponse.status)
    //     })
    // }
    logger.info('sent email');
    return "Sent???"

    
});