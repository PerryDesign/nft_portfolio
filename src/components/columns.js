import { ColumnFilter } from "./ColumnFilter"
import styled from "styled-components"
import {numberWithCommas} from './numberWithCommas'



export const COLUMNS = [
    {
        Header: '',
        accessor: 'asset_thumbnail',
        Cell: ({ value }) => (
            <a><ThumbnailPic src={value}/></a>
        )
    },
    {
        Header: 'Position',
        accessor: 'position',
        Cell: ({ value }) => (
            <PositionContainer value={value}>
                <h5>{value}</h5>
            </PositionContainer> 
        )
    },
    {
        Header: 'Collection',
        accessor: 'collection_name',
        Cell: ({ row }) => (
            <CellContainer>
                <a href={row.original.asset_permalink} target="_blank" rel="noopener noreferrer"> {row.original.collection_name} </a>
            </CellContainer>
        )
    },
    {
        Header: 'Name',
        accessor: 'asset_name',
        Cell: ({ row }) => (
            <CellContainer>
                <a href={row.original.asset_permalink} target="_blank" rel="noopener noreferrer"> {row.original.asset_name} </a>
            </CellContainer>
        )
    },
    {
        Header: 'Purchase',
        accessor: 'purchase_price',
        Cell: ({ row }) => (
            <CellContainerNum>
                <a href={'https://etherscan.io/tx/'+row.original.purchase_transaction_hash} target="_blank" rel="noopener noreferrer"> {row.original.purchase_price !== undefined ? parseFloat(row.original.purchase_price).toFixed(2) : 0} </a>
            </CellContainerNum>
        )
    },
    {
        Header: 'Sold',
        accessor: 'sell_price',
        Cell: ({ row }) => {
            var soldDiv = (<CellContainer/>)
            if(row.original.position == 'closed'){
                soldDiv = 
                    (<CellContainerNum type={'sold'} value={row.original.position}>
                        <a href={'https://etherscan.io/tx/'+row.original.sell_transaction_hash} target="_blank" rel="noopener noreferrer"> {row.original.sell_price !== undefined ? parseFloat(row.original.sell_price).toFixed(2) : 0} </a>
                    </CellContainerNum>)
            }
            return soldDiv
        }
    },
    {
        Header: 'MP',
        accessor: 'floor_price',
        Cell: ({ row }) => (
            <CellContainerNum>
                <a href={row.original.asset_permalink} target="_blank" rel="noopener noreferrer"> {row.original.floor_price !== '' ? parseFloat(row.original.floor_price).toFixed(2) : 0} </a>
            </CellContainerNum>
        )
    },
    {
        Header: 'ROI %',
        accessor: 'roiPercent',
        Cell: ({ value }) => (
            <TableROIContatiner>
                <TableROICell value={value-1}>
                    {(value*100-100).toFixed(0)+' %'}
                </TableROICell>
            </TableROIContatiner>
        )
    },
    {
        Header: 'ROI Eth',
        accessor: 'roiEth',
        Cell: ({ value }) => (
            <TableROIContatiner>
                <TableROICell value={value}>
                    {'Ξ '+numberWithCommas(parseFloat(value).toFixed(2))}
                </TableROICell>
            </TableROIContatiner>
        )
    },
    {
        Header: 'ROI $',
        accessor: 'roiDollar',
        Cell: ({ value }) => (
            <TableROIContatiner>
                <TableROICell value={value}>
                    {'$ '+numberWithCommas(parseFloat(value).toFixed(0))}
                </TableROICell>
            </TableROIContatiner>
        )
    },
    {
        Header: 'ROI $',
        accessor: 'roiHist',
        Cell: ({ value }) => (
            <TableROIContatiner>
                <TableROICell value={value}>
                    {'$ '+numberWithCommas(parseFloat(value).toFixed(0))}
                </TableROICell>
            </TableROIContatiner>
        )
    },
]

const ThumbnailPic = styled.img`
    width: 50px;
`
const CellContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    max-width: 200px;
    min-width: 80px;
    padding: 0px 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden; 
`
const CellContainerNum = styled(CellContainer)`
    font-weight: 400;
    font-family: "OpenSans", sans-serif;
    justify-content: right;
`
const PositionContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.value === 'open' ? 'none' : props.theme.background.two};
    border-style:  ${props => props.value === 'closed' ? 'none' : 'solid'};
    border-color:  ${props => props.theme.background.two};
    border-width:  2px;
    border-radius: 5px;
    width:50px;
    height:22px;
    margin:0px 10px;
`

const TableROICell = styled.div`
    height: 26px;
    min-width: 50px;
    padding: 0px 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    color: ${props => props.theme.text.one};
    font-weight: 400;
    font-family: "OpenSans", sans-serif;
    background-color: ${props => props.value < 0 ?  props.theme.colors.red :  props.value > 0 ? props.theme.colors.green : props.theme.background.two};
`
const TableROIContatiner = styled.div`
    min-width: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
