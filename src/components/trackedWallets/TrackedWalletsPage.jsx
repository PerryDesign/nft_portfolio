import React from 'react';
import styled from 'styled-components';
import TrackerSettings from './TrackerSettings';
import { subscribeWallet, unsubscribeWallet } from '../walletSubscription'
import Moralis from 'moralis';


const TrackedWalletsPage = ({currentUser,currentEthPrice,trackedWallets,setTrackedWallets,previousTrackedWallets}) => {

    const handleUnsubscribe = async (e) => {
        var address = e.target.id;
        console.log(address);
        await unsubscribeWallet(address,setTrackedWallets,previousTrackedWallets)
    }
    const handleTestEmail = async (e) => {
        var address = e.target.id;
        console.log('trying to send email');
        const email = await Moralis.Cloud.run("testEmail");
    }


    return (
        <TrackedWalletsPageContainer>
            <TrackerSettings/>
            <TrackedWalletsContainer>
                {trackedWallets.map(wallet => {
                    return(
                        <TrackedWalletDiv> {wallet} <UnsubscribeToWalletContainer id={wallet} onClick={handleUnsubscribe}>Unsubscribe</UnsubscribeToWalletContainer> </TrackedWalletDiv>
                    )
                })}
            </TrackedWalletsContainer>
            <button onClick={handleTestEmail}/>
        </TrackedWalletsPageContainer>
    );
};

const TrackedWalletsPageContainer = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40vw;
`
const TrackedWalletsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    width: 100%;
`
const TrackedWalletDiv = styled.div`
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: ${props => props.theme.background.four};
    padding: 10px 30px;
    width: 100%;
`
const UnsubscribeToWalletContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.blue};
    border: ${props => '2px solid '+props.theme.colors.blue};
    border-radius: 4px;
    padding: 3px 10px;
    margin-left: 30px;
    :hover {
        background-color: ${props => props.theme.colors.blue};
        color: ${props => props.theme.text.white};
    }
`


export default TrackedWalletsPage;
