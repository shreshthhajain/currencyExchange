import React from 'react';
import {FormattedNumber, IntlProvider} from 'react-intl';
import './index.css';

const CurrencyDisplay = (props) => {
    const backgroundColor = props.prefix === '-' ? '#fff' : '#ECECEC';
    return (
        <div className="outerDiv" style={{backgroundColor: backgroundColor}}>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <select value={props.currency} className="selectStyle" onChange={(event) =>props.onChangeCurrency(event)}>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
          <input type="number" className="inputStyle" value={props.amount} placeholder='0' onChange={(event) =>props.amountChange(event)} readOnly={props.readOnly}></input>
        </div>
        <div>Balance: <span className={props.prefix === '-' && props.amount > props.balance ? 'invalidBalance' : ''}><IntlProvider locale='en'><FormattedNumber style="currency" value={props.balance} currency={props.currency}/></IntlProvider></span> </div>
      </div>
    );
}
export default CurrencyDisplay;