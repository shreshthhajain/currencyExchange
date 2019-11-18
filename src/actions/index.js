export const getNews = () => ({
    type: 'GET_CURRENT_CURRENCY_RATES',
});

export const updatePockets = (pockets) => ({
    type: 'UPDATE_POCKETS',
    pockets,
})