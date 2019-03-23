import { findTRSTBalance } from './actions';

export default (dispatch, TRST, account) => {
  TRST.methods
    .balanceOf(account)
    .call()
    .then((trstBalance) => {
      dispatch(findTRSTBalance(trstBalance));
    });
};
