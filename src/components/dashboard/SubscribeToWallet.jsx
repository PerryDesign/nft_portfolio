import React from 'react'
import styled from 'styled-components'
import Moralis from 'moralis'

const SubscribeToWallet = ({activeWalletID,currentUser}) => {
    
    const handleSubscribe = async (e) => {
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        if(activeWalletID){
            console.log('click');
            await sleep(300);
            const params = {
                address: activeWalletID.toLowerCase(),
                follower: currentUser.toLowerCase(),
              };
            const watch = await Moralis.Cloud.run("watchAddress", params);
            console.log(watch)
            if (watch) console.log( JSON.stringify(activeWalletID + " added to watch list. 🐋👀", 0, 2) );
        }
    }


    return (
        <SubscribeContainer>
            <h3>
                <SubscribeToWalletContainer onClick={handleSubscribe}>
                        Subscribe
                </SubscribeToWalletContainer>
   
            </h3>
        </SubscribeContainer>
    )
}

const SubscribeToWalletContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: ${props => props.theme.colors.blue};
    border-radius: 4px;
    margin-top: 10px;
    padding: 5px 10px;
    :hover {
        background-color: ${props => props.theme.colors.blueDark};
    }
`
const SubscribeContainer = styled.div`
    display: flex;
`

export default SubscribeToWallet
