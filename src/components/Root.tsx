import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import theme from 'styles/theme';

import App from './App';

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache(),
});

const Root: React.FC = () => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </ApolloProvider>
);

export default Root;
