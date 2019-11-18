import React from "react";
import { connect } from 'react-redux';
import CurrencyDisplay from '../../components/CurrencyDisplay';
import Radium from 'radium';
import currencyToggle from './currencyToggle.jpg';
import _ from 'lodash';

const buttonStyle = {
  width: '100%',
  height: '30px',
  display: 'block',
  borderRadius: '15px',
  border: 'none',
  backgroundColor: 'deeppink',
  color: '#fff',
  fontWeight: 'bold',
  marginTop: '20px',
  ':disabled': {
    opacity: '0.5',
  }
};

const spanStyle = {
  margin: '0',
  border: '2px solid lightgray',
  borderRadius: '10px',
  padding: '0px 10px',
  color: 'blue',
};

const currencyLogos = {EUR: "&#8364;", USD: "&#36;", GBP: "&#163;"};

class ExchangeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromCurrency: 'GBP',
      toCurrency: 'EUR',
      amount: '',
      exchangedAmount: '',
      pockets: this.props.pockets,
      isExchangeDisable: false,
      currencyRate: null,
      rates: null,
      isCurrencyExchanged: false,
    };
  }

  componentDidMount(){
    this.props.getCurrentCurrencyRate();
    this.interval = setInterval(() => this.props.getCurrentCurrencyRate(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(this.state, nextState)) {
      return true;
    } else if (!_.isEqual(this.props, nextProps)) {
      return true;
    } else {
      return false;
    }
  }

  restrictDecimalPlaces(enteredAmount) {
    const enteredString = enteredAmount.toString();
    const decimalIndex = enteredString.indexOf(".");
    let amount = enteredAmount;
    if (decimalIndex !== -1 && enteredString.length - decimalIndex > 3) {
      amount = Number(enteredString.substring(0, decimalIndex + 3));
    }
    return amount;
  }

  toggleCurrency() {
    this.rateConversion(this.state.exchangedAmount, this.state.toCurrency, this.state.fromCurrency);
  }

  goBackToExchangeScreen() {
    this.setState({
      ...this.state,
      amount: '',
      exchangedAmount: '',
      isCurrencyExchanged: false,
    })
  }

  rateConversion(enteredAmount, fromCurrency, toCurrency) {
    if(this.props.rates) {
      const amount = this.restrictDecimalPlaces(enteredAmount);
      const currencyRate = this.props.rates[fromCurrency]/this.props.rates[toCurrency];
      const convertedAmount = amount * currencyRate;
      const updatedPockets = {...this.props.pockets};
      updatedPockets[fromCurrency] = updatedPockets[fromCurrency] - amount;
      updatedPockets[toCurrency] = updatedPockets[toCurrency] + (Math.round(convertedAmount * 100) / 100);
      this.setState({
        exchangedAmount: convertedAmount !== 0 ? Math.round(convertedAmount * 100) / 100 : '',
        amount: amount !== 0 ? amount : '', 
        pockets: updatedPockets,
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        isExchangeDisable: (amount > this.props.pockets[fromCurrency]),
        currencyRate: currencyRate,
        rates: this.props.rates,
      });
    }
  }

  onChangeFromCurrency(event) {
    if (event.target.value === this.state.toCurrency) {
      this.rateConversion(this.state.amount, event.target.value, this.state.fromCurrency);
    } else {
      this.rateConversion(this.state.amount, event.target.value, this.state.toCurrency);
    }
  }

  onChangeToCurrency(event) {
    if (event.target.value === this.state.fromCurrency) {
      this.rateConversion(this.state.amount, this.state.toCurrency, event.target.value);
    } else {
      this.rateConversion(this.state.amount, this.state.fromCurrency, event.target.value);
    }
  }

  onChange(event) {
    this.rateConversion(Number(event.target.value),this.state.fromCurrency, this.state.toCurrency);
  }

  updatePockets() {
    this.props.updatePockets(this.state.pockets);
    this.setState({
      ...this.state,
      isCurrencyExchanged: true,
    })
  }

  render() {
    let currencyRateText = '';
    if (this.props.rates) {
       const currencyRate = this.props.rates[this.state.fromCurrency]/this.props.rates[this.state.toCurrency];
       currencyRateText = `1${currencyLogos[this.state.fromCurrency]} = ${Math.round((1/currencyRate) *10000)/10000}${currencyLogos[this.state.toCurrency]}`;
    }
    if (this.state.isCurrencyExchanged) {
      return (
        <div style={{textAlign: 'center'}}>
          <p>Currency Exchanged successfully</p>
          <input type="button" value="Go Back" style={buttonStyle} onClick={()=>this.goBackToExchangeScreen()}></input>
        </div>
      );
    }
    return (
      <div>
        <CurrencyDisplay
          currency={this.state.fromCurrency}
          onChangeCurrency={(event) => this.onChangeFromCurrency(event)}
          balance={this.props.pockets[this.state.fromCurrency]}
          amount={this.state.amount}
          amountChange={(event) => this.onChange(event)}
          readOnly={false}
          prefix='-'
        />
        <div style={{marginTop: '-10px',position: 'absolute', width: '90%'}}>
          <img id="toggleCurrency" src={currencyToggle} style={{paddingLeft:'10px',paddingRight:'40%'}} alt="Currency Toggle" width="20" height="20" onClick={() => this.toggleCurrency()}/>
          <span id="currencyRate" contentEditable='true' ref='currencyRate' style={spanStyle} dangerouslySetInnerHTML={{__html: currencyRateText}}></span>
        </div>
        <CurrencyDisplay
          currency={this.state.toCurrency}
          onChangeCurrency={(event) => this.onChangeToCurrency(event)}
          balance={this.props.pockets[this.state.toCurrency]}
          amount={this.state.exchangedAmount}
          amountChange={(event) => this.onChange(event)}
          readOnly={true}
          prefix='+'
        />
        <input type="button" id="exchange-button" style={buttonStyle} value="Exchange" onClick={() => this.updatePockets()} disabled={this.state.isExchangeDisable || this.state.amount === ''}/>
      </div>
    );
  }
}

const mapStateToProps = state => { return { rates: state.rates, pockets: state.pockets } };

const mapDispatchToProps = dispatch => ({
  getCurrentCurrencyRate: () => dispatch({ type: 'GET_CURRENT_CURRENCY_RATES' }),
  updatePockets: (pockets) => dispatch({ type: 'UPDATE_POCKETS', pockets }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(ExchangeScreen));
// The following export is just for unit test.
export { ExchangeScreen };
