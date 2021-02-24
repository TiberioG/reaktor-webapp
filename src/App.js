import React from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    color: red;
  }
`;

const App = () => {
  let string = 'hello';
  return (
    <>
      <GlobalStyle />
      <div>hello</div>
    </>
  );
};

export default App;
