import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import { useMoralis } from "react-moralis"
import { subscribeWallet, unsubscribeWallet } from '../walletSubscription'

const SubscribeToWallet = ({activeWalletID,trackedWallets,setTrackedWallets,subscribed,previousTrackedWallets}) => {


    const { isAuthUndefined, isAuthenticated, account, user } = useMoralis();
    const handleSubscribe = async (e) => {
        await subscribeWallet(activeWalletID,setTrackedWallets,previousTrackedWallets)
        // if(activeWalletID){
        //     var address = activeWalletID.toLowerCase();
        //     const params = {
        //         address: address,
        //     };
        //     const watch = await Moralis.Cloud.run("watchAddress", params);
        //     // console.log(watch)
        //     if (watch){
        //         console.log("Success");
        //         var newWallets = previousTrackedWallets.current;
        //         newWallets.push(address);
        //         var deepCopy = JSON.stringify(newWallets);
        //         setTrackedWallets(JSON.parse(deepCopy))
        //     };
        // }
    }
    const handleUnsubscribe = async (e) => {
        await unsubscribeWallet(activeWalletID,setTrackedWallets,previousTrackedWallets)
        // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        // if(activeWalletID){
        //     var address = activeWalletID.toLowerCase();
        //     await sleep(300);
        //     const params = {
        //         address: address,
        //       };
        //     const watch = await Moralis.Cloud.run("unwatchAddress", params);
        //     if (watch){
        //         console.log("Success unsub");
        //         var newWallets = previousTrackedWallets.current.filter(wallet =>{
        //             return wallet !== address;
        //         })
        //         if(newWallets.length < 1) newWallets = [];
        //         setTrackedWallets(newWallets);
        //     };
        // }
    }



    return (
        <SubscribeContainer>
            <h3>
                <SubscribeToWalletContainer visible={!subscribed && activeWalletID !== ''}  onClick={handleSubscribe}>
                        Subscribe
                </SubscribeToWalletContainer>
                <UnsubscribeToWalletContainer visible={subscribed && activeWalletID !== ''} onClick={handleUnsubscribe}>
                        Unsubscribe
                </UnsubscribeToWalletContainer>
   
            </h3>
        </SubscribeContainer>
    )
}

const SubscribeToWalletContainer = styled.div`
    display: ${props => props.visible ? 'flex' : 'none'};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text.white};
    background-color: ${props => props.theme.colors.purple};
    border-radius: 4px;
    margin-top: 10px;
    padding: 5px 10px;
    :hover {
        background-color: ${props => props.theme.colors.purpleDark};
    }
`
const UnsubscribeToWalletContainer = styled.div`
    display: ${props => props.visible ? 'flex' : 'none'};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.purple};
    border: ${props => '2px solid '+props.theme.colors.purple};
    border-radius: 4px;
    margin-top: 10px;
    padding: 3px 10px;
    :hover {
        background-color: ${props => props.theme.colors.purpleDark};
        color: ${props => props.theme.text.white};
    }
`
const SubscribeContainer = styled.div`
    display: flex;
`

export default SubscribeToWallet
