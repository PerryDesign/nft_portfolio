import React from 'react'
import styled from 'styled-components';
import { useMoralis } from "react-moralis";
import EthPrice from './EthPrice';

const Header = ({currentEthPrice,setCurrentEthPrice}) => {

    const { authenticate, isAuthenticated, user } = useMoralis();

    const HandleAuthenticateClick = () => {
        console.log("Click")
        authenticate()
    };

    return (
        <HeaderContainer>
            <h1>Wallet Chief</h1>
            <HeaderLeft>
                <EthPrice
                    currentEthPrice={currentEthPrice}
                    setCurrentEthPrice={setCurrentEthPrice}
                />
                <h2><ConnectButton onClick={HandleAuthenticateClick}>Connect</ConnectButton></h2>
            </HeaderLeft>
        </HeaderContainer>
    )
}
const ConnectButton = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0px 40px;
    padding: 0px 40px;
    height: 40px;
    color: ${props => props.theme.text.white};
    background-color: ${props => props.theme.colors.purple};
    justify-content: center;
    align-items: center;
`
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


export default Header
