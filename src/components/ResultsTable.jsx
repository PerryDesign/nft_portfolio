import React, {useState} from 'react'
import styled from 'styled-components'
import {BasicTable} from './BasicTable'
import { GlobalFilter } from './GlobalFilter'
import LoadingAnimation from './LoadingAnimation'


const ResultsTable = ({activeAssets,currencyType, status,fetchStatus}) => {



    const [walletSearchString, setWalletSearchString] = useState('');



    return (
        <ResultsTableContainer>
            <GlobalFilter 
                walletSearchString={walletSearchString}
                setWalletSearchString={setWalletSearchString}
            />
            <StyledTable>
                <BasicTable
                    activeAssets={activeAssets}
                    currencyType={currencyType}
                    walletSearchString={walletSearchString}
                    setWalletSearchString={setWalletSearchString}
                />
            </StyledTable>
            <FetchingStatusContainer visible={status === 'start_fetch'}>
              <StyledLoadingBlob >
                <LoadingAnimation/>
              </StyledLoadingBlob>
              <h5><StyledStatus>{fetchStatus}</StyledStatus></h5>
            </FetchingStatusContainer>
        </ResultsTableContainer>
    )
}

const ResultsTableContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.background.four};
    width: 100%;
`
const FetchingStatusContainer = styled.div`
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-content: center;
  margin: 10px 30px;
`
const StyledLoadingBlob = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
  padding: 5px 20px;
`
const StyledStatus = styled.div`
  background-color: ${props => props.theme.colors.purple};
  padding: 5px 20px;
  color: ${props => props.theme.text.white};
  border-radius: 4px;
  width: 150px;
`



const StyledTable = styled.div`
width:100%;
table tr:nth-child(even){background-color: ${props => props.theme.background.three};}
 table {
   border-spacing: 0;

   tr {
    :hover {
        background-color: ${props => props.theme.background.one};
    }
     :last-child {
       td {
         border-bottom: 0;
       }
     }
   }
   td {
      padding: 0.5rem;
      color: ${props => props.theme.text.three};
      font-weight: 400;
      font-size: 16px;
     :last-child {
       border-right: 0;
     }
   }
  
   th {
     color: ${props => props.theme.text.four};
     font-weight: 400;
     font-size: 12px;
     
   }
 }
`



export default ResultsTable
