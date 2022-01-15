import React from 'react';
import styled, {them, ThemeProvider} from 'styled-components';
import { lighten, darken } from 'polished'


import MainApp from './components/MainApp';

var getThemeInformation = (function(){
  var theme = {
    uiColor: '#FAFAFA',
    backgroundColor: '#FAFAFA',
    textColor:'#6B6B6B'
  }
  return {
      background: {
        back: '#FAFAFA',
        four: lighten(0.2, theme.backgroundColor),
        three: darken(0.01, theme.backgroundColor),
        two: darken(0.05, theme.backgroundColor),
        one: darken(0.1, theme.backgroundColor)
      },
      text: {
        link: 'blue',
        white: 'white',
        four: lighten(0.2, theme.textColor),
        four: lighten(0.1, theme.textColor),
        three: lighten(0.0, theme.textColor),
        two: darken(0.2, theme.textColor),
        one: darken(0.3, theme.textColor)
      },
      ui: {
        back: '#FAFAFA',
        four: darken(0.1, theme.uiColor),
        three: darken(0.2, theme.uiColor),
        two: darken(0.3, theme.uiColor),
        one: darken(0.4, theme.uiColor)
      },
      colors: {
          green: '#23EB87',
          red: '#F06565',
          blue: '#00DEFF',
          purple: '#8A2BE2',
          text: '#939598'
      }
  }
})();


function App() {
  return (
    <div className="App">
      <ThemeProvider theme={getThemeInformation}>
        <FontSupply>
          <MainApp/>
        </FontSupply>
      </ThemeProvider>
    </div>
  );
}

const FontSupply = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap");
  @import url("https://fonts.googleapis.com/css?family=Inter:200,400,700&display=swap");
  @import url("https://fonts.googleapis.com/css?family=OpenSans:300,400,700&display=swap");
  text-align: center;
  font-weight: 400;
  font-family: "Montserrat", sans-serif;
  & h1 {
    font-weight: 800;
    font-size: 30px;
    color: ${props => props.theme.text.one}
  }
  & h2 {
    font-weight: 800;
    font-size: 20px;
    color: ${props => props.theme.text.two};
    margin: 0px;
  }
  & h3 {
    font-size: 16px;
    font-weight: 100;
    color: ${props => props.theme.text.two};
    margin: 0px;
  }
  & h4 {
    font-size: 16px;
    font-weight: 100;
    color: ${props => props.theme.text.three};
    margin: 0px;
  }
  & h5 {
    font-weight: 100;
    font-size: 12px;
    color: ${props => props.theme.text.four};
    margin: 0px;
  }
  & h6 {
    font-weight: 400;
    font-size: 16px;
    color: inherit;
    margin: 0px;
    font-family: "Inter", sans-serif;
  }
  & a {
    color: inherit;
    /* color: ${props => props.theme.text.link}; */
    text-decoration: none;
    text-overflow: inherit;
  }
  & a:hover {
    color: ${props => props.theme.text.link};
    text-decoration: none;
  }
`;

export default App