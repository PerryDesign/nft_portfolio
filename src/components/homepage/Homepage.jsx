import React from 'react';
import styled from 'styled-components';
import HeroImg from '../../HeroImg.png'


const Homepage = ({currentPage, setCurrentPage}) => {

    const heroButtonHandler = () => {
        setCurrentPage("port_explorer");
    }

  return (
      <HomepageContainer>
          <HeroDiv>
              <HeroTextContainer>
                <h1><HeroHeadline>Providing Refuge from the open seas</HeroHeadline></h1>
                <h3><HeroSupporting>Explore NFT holdings, ROI and historical transactions for any ETH wallet. Subscribe to the real winners and get notifications on transactions.</HeroSupporting></h3>
                <HeroButton onClick={heroButtonHandler}>Explore</HeroButton>
              </HeroTextContainer>
            <StyledHeroImgContainer><StyledHeroImg src={HeroImg}/></StyledHeroImgContainer>
          </HeroDiv>
      </HomepageContainer>
  )
};

const HomepageContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 60px 0px ;
    
`
const HeroDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.purple};
    border-radius: 20px;
    width: 80vw;
    height: 400px;
    `
const StyledHeroImgContainer = styled.div`
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    /* width: 80vw; */
    /* box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px; */
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
    background-color: ${props => props.theme.background.four};
    margin-right: -30px;
    `
const StyledHeroImg = styled.img`
    height: 340px;
`
const HeroTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.background.white};
    padding: 10px 30px;
`
const HeroHeadline = styled.div`
    font-size: 30px;
    font-weight: 700;
    text-align: left;
    color: ${props => props.theme.text.white};
    `
const HeroSupporting = styled.div`
    text-align: left;
    font-size: 20px;
    /* font-weight: 700; */
    color: ${props => props.theme.text.white};
`

const HeroButton = styled.div`
    margin: 40px 20px;
    display:flex;
    flex-direction: row;
    align-items: center;
    border-radius: 4px;
    padding: 5px 20px;
    width: fit-content;
    color: white;
    background-color: ${props => props.theme.colors.blue};
    :hover {
        background-color: ${props => props.theme.colors.blueDark};
    };
`

export default Homepage;
