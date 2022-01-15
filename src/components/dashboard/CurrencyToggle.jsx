import React from 'react'
import styled from 'styled-components'
import {Percentage} from '@styled-icons/fa-solid'
import {Ethereum} from '@styled-icons/fa-brands'
import {Dollar} from '@styled-icons/foundation'


const CurrencyToggle = ({activeAssets,currencyType,setCurrencyType,status,setStatus}) => {

    const HandleCurrencyPercentButton = (e) => {
        if(currencyType !== 'percent') setCurrencyType('percent')
    }
    const HandleCurrencyEthButton = (e) => {
        if(currencyType !== 'eth') setCurrencyType('eth')
    }
    const HandleCurrencyDollarButton = (e) => {
        if(currencyType !== 'dollar') setCurrencyType('dollar')
    }
    const HandleCurrencyHistButton = (e) => {
        if(currencyType !== 'hist') setCurrencyType('hist')
    }


    return (
        <CurrencyToggleContainer>
            <h3>Currency type</h3>
            <IconHolder>
                <IconButtonDiv id={'percent'} onClick={HandleCurrencyPercentButton}><StyledPercentage/></IconButtonDiv>
                <IconButtonDiv id={'eth'} onClick={HandleCurrencyEthButton}><StyledEthereum/></IconButtonDiv>
                <IconButtonDiv id={'dollar'} onClick={HandleCurrencyDollarButton}><StyledDollar/></IconButtonDiv>
                <IconButtonDiv id={'hist'} onClick={HandleCurrencyHistButton}><StyledDollar/></IconButtonDiv>
            </IconHolder>
        </CurrencyToggleContainer>
    )
}

const CurrencyToggleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    background-color: ${props => props.theme.background.four};
    height: 50px;
    text-align: left;
    padding: 0px 30px;
`
const IconHolder = styled.div`
    display: flex;
    flex-direction: row;
    align-items: left;
    justify-content: baseline;
    margin: 0px 20px;
`

const IconButtonDiv = styled.button`
    margin: 0px 5px;
    min-width: 29px;
    width: 33px;
    height: 30px;
    color: white;
    background-color: ${props => props.theme.ui.three};
    border-radius: 4px;
    border-style: none;
    :focus {
        outline:0;
    }
    :hover {
        background-color: ${props => props.theme.ui.two};
    }
`
const StyledPercentage = styled(Percentage)`
    height:15px;
    width:15px;
`
const StyledEthereum = styled(Ethereum)`
    height:15px;
    width:15px;
`
const StyledDollar = styled(Dollar)`
    height:15px;
    width:15px;
`





export default CurrencyToggle