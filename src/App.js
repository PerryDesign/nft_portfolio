import React, {useState,useEffect, useRef} from 'react';
import styled, {them, ThemeProvider} from 'styled-components';
import { lighten, darken } from 'polished'
import { useMoralis } from "react-moralis";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {ReactNotifications} from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import MainApp from './components/MainApp';
import Header from './components/header/Header'
import TrackedWalletsPage from './components/trackedWallets/TrackedWalletsPage';
import Homepage from './components/homepage/Homepage';
import Sidebar from './components/sidebar/Sidebar';

function App() {

  const [currentUser, setCurrentUser] = useState('');
  const [currentEthPrice, setCurrentEthPrice] = useState('');
  const [trackedWallets, setTrackedWallets] = useState([]);
  const previousTrackedWallets = useRef([]);
  const [currentPage, setCurrentPage] = useState('homepage');


  const { isAuthUndefined, isAuthenticated, user, logout } = useMoralis();
  useEffect(()=>{
    console.log('isAuthUndefined = '+isAuthUndefined);
    if(!isAuthUndefined){
      if(isAuthenticated){
        var ethAddress = user.get("accounts");
        var email = user.get("email");
        var trackingEmail = user.get("trackingEmail");
        setCurrentUser({
          address: ethAddress[0],
          email: {
            address: email,
            toggle: trackingEmail,
          },
        });
      }else{
        setCurrentUser(false);
        setTrackedWallets([]);
      }
    }
  },[isAuthenticated])
  useEffect(()=>{
    console.log(trackedWallets.slice())
    console.log(previousTrackedWallets.current.slice())
    previousTrackedWallets.current = trackedWallets;
  },[trackedWallets])

  return (
    <ThemeProvider theme={getThemeInformation}>
    <FontSupply>
        <ReactNotifications/>
        <AppWrapper>
          <Header
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              currentEthPrice={currentEthPrice}
              setCurrentEthPrice={setCurrentEthPrice}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
          />
          {/* <Sidebar
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          /> */}
          <PagesWrapper>
            <PageContainer visible={currentPage ==='port_explorer'}>
              <MainApp
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                currentEthPrice={currentEthPrice}
                trackedWallets={trackedWallets}
                setTrackedWallets={setTrackedWallets}
                previousTrackedWallets={previousTrackedWallets}
              />
            </PageContainer>
            <PageContainer visible={currentPage ==='tracked_wallets'}>
              <TrackedWalletsPage
                currentUser={currentUser}
                currentEthPrice={currentEthPrice}
                trackedWallets={trackedWallets}
                setTrackedWallets={setTrackedWallets}
                previousTrackedWallets={previousTrackedWallets}
              />
            </PageContainer>
            <PageContainer visible={currentPage ==='homepage'}>
              <Homepage
                currentUser={currentUser}
                currentEthPrice={currentEthPrice}
                trackedWallets={trackedWallets}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </PageContainer>
          </PagesWrapper>
        </AppWrapper>
    </FontSupply>
    </ThemeProvider>
  );
}

const PageContainer = styled.div`
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
`
const AppWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`
const PagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

var getThemeInformation = (function(){
  var theme = {
    uiColor: '#FAFAFA',
    backgroundColor: '#FAFAFA',
    textColor:'#6B6B6B'
  }
  return {
      background: {
        back: '#FAFAFA',
        four: lighten(0.2, theme.backgroundColor),
        three: darken(0.01, theme.backgroundColor),
        two: darken(0.05, theme.backgroundColor),
        one: darken(0.1, theme.backgroundColor)
      },
      text: {
        link: 'blue',
        white: 'white',
        four: lighten(0.2, theme.textColor),
        four: lighten(0.1, theme.textColor),
        three: lighten(0.0, theme.textColor),
        two: darken(0.2, theme.textColor),
        one: darken(0.3, theme.textColor)
      },
      ui: {
        back: '#FAFAFA',
        four: darken(0.1, theme.uiColor),
        three: darken(0.2, theme.uiColor),
        two: darken(0.3, theme.uiColor),
        one: darken(0.4, theme.uiColor)
      },
      colors: {
        green: '#23EB87',
        red: '#F06565',
        blue: '#00DEFF',
        blueDark: darken(.1,'#00DEFF'),
        purple: '#8A2BE2',
        purpleDark: darken(.1,'#8A2BE2'),
        text: '#939598'
      }
  }
})();
const FontSupply = styled.div`
  /* @import url("https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap");
  @import url("https://fonts.googleapis.com/css?family=OpenSans:300,400,700&display=swap"); */
  text-align: center;
  font-weight: 400;
  font-family: "Montserrat", sans-serif;

  height: 100%;
  /* position: absolute;
  left: 0; */
  /* width: 100%; */
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.theme.background.back};

  & h1 {
    font-weight: 800;
    font-size: 30px;
    color: ${props => props.theme.text.one}
  }
  & h2 {
    font-weight: 800;
    font-size: 20px;
    color: ${props => props.theme.text.two};
    margin: 0px;
  }
  & h3 {
    font-size: 16px;
    font-weight: 100;
    color: ${props => props.theme.text.two};
    margin: 0px;
  }
  & h4 {
    font-size: 16px;
    font-weight: 100;
    color: ${props => props.theme.text.three};
    margin: 0px;
  }
  & h5 {
    font-weight: 100;
    font-size: 12px;
    color: ${props => props.theme.text.four};
    margin: 0px;
  }
  & h6 {
    font-weight: 400;
    font-size: 16px;
    color: inherit;
    margin: 0px;
    /* font-family: "Inter", sans-serif; */
  }
  & a {
    color: inherit;
    /* color: ${props => props.theme.text.link}; */
    text-decoration: none;
    text-overflow: inherit;
  }
  & a:hover {
    color: ${props => props.theme.text.link};
    text-decoration: none;
  }
`;


export default App