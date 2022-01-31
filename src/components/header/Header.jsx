import React from 'react'
import styled from 'styled-components';
import EthPrice from './EthPrice';
// import { ReactComponent as Logo } from '../../Wallet_Port.svg';
import logo from '../../Wallet_Port.png'
import HeaderAccount from './HeaderAccount';

const Header = ({currentUser,setCurrentUser,currentEthPrice,setCurrentEthPrice,setCurrentPage,currentPage}) => {
    const TabClickHandler = (e) => {
        var value = e.target.id;
        console.log(value);
        if(currentPage !== value) setCurrentPage(value);
    }
    return (
        <HeaderContainer>
            <LogoContainer>
                <LogoImg src={logo} onClick={TabClickHandler} id={'homepage'}/>
            </LogoContainer>
            <HeaderLeft>
                <TabHeader onClick={TabClickHandler} id={'port_explorer'} selected={currentPage == 'port_explorer'}>Port Explorer</TabHeader>
                <TabHeader onClick={TabClickHandler} id={'tracked_wallets'} selected={currentPage == 'tracked_wallets'}>Tracked Wallets</TabHeader>
                <EthPrice
                    currentEthPrice={currentEthPrice}
                    setCurrentEthPrice={setCurrentEthPrice}
                />
                <HeaderAccount
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                />
            </HeaderLeft>
        </HeaderContainer>
    )
}
const HeaderContainer = styled.div`
    display:flex;
    flex-direction: row;
    width: 100%;
    padding: 10px 0px;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background-color: ${props => props.theme.background.four};
`

const HeaderLeft = styled.div`
    display:flex;
    flex-direction: row;
    align-items: center;
`

const LogoContainer = styled.div`
    margin-left: 40px;
    display:flex;
    flex-direction: row;
    align-items: center;
    width: 200px;
`

const TabHeader = styled.div`
    margin: 0px 20px;
    display:flex;
    flex-direction: row;
    align-items: center;
    border-radius: 4px;
    padding: 5px 10px;
    background-color: ${props => props.selected ? props.theme.background.two : 'none'};
    :hover {
        background-color: ${props => props.theme.background.one};
    };
`
const LogoImg = styled.img`
    width: 200px;
`


export default Header
