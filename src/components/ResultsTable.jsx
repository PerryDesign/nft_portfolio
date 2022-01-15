import React from 'react'
import styled from 'styled-components'
import {BasicTable} from './BasicTable'

const ResultsTable = ({activeAssets,currencyType}) => {
    return (
        <ResultsTableContainer>
            <StyledTable>
                <BasicTable
                    activeAssets={activeAssets}
                    currencyType={currencyType}
                />
            </StyledTable>
        </ResultsTableContainer>
    )
}

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

const ResultsTableContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.background.four};
    width: 100%;
`

export default ResultsTable
