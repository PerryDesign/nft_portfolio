 
 
 export function getWalletStats(ALL_ASSETS,ETH_PRICE,useTransfersInCalc){

    // Loop and get total ROI
    var WALLET_STATS=[]
    var purchaseOpen=0;
    var purchaseOpenHist=0;
    var floor=0;
    var purchaseClosed=0;
    var purchaseClosedHist=0;
    var sold=0;
    var saleHist=0;
    console.log(ALL_ASSETS)
    for(var i = 0; i<ALL_ASSETS.length;i++){

      if(checkValidAsset(ALL_ASSETS[i])){
        if(ALL_ASSETS[i].position === 'open'){
          purchaseOpen += /[a-z]/i.test( ALL_ASSETS[i].purchase_price.toString() ) ? 0 : parseFloat(ALL_ASSETS[i].purchase_price);
          floor += /[a-z]/i.test( ALL_ASSETS[i].floor_price.toString() ) ? 0 : parseFloat(ALL_ASSETS[i].floor_price);
          purchaseOpenHist += /[a-z]/i.test( ALL_ASSETS[i].purchase_price.toString() ) ? 0 :  ALL_ASSETS[i].purchase_price*ALL_ASSETS[i].purchase_etherPrice;
        }
        if(ALL_ASSETS[i].position === 'closed'){
          purchaseClosed += /[a-z]/i.test( ALL_ASSETS[i].purchase_price.toString() ) ? 0 : ALL_ASSETS[i].purchase_price;
          purchaseClosedHist += /[a-z]/i.test( ALL_ASSETS[i].purchase_price.toString() ) ? 0 : ALL_ASSETS[i].purchase_price*ALL_ASSETS[i].purchase_etherPrice;
          sold += /[a-z]/i.test( ALL_ASSETS[i].sell_price.toString() ) ? 0 : ALL_ASSETS[i].sell_price;
          saleHist += /[a-z]/i.test( ALL_ASSETS[i].sell_price.toString() ) ? 0 : ALL_ASSETS[i].sell_price*ALL_ASSETS[i].sell_etherPrice;
        }
      }
    }

    function checkValidAsset(asset){
      var valid = true;
      if(!useTransfersInCalc){
        if(asset.purchase_price === 0){
          valid = false;
        }else{
          valid = /[a-z]/i.test(asset.purchase_price.toString()) ? false : true;
        }
        if(asset.position === 'closed' && asset.sell_price === 0){
          valid = false;
        }else if(asset.position === 'closed'){
          valid = /[a-z]/i.test(asset.sell_price.toString()) ? false : true;
        }
      }
      return valid
    }

    var totalUnrealizedPercent = purchaseOpen !== 0 ? floor/purchaseOpen : 0;;
    var totalUnrealizedEth = floor-purchaseOpen;
    var totalUnrealizedDollar = (floor-purchaseOpenHist);
    var totalUnrealizedHist = (floor*ETH_PRICE)-purchaseOpenHist;
    var totalRealizedPercent = purchaseClosed !== 0 ? sold/purchaseClosed : 0;
    var totalRealizedEth = sold - purchaseClosed;
    var totalRealizedDollar = (sold - purchaseClosed);
    var totalRealizedHist = saleHist - purchaseClosedHist;
    var activeHoldingsEth = floor;
    var activeHoldingsDollar = floor;
    var activeHoldingsHist = floor;
    var soldHoldingsEth = sold;
    var soldHoldingsDollar = sold;
    var soldHoldingsHist = saleHist;
    var netRoiPercent = (floor+sold)/(purchaseOpen*purchaseClosed);
    var netRoiEth = (floor+sold)-(purchaseOpen+purchaseClosed);
    var netRoiDollar = (floor+sold)-(purchaseOpen+purchaseClosed);
    var netRoiHist = ((activeHoldingsHist*ETH_PRICE)+saleHist)-(purchaseClosedHist+purchaseOpenHist);



    WALLET_STATS = {
      unrealized_percent: totalUnrealizedPercent,
      unrealized_eth: totalUnrealizedEth,
      unrealized_dollar: totalUnrealizedDollar,
      unrealized_hist: totalUnrealizedHist,
      realized_percent: totalRealizedPercent,
      realized_eth: totalRealizedEth,
      realized_dollar: totalRealizedDollar,
      realized_hist: totalRealizedHist,
      active_holdings_eth: activeHoldingsEth,
      active_holdings_dollar: activeHoldingsDollar,
      active_holdings_hist: activeHoldingsHist,
      sold_holdings_eth: soldHoldingsEth,
      sold_holdings_dollar: soldHoldingsDollar,
      sold_holdings_hist: soldHoldingsHist,
      net_roi_percent: netRoiPercent,
      net_roi_eth: netRoiEth,
      net_roi_dollar: netRoiDollar,
      net_roi_hist: netRoiHist,
    }


    return WALLET_STATS
  }