import React from 'react'
import styled from 'styled-components'
import {numberWithCommas} from '../lib/numberWithCommas'

const DashStatsPanel = ({activeAssets,currencyType,status,walletStats,currentEthPrice}) => {

    const EthPrice = 3000;

    var activeUnrealizedROI;
    var activeRealizedROI;
    var activeNetRoi;
    var activeHoldings;
    var totalSold;
    var intSign = '';

    // unrealized_percent: totalUnrealizedPercent,
    // unrealized_eth: totalUnrealizedEth,
    // unrealized_dollar: totalUnrealizedDollar,
    // unrealized_hist: totalUnrealizedHist,
    // realized_percent: totalRealizedPercent,
    // realized_eth: totalRealizedEth,
    // realized_dollar: totalRealizedDollar,
    // realized_hist: totalRealizedHist,
    // active_holdings_eth: activeHoldingsEth,
    // active_holdings_dollar: activeHoldingsDollar,
    // active_holdings_hist: activeHoldingsHist,
    // sold_holdings_eth: soldHoldingsEth,
    // sold_holdings_dollar: soldHoldingsDollar,
    // sold_holdings_hist: soldHoldingsHist,
    // net_roi_percent: netRoiPercent,
    // net_roi_eth: netRoiEth,
    // net_roi_dollar: netRoiDollar,
    // net_roi_hist: netRoiHist,



    if(status == 'fetched'){

        if(currencyType == 'percent'){
            activeUnrealizedROI = ((walletStats.unrealized_percent*100).toFixed(2));
            activeRealizedROI = ((walletStats.realized_percent*100).toFixed(2));
            activeNetRoi = ((walletStats.net_roi_percent*100).toFixed(2));
            activeHoldings = (walletStats.active_holdings_eth.toFixed(2));
            totalSold = (walletStats.sold_holdings_eth.toFixed(2));
            intSign = '%'
        }
        if(currencyType == 'eth'){
            activeUnrealizedROI = (walletStats.unrealized_eth.toFixed(2));
            activeRealizedROI = (walletStats.realized_eth.toFixed(2));
            activeNetRoi = (walletStats.net_roi_eth.toFixed(2));
            activeHoldings = (walletStats.active_holdings_eth.toFixed(2));
            totalSold = (walletStats.sold_holdings_eth.toFixed(2));
            intSign = 'Ξ'
        }
        if(currencyType == 'dollar'){
            activeUnrealizedROI = ((walletStats.unrealized_eth*currentEthPrice).toFixed(2));
            activeRealizedROI = ((walletStats.realized_dollar*currentEthPrice).toFixed(2));
            activeNetRoi = ((walletStats.net_roi_dollar*currentEthPrice).toFixed(2));
            activeHoldings = ((walletStats.active_holdings_dollar*currentEthPrice).toFixed(2));
            totalSold = ((walletStats.sold_holdings_dollar*currentEthPrice).toFixed(2));
            intSign = '$'
        }
        if(currencyType == 'hist'){
            activeUnrealizedROI = (walletStats.unrealized_hist.toFixed(2));
            activeRealizedROI = (walletStats.realized_hist.toFixed(2));
            activeNetRoi = (walletStats.net_roi_hist.toFixed(2));
            activeHoldings = (walletStats.active_holdings_hist.toFixed(2));
            totalSold = (walletStats.sold_holdings_hist.toFixed(2));
            intSign = '$'
        }
    
    }
    else{
        activeUnrealizedROI = 0;
        activeRealizedROI = 0;
        activeNetRoi = 0;
        activeHoldings = 0;
        totalSold = 0;
    }

    
    return (
        <DashStatsPanelContainer>
            <DashTitlesDiv>
                <DashCell><h3>Total Unrealized ROI</h3></DashCell>
                <DashCell><h3>Total Realized ROI</h3></DashCell>
                <DashCell><h3>Net ROI</h3></DashCell>
                <DashCell><h3>Active Holdings</h3></DashCell>
                <DashCell><h3>Sold Holdings</h3></DashCell>
            </DashTitlesDiv>
            <DashDataDiv>
                <DashDataCell color={parseFloat(activeUnrealizedROI)>0 ? 'green' : activeUnrealizedROI<0 ? 'red': ''}><h4>{intSign}</h4><h3>{numberWithCommas(activeUnrealizedROI)}</h3></DashDataCell>
                <DashDataCell color={parseFloat(activeRealizedROI)>0 ? 'green' : activeRealizedROI<0 ? 'red': ''}><h4>{intSign}</h4><h3>{numberWithCommas(activeRealizedROI)}</h3></DashDataCell>
                <DashDataCell color={parseFloat(activeNetRoi)>0 ? 'green' : activeNetRoi<0 ? 'red': ''}><h4>{intSign}</h4><h3>{numberWithCommas(activeNetRoi)}</h3> </DashDataCell>
                <DashDataCell ><h4>{intSign == '$' ? '$' : 'Ξ'}</h4><h3>{numberWithCommas(activeHoldings)}</h3> </DashDataCell>
                <DashDataCell> <h4>{intSign == '$' ? '$' : 'Ξ'}</h4><h3>{numberWithCommas(totalSold)}</h3></DashDataCell>
            </DashDataDiv>
        </DashStatsPanelContainer>
    )
}

const DashStatsPanelContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: space-between; */
    background-color: ${props => props.theme.background.four};
    padding: 20px 30px;
`

const DashTitlesDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right:60px;
`

const DashDataDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: left;
    `

const DashCell = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0px 10px;
    text-align: left;
    justify-content: space-between;
    margin: 5px 0px;
    min-width: 100px;
    width: 100%;
    height: 26px;
    `
const DashDataCell = styled(DashCell)`
    min-width: 50px;
    align-items: center;
    border-radius: 5px;
    font-family: "OpenSans", sans-serif;
    padding: 0px 10px;
    background-color: ${props => props.color === 'red' ?  props.theme.colors.red :  props.color === 'green' ? props.theme.colors.green : props.theme.background.two};
    `


export default DashStatsPanel
