import React from 'react';
import styled from 'styled-components';
import TrackerSettings from './TrackerSettings';
import { subscribeWallet, unsubscribeWallet } from '../lib/walletSubscription'
import Moralis from 'moralis';
import { createNotification } from '../lib/createNotification'


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
    const handleTestSend = async (e) => {
        var address = e.target.id;
        console.log('notification?');
        createNotification('error','this is a test!');
    }


    return (
        <TrackedWalletsPageContainer>
            <TrackerSettings
                currentUser={currentUser}
            />
            <TrackedWalletsContainer>
                {trackedWallets.map(wallet => {
                    return(
                        <TrackedWalletDiv> {wallet} <UnsubscribeToWalletContainer id={wallet} onClick={handleUnsubscribe}>Unsubscribe</UnsubscribeToWalletContainer> </TrackedWalletDiv>
                    )
                })}
            </TrackedWalletsContainer>
            {/* <button onClick={handleTestEmail}/> */}
            <button onClick={handleTestSend}/>
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
    width: 600px;
`
const UnsubscribeToWalletContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.purple};
    border: ${props => '2px solid '+props.theme.colors.purple};
    border-radius: 4px;
    padding: 3px 10px;
    margin-left: 30px;
    :hover {
        background-color: ${props => props.theme.colors.purpleDark};
        color: ${props => props.theme.text.white};
    }
`


export default TrackedWalletsPage;
