import React, { useState, useMemo, useEffect } from 'react'
import { useTable, useGlobalFilter } from 'react-table'
import {COLUMNS} from './columns'


export const BasicTable = ({activeAssets,currencyType,walletSearchString,setWalletSearchString}) => {
    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => activeAssets, [activeAssets]);
    const [hiddenStateColumns, setStateHiddenColumns] = useState([])

    useEffect(()=>{
        if(currencyType == 'percent') setStateHiddenColumns(['roiEth','roiDollar','roiHist']);
        if(currencyType == 'eth') setStateHiddenColumns(['roiPercent','roiDollar','roiHist']);
        if(currencyType == 'dollar') setStateHiddenColumns(['roiEth','roiPercent','roiHist']);
        if(currencyType == 'hist') setStateHiddenColumns(['roiEth','roiPercent','roiDollar']);
    },[currencyType])
    useEffect(()=>{
        setHiddenColumns(hiddenStateColumns)
    },[hiddenStateColumns])
    useEffect(()=>{
        setGlobalFilter(walletSearchString)
    },[walletSearchString])

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setHiddenColumns,setGlobalFilter, state} = useTable({
        columns,
        data,
        initialState: {
            hiddenColumns: hiddenStateColumns
        },
    }, useGlobalFilter);

    const { globalFilter } = state;

    return (
        <table {...getTableProps}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
            
        </table>
    )
}


