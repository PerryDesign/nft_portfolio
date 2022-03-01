import React, {useEffect} from 'react'
import styled from 'styled-components'
import Moralis from "moralis";
import { useMoralis } from "react-moralis";
import {numberWithCommas} from '../lib/numberWithCommas'

const EthPrice = ({currentEthPrice,setCurrentEthPrice}) => {
    const { Moralis, isInitialized, isInitializing } = useMoralis();

    async function getEthPrice(){
        const options = {
            address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          };
        const price = await Moralis.Web3API.token.getTokenPrice(options);
        return price.usdPrice
    }

    useEffect(() => {
        if(isInitialized) getEthPrice().then(price => setCurrentEthPrice(price.toFixed(2)));
    }, [isInitialized])

    return (
        <EthPriceContainer>
            <h5>ETH ${numberWithCommas(currentEthPrice)}</h5>
        </EthPriceContainer>
    )
}

const EthPriceContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color:  none;
    border-style:   solid;
    border-color:  ${props => props.theme.background.two};
    border-width:  2px;
    border-radius: 5px;
    padding: 0px 10px;
    height:22px;
    margin:0px 10px;
`

export default EthPrice
