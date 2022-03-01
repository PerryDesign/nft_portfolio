import React from 'react'
import styled from 'styled-components';

const Notification = ({type,message}) => {

    const LinkButtonHandlerProductPage = (e) => {
        console.log(e.target.id);
    }

    return(
        <NotificationDiv>
            <SuccessDiv type={type}>
                <Headline>{type}</Headline>
                {message}
            </SuccessDiv>
            <ErrorDiv type={type}>
                <Headline>{type}</Headline>
                {message}
            </ErrorDiv>
            <AlertDiv type={type}>
                <Headline>{type}</Headline>
                {message}
            </AlertDiv>
            <TrialDiv type={type}>
                <Headline>{type}</Headline>
                {message}
                <InfoButton onClick={LinkButtonHandlerProductPage}> Datamosh 2 </InfoButton>
            </TrialDiv>

        </NotificationDiv>
    )
}

const NotificationDiv = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing:border-box;
    align-items: center;
    width: 100%;
    font-family: "Montserrat", sans-serif;
`
const AlertDiv = styled.div`
    width: 100%;
    display: ${props => props.type == 'alert' ? 'flex' : 'none'};
    flex-direction: column;
    border-radius: 4px;
    background-color: ${props => props.theme.colors.blue};
    color: white;
    padding: 10px;
`
const SuccessDiv = styled.div`
    width: 100%;
    display: ${props => props.type == 'success' ? 'flex' : 'none'};
    flex-direction: column;
    border-radius: 4px;
    background-color: ${props => props.theme.colors.blue};
    color: white;
    padding: 10px;
`
const ErrorDiv = styled.div`
    width: 100%;
    display: ${props => props.type == 'error' ? 'flex' : 'none'};
    flex-direction: column;
    border-radius: 4px;
    background-color: ${props => props.theme.colors.red};
    color: white;
    padding: 10px;
`
const TrialDiv = styled.div`
    width: 100%;
    display: ${props => props.type == 'trial error' ? 'flex' : 'none'};
    flex-direction: column;
    border-radius: 4px;
    background-color: ${props => props.theme.colors.blue};
    color: white;
    padding: 10px;
`

const Headline = styled.div`
    font-weight: bold;
    margin-bottom: 5px;
    width:100%;
    text-align:left;
`

const InfoButton = styled.div`
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0px 10px;
    margin: 10px 0px 0px;
    height: 33px;
    color: white;
    background-color: ${props => props.theme.colors.purple};
    border-radius: 4px;
    border-style: none;
    :focus {
        outline:0;
    }
    :hover {
        background-color: ${props => props.theme.background.dark};
    }
`

export default Notification