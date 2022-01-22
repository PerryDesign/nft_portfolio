import Moralis from 'moralis'

export async function unsubscribeWallet(activeWalletID,setTrackedWallets,previousTrackedWallets){
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    if(activeWalletID){
        var address = activeWalletID.toLowerCase();
        await sleep(300);
        const params = {
            address: address,
          };
        const watch = await Moralis.Cloud.run("unwatchAddress", params);
        if (watch){
            console.log("Success unsub");
            var newWallets = previousTrackedWallets.current.filter(wallet =>{
                return wallet !== address;
            })
            if(newWallets.length < 1) newWallets = [];
            setTrackedWallets(newWallets);
        };
    }
}

export async function subscribeWallet(activeWalletID,setTrackedWallets,previousTrackedWallets){
    if(activeWalletID){
        var address = activeWalletID.toLowerCase();
        const params = {
            address: address,
        };
        const watch = await Moralis.Cloud.run("watchAddress", params);
        // console.log(watch)
        if (watch){
            console.log("Success");
            var newWallets = previousTrackedWallets.current;
            newWallets.push(address);
            var deepCopy = JSON.stringify(newWallets);
            setTrackedWallets(JSON.parse(deepCopy))
        };
    }
}