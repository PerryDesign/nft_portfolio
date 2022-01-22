import React, { useState } from 'react';
import styled from 'styled-components';
import Moralis from 'moralis';

const TrackerSettings = () => {

    const handleUserDataSave = async (e) => {
        var trackingMethods = {
            email: emailToggle,
        }
        const params = {
            email: emailInputField,
            trackingMethods: trackingMethods
          };
        const watch = await Moralis.Cloud.run("adjustUserSettings", params);
        if (watch){
            console.log("sucecess!")
        };
    }
    const labelInputHandler = (e) => {
        var inputType = e.target.id;
        var inputValue = e.target.value;
        setEmailInputField(inputValue);
    }
    const checkboxHandler = (e) => {
        var inputType = e.target.id;
        var inputValue = e.target.value;
        setEmailToggle(inputValue);
    }

    const [emailInputField,setEmailInputField] = useState('');
    const [emailToggle,setEmailToggle] = useState(true);

  return (
    <TrackerSettingsContainer>
        <h2>Tracking Settings</h2>
        <EmailSettingsContainer>
            <InputContainer>
                <h3>Email</h3><EmailInput onChange={labelInputHandler} value={emailInputField}/>
            </InputContainer>
            <LabeledCheckbox><h3>Use Email</h3><StyledCheckbox type="checkbox" onChange={checkboxHandler} value={emailToggle}/> </LabeledCheckbox>
        </EmailSettingsContainer>
        <SaveWalletSettingsButton onClick={handleUserDataSave}>Save</SaveWalletSettingsButton>
    </TrackerSettingsContainer>
    );
};

const TrackerSettingsContainer = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100%;
    background-color: ${props => props.theme.background.four};
    padding: 20px 30px;
`

const EmailSettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 10px;
    margin: 10px;
    width: 70%;
    /* border: solid 1px ${props => props.theme.ui.four};
    border-radius: 4px; */
`
const InputContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 0px;
    width: 100%;
`
const EmailInput = styled.input`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: solid;
    border-width: 0 0 1px 0;
    margin-left: 50px;
    width:100%;
`
const LabeledCheckbox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: space-between; */
    margin-top: 20px;
    width: 100%;
`
const StyledCheckbox = styled.input`
    margin-left: 30px;
    width: 16px;
    height: 16px;
    /* position: relative; */
    outline: none;
    background: ${props => props.theme.ui.three};
    border: solid 1px ${props => props.theme.colors.blue};
    :hover {
        background-color: ${props => props.theme.colors.blue};
    }
`
const SaveWalletSettingsButton = styled.div`
    /* align-self: flex-end; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text.white};
    background-color: ${props => props.theme.colors.blue};
    border-radius: 4px;
    padding: 3px 10px;
    margin-left: 30px;
    :hover {
        background-color: ${props => props.theme.colors.blueDark};
        color: ${props => props.theme.text.white};
    }
`

export default TrackerSettings;
