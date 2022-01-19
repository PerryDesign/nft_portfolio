import React from 'react'
import styled from 'styled-components';
import EthPrice from '../EthPrice';
import { ReactComponent as Logo } from '../../Wallet_Port.svg';
import HeaderAccount from './HeaderAccount';

const Header = ({currentUser,setCurrentUser,currentEthPrice,setCurrentEthPrice,}) => {

    return (
        <HeaderContainer>
            <LogoContainer>
                <Logo/>
            </LogoContainer>
            <HeaderLeft>
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


export default Header
