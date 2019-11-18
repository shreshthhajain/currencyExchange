import React from 'react';
//import './App.css';
import ExchangeScreen from './containers/ExchangeScreen/index';

const exchangeHeading = {
  position: 'absolute',
  marginTop: '-20px',
  backgroundColor: 'white',
  padding: '0px 5px',
  color: 'blue',
}

function App() {
  return (
    <div style={{border: '2px solid lightgray', borderRadius: '10px', padding: '10px'}}>
      <div style={exchangeHeading}>
        Exchange
      </div>
      <ExchangeScreen/>
    </div>
  );
}

export default App;
