import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import SubscribeToWallet from './SubscribeToWallet';

const AccountPanel = ({activeAssets,currencyType,setCurrencyType,status,walletMetaData,activeWalletID,currentUser,trackedWallets,setTrackedWallets,previousTrackedWallets}) => {


    const [subscribed,setSubscribed] = useState(true);

    useEffect(()=>{
        if(activeWalletID !== ''){
            var check = trackedWallets.filter(wallet => {
                return wallet === activeWalletID;
            }); 
            check = check.length > 0 ? true : false;
            console.log('subscribed - ' + check+'   '+trackedWallets);
            
            setSubscribed(check);
        };
    },[activeWalletID,trackedWallets])



    var firstTransactionDate = new Date(walletMetaData.first_transaction);
    var firstTransaction = walletMetaData.first_transaction == '00/00/00' ? '00/00/00' : firstTransactionDate.getMonth()+'/'+firstTransactionDate.getDate()+'/'+firstTransactionDate.getFullYear()
    // var firstTransaction = firstTransactionDate;
    return (
        <AccountPanelContainer>
            <ProPicContainer>
                <ProPic src={walletMetaData.opensea_pro_pic}/>
                <NameSubscribeDiv>
                    <UserNameStyle><h2>{walletMetaData.opensea_username}</h2></UserNameStyle>
                    <SubscribeToWallet 
                        activeWalletID={activeWalletID}
                        trackedWallets={trackedWallets}
                        setTrackedWallets={setTrackedWallets}
                        previousTrackedWallets={previousTrackedWallets}
                        subscribed={subscribed}
                        walletMetaData={walletMetaData}
                    />
                </NameSubscribeDiv>
            </ProPicContainer>
            <InfoContainer>
                <AccountDataDiv>
                    <AccountCell><h3>Historical Amount</h3></AccountCell>
                    <AccountCell><h3>Active Amount</h3></AccountCell>
                    <AccountCell><h3>First Transaction</h3></AccountCell>
                </AccountDataDiv>
                <AccountDataDiv>
                    <AccountCellData><h4>{walletMetaData.historical_quantity}</h4></AccountCellData>
                    <AccountCellData><h4>{walletMetaData.active_quantity}</h4></AccountCellData>
                    <AccountCellData>
                        <h4>{firstTransaction}</h4>
                    </AccountCellData>
                </AccountDataDiv>
            </InfoContainer>
            
        </AccountPanelContainer>
    )
}


const AccountPanelContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.background.four};
    padding: 20px 30px;
`
const ProPicContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: baseline;
    margin-bottom: 30px ;
`
const ProPic = styled.img`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80px;
`
const NameSubscribeDiv = styled.div`
    /* display: flex;
    flex-direction: column; */
    padding: 0px 10px;
    text-align: left;
    /* align-items: */
    margin: 0px 0px 0px 30px;
`
const UserNameStyle = styled.div`
`

const InfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

`
const AccountDataDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: left;
`
const AccountCell = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 10px;
    text-align: left;
    justify-content: left;
    margin: 5px 0px 5px;
    width: 100%;
`
const AccountCellData = styled(AccountCell)`
    /* background-color: ${props => props.theme.background.two}; */
`


export default AccountPanel
