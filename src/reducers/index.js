const initialState = {
    pockets: {
        USD: 100.00,
        GBP: 100.00,
        EUR: 100.00,
    },
    loading: false,
}

const reducer = (state = initialState, action) => {

    switch (action.type) {
      case 'GET_CURRENT_CURRENCY_RATES':
           return { ...state, loading: true };
      case 'GET_CURRENT_CURRENCY_RATES_SUCCESS':
           return { ...state, rates: action.rates, loading: false }
      case 'UPDATE_POCKETS':
          return { ...state, pockets: action.pockets};
      default: 
           return state;
    }
   };
   export default reducer;