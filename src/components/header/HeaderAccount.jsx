import React from 'react'
import styled from 'styled-components';
import {LogOut} from '@styled-icons/entypo'
import { useMoralis } from "react-moralis";

const HeaderAccount = ({currentUser,setCurrentUser}) => {
    
    const { authenticate, isAuthenticated, user, logout } = useMoralis();
    const HandleAuthenticateClick = async () => {
        if (isAuthenticated) {
            return null
        } else {
            // show the signup or login page
            console.log("Click")
            await authenticate();
            console.log(isAuthenticated)
        }
    };

    const HandleLogout = async () => {
        console.log('Logging out');
        logout()
    }

    return (
        <HeaderAccountContainer>
                <AccountButtonContainer user={currentUser}>
                    <h3><ConnectButton user={currentUser} onClick={HandleAuthenticateClick}>{isAuthenticated ? currentUser : 'Connect'}</ConnectButton></h3>
                </AccountButtonContainer>
                <IconButtonDiv user={currentUser} onClick={HandleLogout}><StyledLogOut/></IconButtonDiv>
        </HeaderAccountContainer>
    )
}

const HeaderAccountContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0px 40px;
`

const AccountButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.user ? 'none' : props.theme.colors.purple};
    padding: 5px 40px;
    border: ${props => props.user ? '2px solid '+props.theme.colors.purple : 'none'};
    border-radius: 4px;
    `
const ConnectButton = styled.div`
    display: flex;
    white-space: nowrap;
    flex-direction: column;
    justify-content: center;
    height: 30px;
    width: 100px;
    min-width: 0px;
    color: ${props => props.user ? props.theme.colors.purple : props.theme.text.white};
    overflow: hidden; 
    text-overflow: ellipsis;
    `

const IconButtonDiv = styled.button`
    display: ${props => props.user ? 'flex' : 'none'};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0px 5px;
    min-width: 29px;
    width: 33px;
    height: 40px;
    color: white;
    background-color: ${props => props.theme.colors.purple};
    border-radius: 4px;
    border: none;
    :focus {
        outline:0;
    }
    :hover {
        background-color: ${props => props.theme.ui.two};
    }
`

const StyledLogOut = styled(LogOut)`
    height: 15px;
`

export default HeaderAccount
