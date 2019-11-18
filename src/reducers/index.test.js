import reducer from './index';

describe('post reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
        pockets: {
            USD: 100.00,
            GBP: 100.00,
            EUR: 100.00,
        },
        loading: false,
    }
    expect(reducer(undefined, {})).toEqual(initialState);
  });
});