Moralis.Cloud.define("watchAddress", async (request) => {
    const logger = Moralis.Cloud.getLogger();
  
    // check 1/2: address exists
    if (!request.params.address) {
      logger.info("error: missing address param.");
    } else {
        let address = request.params.address;
        let follower = request.params.follower;
        
        if (!address) {
            return null;
        }
        
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
                if(followerArray[i] == follower){
                    alreadyFollowing = true;
                }
            }
            if(alreadyFollowing) return "Already Following"
            else{
                // If follower is not already following
                followerArray.push(follower);
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
            logger.info(row_object);
            var singleFollowerArray = [follower];
            row_object.set("followers", singleFollowerArray);
            // save it
            try {
                await row_object.save();
            } catch (err) {
                logger.info(err);
            }
        }

        Moralis.Cloud.afterSave("EthNFTTransfers", async function (request) {
            let to_address = request.object.get("to_address");
            let from_address = request.object.get("from_address");
            let transaction_hash = request.object.get("transaction_hash");

            const countQuery = new Moralis.Query("WatchedEthAddress");
            countQuery.equalTo("address", from_address);
            countQuery.equalTo("address", to_address);
            const matchedAddresses = await countQuery.find();
            // Check to see if follower follows any of the match transaction addresses
            for(var i = 0;i<followerArray.length;i++){
                const followerArray = matchedAddresses[i].get("followers");
                if(followerArray[i] === follower){

                    logger.info(follower+"--------------"+transaction_hash);
                    logger.info("------ NFT Transfer ------");
                }
            }
            

            
    
            // todo: insert handling including increase/decrease here
            // next: trigger allocated alert method
            // e.g. sendTelegramAlert(request.object, token_data);
        });
    
        return true;
        
    }
});