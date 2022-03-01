import React, { useState } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import styled from 'styled-components';
import 'react-pro-sidebar/dist/css/styles.css';
import {CloseOutline} from '@styled-icons/evaicons-outline'
import {Menu as MenuIcon} from '@styled-icons/heroicons-outline'
import logo from '../../Wallet_Port.svg'
import icon from '../../Wallet_Port_icon.svg'

const Sidebar = ({setCurrentPage,currentPage}) => {

  const [SidebarClosed,setSidebarClosed] = useState(true);
  const handleSidebarToggle = (e) => {
    setSidebarClosed(!SidebarClosed);
  }
  const TabClickHandler = (e) => {
    var value = e.target.id;
    console.log(value);
    if(currentPage !== value) setCurrentPage(value);
}

  return(
    <ProSidebar
      collapsed={SidebarClosed}
    >
    <Menu iconShape="square">
        <LogoContainer>
          {SidebarClosed ? <LogoImg src={icon} onClick={TabClickHandler} id={'homepage'}/> : <LogoImg src={logo} onClick={TabClickHandler} id={'homepage'}/>}
        </LogoContainer>
      <ToggleDiv>
        {!SidebarClosed ? <StyledMenu onClick={handleSidebarToggle}/> : <StyledClose onClick={handleSidebarToggle}/>}
      </ToggleDiv>
      <MenuItem icon={"O"}>Dashboard</MenuItem>
      <SubMenu title="Components" icon={"N"}>
        <MenuItem>Component 1</MenuItem>
        <MenuItem>Component 2</MenuItem>
      </SubMenu>
    </Menu>
  </ProSidebar>
  );
};

const ToggleDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  padding-right: 20px;
`

const StyledClose = styled(CloseOutline)`
  width: 30px;
`
const StyledMenu = styled(MenuIcon)`
  width: 30px;
`
const LogoContainer = styled.div`
  margin-left: 40px;
  display:flex;
  flex-direction: row;
  align-items: center;
  width: 200px;
`


const LogoImg = styled.img`
    width: 200px;
`

export default Sidebar;
