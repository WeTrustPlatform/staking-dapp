// This provides dispatch helpers
// to share in components.
// Some dispatch functions require multiple async steps
// in preparation.

import assert from 'assert';
import axios from 'axios';
import loadContract, { parseStakePayload } from './loadContract';
import {
  findTrstBalance,
  fetchAccountActivities,
  fetchOverallStats,
} from './actions';
import {
  trstInBN, trst, numberString, bigNumber, currency,
} from './formatter';

export const dispatchAccountActivities = (dispatch, account) => {
  // Get all the Staked events related to the current account
  loadContract('TimeLockedStaking').getPastEvents('Staked', {
    fromBlock: 0,
    toBlock: 'latest',
    filter: {
      user: account,
    },
  }, (err, events) => {
    // Massage the results
    const transformed = events.map((event) => {
      const {
        id, transactionHash, returnValues,
      } = event;
      const { amount, data } = returnValues;
      const { ein, lockedUntil } = parseStakePayload(data);
      return {
        id,
        ein,
        amount: trst(amount),
        lockedUntil,
        transactionHash,
      };
    });

    // Call CMS to get NPO details
    const populatedNPOPromises = transformed.map(async (record) => {
      let res;
      try {
        // Users can pass in any EIN when they stake.
        // If ein is invalid or not found,
        // just show default name 'Not Found'
        assert(record.ein.length > 0, 'Invalid EIN.');
        res = await axios.get(
          `${CMS_URL}/charities?search=${record.ein}`,
        );
      } catch (e) {
        console.log(e);
      }

      const npo = res && res.data && res.data.records && res.data.records[0];
      return Object.assign({ name: 'Not Found' }, npo, record);
    });

    Promise.all(populatedNPOPromises).then((completed) => {
      dispatch(fetchAccountActivities(completed));
    });
  });
};

export const dispatchTRSTBalance = (dispatch, account) => {
  loadContract('TRST').methods.balanceOf(account).call()
    .then((trstBalance) => {
      dispatch(findTrstBalance(trstBalance));
    });
};

// TODO optimize this with dispatchAccountActivites
export const dispatchOverallStats = async (dispatch) => {
  loadContract('TimeLockedStaking').getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest',
  }, (err, events) => {
    if (err || !events) {
      // TODO send log
      return;
    }

    // don't rely on the events being sorted chronologically.
    // keep track of block number to see what total is the latest.
    // trying to construct the userStats map:
    // {
    //   "0x01": { total, blockNumber },
    //   ...
    // }
    const userStatsReducer = (accumulator, currentEvent) => {
      const { blockNumber, returnValues, event } = currentEvent;
      const { user, total } = returnValues;

      if (event !== 'Staked' && event !== 'Unstaked') {
        // maybe we're on wrong network
        // or customed events were added outside of the EIP 900 scopes
        return accumulator;
      }

      if (!accumulator[user]
        || bigNumber(blockNumber).gt(accumulator[user].blockNumber)) {
        accumulator[user] = {
          total: bigNumber(total),
          blockNumber: bigNumber(blockNumber),
        };
      }
      return accumulator;
    };

    const userStats = events.reduce(userStatsReducer, {});

    const overallStatsReducer = (accumulator, userStat) => {
      const { total: userTotal } = userStat;
      if (userTotal && userTotal.gt(bigNumber(0))) {
        return {
          total: accumulator.total.add(userTotal),
          count: accumulator.count + 1,
        };
      }
      return accumulator;
    };

    const overallStats = Object.values(userStats).reduce(overallStatsReducer, {
      total: bigNumber(0),
      count: 0,
    });

    const { total, count } = overallStats;
    const average = total.div(bigNumber(count || 1));
    // TODO fetch TRST price
    const averageInUSD = trstInBN(average).toNumber() * 0.02;
    dispatch(fetchOverallStats({
      currentStakes: trst(total),
      currentStakers: numberString(count),
      averageStakes: trst(average),
      averageStakesInUSD: currency(averageInUSD),
    }));
  });
};
