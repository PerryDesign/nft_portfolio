import React from 'react'
import styled from 'styled-components'
import {ToggleOff} from '@styled-icons/material-rounded'

const IncludeTransfersToggle = ({useTransfersInCalc,setUseTransfersInCalc}) => {

    const handleClick = () =>{
        setUseTransfersInCalc(!useTransfersInCalc)
    }

    
    return (
        <IncludeTransfersContainer>
            <h3>Include Transfers</h3>
            <StyledToggleOff value={useTransfersInCalc} onClick={handleClick}/>
            
        </IncludeTransfersContainer>
    )
}

export default IncludeTransfersToggle

const IncludeTransfersContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    background-color: ${props => props.theme.background.four};
    height: 50px;
    text-align: left;
    padding: 0px 30px;
`

const StyledToggleOff = styled(ToggleOff)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    height: 50px;
    transform: ${props => props.value ? 'rotate(0)' : 'rotate(-180deg)'};
    color: ${props => !props.value ? props.theme.ui.three : props.theme.ui.one};
    :hover {
        color: ${props => props.theme.ui.two};
    }
`