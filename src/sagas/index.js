import { put, takeLatest, all } from 'redux-saga/effects';
function* fetchNews() {
  const json = yield fetch("https://openexchangerates.org/api/latest.json?app_id=a39274f5479a4186878053e4fc64482f")
        .then(response => response.json(), );    
  yield put({ type: "GET_CURRENT_CURRENCY_RATES_SUCCESS", rates: json.rates });
}
function* actionWatcher() {
     yield takeLatest('GET_CURRENT_CURRENCY_RATES', fetchNews)
}
export default function* rootSaga() {
   yield all([
   actionWatcher(),
   ]);
}