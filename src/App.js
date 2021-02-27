import React from 'react';

import { createGlobalStyle } from 'styled-components';
import HomePage from './pages/HomePage';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: "HelveticaNeue", "Helvetica Neue",
    Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #f5f5f5;
    background: #131313;
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <HomePage />
    </>
  );
};

export default App;
