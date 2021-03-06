import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';

import { LOGIN_FACEBOOK } from './constants';
import { loginFacebookSuccess, loginFacebookError } from './actions';
import { postRequest } from 'utils/request';
import { AUTH_URL } from 'global_constants';
import { selectLogin, selectPassword } from './selectors';


export function* loginFacebookSaga() {
  const login = yield select(selectLogin());
  const password = yield select(selectPassword());
  const requestURL = `${AUTH_URL}/auth/facebook`;
  const body = {
    login,
    password,
  };

  const authData = yield call(postRequest, requestURL, body);
  if (authData.status === 200) {
    yield put(loginFacebookSuccess(authData.data));
    yield put(push('/dashboard'));
  } else {
    yield put(loginFacebookError(authData.data.errors));
  }
}


export function* authWatcher() {
  while (yield take(LOGIN_FACEBOOK)) {
    yield call(loginFacebookSaga);
  }
}


export function* authSaga() {
  const watcher = yield fork(authWatcher);


  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  authSaga,
];
