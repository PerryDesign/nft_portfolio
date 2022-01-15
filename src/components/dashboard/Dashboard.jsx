import React, {useState} from 'react'
import styled from 'styled-components'
import WalletInput from './WalletInput'
import CurrencyToggle from './CurrencyToggle'
import AccountPanel from './AccountPanel'
import DashStatsPanel from './DashStatsPanel'
import IncludeTransfersToggle from './IncludeTransfersToggle'

const Dashboard = ({walletStats,activeWalletID,setActiveWalletID,activeAssets,setActiveAssets,status,setStatus,currencyType,setCurrencyType,currentEthPrice, useTransfersInCalc,setUseTransfersInCalc,walletMetaData}) => {

    const [walletInputFieldText,setWalletInputFieldText] = useState('0x5010EBae2C4d0B300A754AEF5A9d0f739198ec65');

    return (
        <DashboardContainer>
            <GridItem1>
                <WalletInput 
                    walletInputFieldText={walletInputFieldText}
                    setWalletInputFieldText={setWalletInputFieldText}
                    activeWalletID={activeWalletID}
                    setActiveWalletID={setActiveWalletID}
                    activeAssets={activeAssets}
                    setActiveAssets={setActiveAssets}
                    status={status}
                    setStatus={setStatus}
                    />
            </GridItem1>
            <GridItem2>
                <CurrencyToggle
                    activeAssets={activeAssets}
                    currencyType={currencyType}
                    setCurrencyType={setCurrencyType}
                    status={status}
                    setStatus={setStatus}
                />
                <IncludeTransfersToggle
                    useTransfersInCalc={useTransfersInCalc}
                    setUseTransfersInCalc={setUseTransfersInCalc}
                />
            </GridItem2>
            <GridItem3>
                <AccountPanel
                    activeAssets={activeAssets}
                    currencyType={currencyType}
                    status={status}
                    walletMetaData={walletMetaData}
                />
            </GridItem3>
            <GridItem4>
                <DashStatsPanel
                    activeAssets={activeAssets}
                    currencyType={currencyType}
                    status={status}
                    walletStats={walletStats}
                    currentEthPrice={currentEthPrice}
                />
            </GridItem4>


        </DashboardContainer>
    )
}

const DashboardContainer = styled.div`
    display: grid;
    grid-template-columns: 3fr 5fr;
    gap: 20px;
    margin: 20px 0px;
    width: 100%;
`

const GridItem1 = styled.div`
`
const GridItem2 = styled.div`
    display: flex;
    flex-direction: row;
    /* grid-column: 2 / span 2; */
`
const GridItem3 = styled.div`

`
const GridItem4 = styled.div`
    /* grid-column: 2 / span 2; */
`

export default Dashboard
