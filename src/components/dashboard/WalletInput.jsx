import React from 'react'
import styled from 'styled-components';
import {Search} from '@styled-icons/bootstrap'

const WalletInput = ({walletInputFieldText,setWalletInputFieldText,activeWalletID,setActiveWalletID,status,setStatus,currentUser}) => {

    // Functions
    const labelInputHandler = (e) => {
        var inputType = e.target.id;
        var inputValue = e.target.value;
        setWalletInputFieldText(inputValue);
    }
    const fetchButtonHandler = () => {
        if(!currentUser.address){
            alert("Please connect your wallet before exploring :)")
        }else if(status == 'ready' || status === 'fetched'){
            setActiveWalletID(walletInputFieldText);
            setStatus('start_fetch');
        }
    }

    return (
        <WalletInputContainer>
                <AddressInput type="text" placeholder="Enter wallet address" value={walletInputFieldText} onChange={labelInputHandler} id={'WalletInputField'}></AddressInput>
                {/* <FetchButton  onClick={fetchButtonHandler}/> */}
                <IconButtonDiv id={'hist'} onClick={fetchButtonHandler}><StyledSearch/></IconButtonDiv>
        </WalletInputContainer>
    )
}


// styling
const WalletInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px 30px;
    background-color: ${props => props.theme.background.four};
    height: 50px;
`

const IconButtonDiv = styled.button`
    margin: 0px 5px;
    min-width: 29px;
    width: 33px;
    height: 30px;
    color: white;
    background-color: ${props => props.theme.colors.purple};
    border-radius: 4px;
    border-style: none;
    :focus {
        outline:0;
    }
    :hover {
        background-color: ${props => props.theme.colors.purpleDark};
    }
`
const StyledSearch = styled(Search)`
    height: 15px;
    width: 15px;
`
const AddressInput = styled.input`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: solid;
    border-width: 0 0 1px 0;
    margin-right: 10px;
    width:100%;
`

export default WalletInput
