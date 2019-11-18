import React from 'react';
import { shallow } from 'enzyme';
import jest from 'jest-mock';
import CurrencyDisplay from './index';
describe('CurrencyDisplay', () => {
  let component;
  beforeEach(() => {
    const props = {
        currency: 'EUR',
        onChangeCurrency: jest.fn(),
        balance: 100.00,
        amount: 1,
        amountChange: jest.fn(),
        readOnly: false,
        prefix: '-',
    }
    component = shallow(<CurrencyDisplay {...props} />);
  });
  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });
});