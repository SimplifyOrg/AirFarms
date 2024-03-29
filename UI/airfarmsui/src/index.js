import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CSSReset, ColorModeScript } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './Theme.js'
import { Chakra }from './Chakra.js'
import {createStore} from 'redux'
import allReducers from './reducers'
import {Provider} from 'react-redux'

const store = createStore(allReducers)

ReactDOM.render(
  <React.StrictMode>
    <Chakra theme={theme}>
      <CSSReset />
      <Provider store={store}>
        <App />
      </Provider>
    </Chakra>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
