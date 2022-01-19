import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Dashboard from './dashboard/Dashboard'
import Header from './header/Header'
import ResultsTable from './ResultsTable'
import {fetchAssets} from './fetchAssets'
import { getWalletStats } from './getWalletStats'
import { useMoralis } from "react-moralis"


const MainApp = ({currentUser,setCurrentUser}) => {

    const [status, setStatus] = useState('ready');
    const [walletInputFieldText,setWalletInputFieldText] = useState('');
    const [activeWalletID, setActiveWalletID] = useState('');
    const [activeAssets, setActiveAssets] = useState([]);
    const [walletStats, setWalletStats] = useState('');
    const [walletMetaData, setWalletMetaData] = useState('');
    const [currencyType, setCurrencyType] = useState('percent');
    const [currentEthPrice, setCurrentEthPrice] = useState('');
    const [useTransfersInCalc, setUseTransfersInCalc] = useState(true);

    useEffect(()=>{
        if(activeAssets.length === 0) setActiveAssets(WALLET_ASSETS_TEMP);
        if(walletMetaData === '') setWalletMetaData(WALLET_METADATA_TEMP);
        if(walletStats === '') setWalletStats(WALLET_STATS_TEMP);;
    },[])
    
    useEffect(()=>{
        console.log(status)
        if(status == 'start_fetch'){
            setActiveAssets(WALLET_ASSETS_TEMP);
            setWalletMetaData(WALLET_METADATA_TEMP);
            fetchAssets(activeWalletID,currentEthPrice).then((assets)=>{
                setStatus('fetched')
                setActiveAssets(assets[0]);
                setWalletMetaData(assets[1]);
                var stats = getWalletStats(assets[0],currentEthPrice,useTransfersInCalc);
                setWalletStats(stats);
            });
        } 
    },[status])

    useEffect(()=>{
        console.log(useTransfersInCalc)
        if(status == 'fetched'){
            setWalletStats( getWalletStats(activeAssets, currentEthPrice,useTransfersInCalc) );
        }
    },[useTransfersInCalc])

    useEffect(()=>{
        // console.log(activeAssets)
    },[activeAssets])
    useEffect(()=>{
        // console.log(walletStats)
    },[walletStats])
    const { isAuthUndefined, isAuthenticated, account, user } = useMoralis();
    useEffect(()=>{
        if(isAuthenticated){
            setWalletInputFieldText(currentUser);
        }
    },[currentUser]);


    var WALLET_ASSETS_TEMP = [{
        floor_price: 0,
        tokenFullID:'',
        contract_type: 'ERC721',
        collection_name: '-',
        collection_slug: '',
        asset_name: '-',
        asset_thumbnail: 'https://storage.googleapis.com/opensea-static/opensea-profile/31.png',
        asset_permalink: '',
        position: 'open',
        purchase_price: 0,
        sell_price: 0,
        purchase_time: '',
        sell_time: '',
        purchase_transaction_hash: '',
        sell_transaction_hash: '',
        purchase_etherPrice: 0,
        sell_etherPrice: 0,
        transactionQuantity: 1,
        transactionType: 'ERC721',
        roiPercent:1,
        roiEth:0,
        roiDollar:0,
        roiHist:0,
    }]

     var WALLET_METADATA_TEMP = {
        historical_quantity: 0,
        active_quantity: 0,
        first_transaction: '00/00/00',
        opensea_username: 'User',
        opensea_pro_pic: 'https://storage.googleapis.com/opensea-static/opensea-profile/31.png',
      }
     var WALLET_STATS_TEMP = {
        unrealized_percent: 0,
        unrealized_eth: 0,
        unrealized_dollar: 0,
        unrealized_hist: 0,
        realized_percent: 0,
        realized_eth: 0,
        realized_dollar: 0,
        realized_hist: 0,
        active_holdings_eth: 0,
        active_holdings_dollar: 0,
        active_holdings_hist: 0,
        sold_holdings_eth: 0,
        sold_holdings_dollar: 0,
        sold_holdings_hist: 0,
        net_roi_percent: 0,
        net_roi_eth: 0,
        net_roi_dollar: 0,
        net_roi_hist: 0,
      }

    return (
        <MainAppContainer>
            <Header
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                currentEthPrice={currentEthPrice}
                setCurrentEthPrice={setCurrentEthPrice}
                walletInputFieldText={walletInputFieldText}
                setWalletInputFieldText={setWalletInputFieldText}
            />
            <WalletExplorerContainer>
                <Dashboard
                    currentUser={currentUser}
                    walletStats={walletStats}
                    activeWalletID={activeWalletID}
                    setActiveWalletID={setActiveWalletID}
                    walletInputFieldText={walletInputFieldText}
                    setWalletInputFieldText={setWalletInputFieldText}
                    activeAssets={activeAssets}
                    setActiveAssets={setActiveAssets}
                    status={status}
                    setStatus={setStatus}
                    currencyType={currencyType}
                    setCurrencyType={setCurrencyType}
                    currentEthPrice={currentEthPrice}
                    useTransfersInCalc={useTransfersInCalc}
                    setUseTransfersInCalc={setUseTransfersInCalc}
                    walletMetaData={walletMetaData}
                />
                <ResultsTable
                    activeAssets={activeAssets}
                    currencyType={currencyType}
                />
            </WalletExplorerContainer>
        </MainAppContainer>
    )
}

const MainAppContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: baseline;
    height: 100%;
    width: 100%;
    background-color: ${props => props.theme.background.back};
`

const WalletExplorerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: baseline;
    /* padding: 100px 150px; */
    /* height: 100vh; */
    /* width: 100%; */
`


export default MainApp
