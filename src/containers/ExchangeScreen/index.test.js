import React from 'react';
import { shallow } from 'enzyme';
import jest from 'jest-mock';
import { ExchangeScreen } from './index';
describe('ExchangeScreen', () => {
  let component;
  beforeEach(() => {
    const props = {
        rates: {
            USD: 1,
            GBP: 1.30,
            EUR: 1.11,
        },
        pockets: {
            USD: 100.00,
            GBP: 100.00,
            EUR: 100.00,
        },
        getCurrentCurrencyRate: jest.fn(),
        updatePockets: jest.fn(),
    }
    component = shallow(<ExchangeScreen {...props} />);
  });
  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });
  it('Exchange button click should call updatePockets', () => {
    const updatePockets = jest.spyOn(component.instance(), 'updatePockets');
    component.update();
    component
      .find('#exchange-button')
      .simulate('click');
    expect(updatePockets).toHaveBeenCalled();
  });
  it('Image click should call toggleCurrency method', () => {
    const toggleCurrency = jest.spyOn(component.instance(), 'toggleCurrency');
    component.update();
    component
      .find('#toggleCurrency')
      .simulate('click');
    expect(toggleCurrency).toHaveBeenCalled();
  });
  it('Validate if rate conversion is called with proper params when toggle image is clicked', () => {
    const state = {
        exchangedAmount: 1.30,
        fromCurrency: 'EUR',
        toCurrency: 'USD',
    };
    component.setState(state);
    const toggleCurrency = jest.spyOn(component.instance(), 'toggleCurrency');
    const rateConversion = jest.spyOn(component.instance(), 'rateConversion');
    component.update();
    component
      .find('#toggleCurrency')
      .simulate('click');
    expect(toggleCurrency).toHaveBeenCalled();
    expect(rateConversion).toHaveBeenCalledWith(1.30, 'USD', 'EUR');
  });
  it('Validate if rate conversion is called with proper params when fromCurrency is changed', () => {
    const state = {
        amount: 1,
        fromCurrency: 'EUR',
        toCurrency: 'USD',
    };
    const event = {
        target: {
            value: 'USD',
        }
    };
    component.setState(state);
    const rateConversion = jest.spyOn(component.instance(), 'rateConversion');
    component.update();
    component.instance().onChangeFromCurrency(event);
    expect(rateConversion).toHaveBeenCalledWith(1, 'USD', 'EUR');
  });
  it('Validate if rate conversion is called with proper params when toCurrency is changed', () => {
    const state = {
        amount: 1,
        fromCurrency: 'EUR',
        toCurrency: 'USD',
    };
    const event = {
        target: {
            value: 'GBP',
        }
    };
    component.setState(state);
    const rateConversion = jest.spyOn(component.instance(), 'rateConversion');
    component.update();
    component.instance().onChangeToCurrency(event);
    expect(rateConversion).toHaveBeenCalledWith(1, 'EUR', 'GBP');
  });
  it('Validate if state set properly in RateConversion method', () => {
    const instance = component.instance();
    const state = {
        fromCurrency: 'USD',
    };
    component.setState(state);
    expect(component.state('fromCurrency')).toBe('USD');
    instance.rateConversion(1, 'EUR', 'USD');
    expect(component.state('fromCurrency')).toBe('EUR');
    expect(component.state('amount')).toBe(1);
    expect(component.state('exchangedAmount')).toBe(1.11);
    expect(component.state('currencyRate')).toBe(1.11);
  });
  it('Check if restrictDecimalPlaces returning correct output if input is having three digits after decimal ', () => {
    const instance = component.instance();
    const amount = instance.restrictDecimalPlaces(1.456);
    expect(amount).toBe(1.45);
  });
  it('Check if restrictDecimalPlaces returning correct output if input is having one digit after decimal ', () => {
    const instance = component.instance();
    const amount = instance.restrictDecimalPlaces(1.4);
    expect(amount).toBe(1.4);
  });
  it('Check if restrictDecimalPlaces returning correct output if input is having np digit after decimal ', () => {
    const instance = component.instance();
    const amount = instance.restrictDecimalPlaces(12);
    expect(amount).toBe(12);
  });
});