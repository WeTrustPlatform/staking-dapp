// This provides dispatch helpers
// to share in components.
// Some dispatch functions require multiple async steps
// in preparation.

import assert from 'assert';
import axios from 'axios';
import { parseStakePayload } from './utils';
import {
  findTrstBalance,
  findAccountActivities,
  findOverallStats,
} from './actions';
import {
  trstInBN, trst, numberString, bigNumber, currency,
} from './formatter';
import configs from './configs';

// TODO pull events signature from abi
// const STAKE_TOPIC = '0xc65e53b88159e7d2c0fc12a0600072e28ae53ff73b4c1715369c30f160935142';
// const UNSTAKE_TOPIC = '0xaf01bfc8475df280aca00b578c4a948e6d95700f0db8c13365240f7f973c8754';
// const TOPICS = [STAKE_TOPIC, UNSTAKE_TOPIC];

export const dispatchAccountActivities = (
  dispatch, TimeLockedStaking, account,
) => {
  // Get all the Staked events related to the current account
  TimeLockedStaking.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest',
    // topics: TOPICS,
  }, (err, events) => {
    // Reducer to consolidate multiple staked and unstaked events
    // per stake data.
    // @returns
    // {
    //   <stake's data field as key>: {
    //     id, ein, amount, rawAmount, lockedUntil, transactionHash, canUnstake
    //   }
    // }
    //
    // Note transactionHash, id:
    // There might be multiple transactionHash if users stake
    // with the same payloads multiple times
    // This is edge case and only happens if users purposely interact
    // with our contract manually.
    // To make it easy, we show the latest.
    //
    // Note amount: Localized formatted number in TRST
    // add if it's a stake event
    // sub if it's an unstake event
    //
    // Note: Use Object.assign on accumulator. Hence, no nested fields.
    const eventsReducer = (accumulator, currentEvent) => {
      const {
        id, transactionHash, returnValues, event,
      } = currentEvent;
      const { amount, data, user } = returnValues;

      // filter { user: account } does not work because we use 'allEvents'
      // TODO use TOPIC
      if ((user.toLowerCase() !== account.toLowerCase())
        || (event !== 'Staked' && event !== 'Unstaked')) {
        return accumulator;
      }

      const updatedValue = {
        id, transactionHash,
      };

      if (accumulator[data]) {
        // data exist
        const { rawAmount } = accumulator[data];
        updatedValue.rawAmount = event === 'Staked'
          ? rawAmount.add(bigNumber(amount)) : rawAmount.sub(bigNumber(amount));
      } else {
        const { ein, unlockedAtInPayload } = parseStakePayload(data);
        const rawAmount = event === 'Staked'
          ? bigNumber(amount) : bigNumber(amount).neg();

        accumulator[data] = {
          ein,
          rawAmount,
          unlockedAtInPayload,
        };
      }

      Object.assign(accumulator[data], updatedValue);

      const { rawAmount } = accumulator[data];

      // update the amount
      accumulator[data].amount = trst(rawAmount);

      return accumulator;
    };


    const aggregatedEvents = events.reduce(eventsReducer, {});

    // Call CMS to get NPO details like name and address
    //
    const getNameFromCMS = async (ein) => {
      let res;
      try {
        // Users can pass in any EIN when they stake.
        // If ein is invalid or not found,
        // just show default name 'Not Found'
        assert(ein, 'Invalid EIN.');
        // TODO make sure this return exactly 1 record
        res = await axios.get(
          `${configs.CMS_URL}/charities?search=${ein}`,
        );
      } catch (e) {
        console.log(e);
      }

      const npo = res && res.data && res.data.records && res.data.records[0];

      return (npo && npo.name) || 'Unknown';
    };

    // Call staking contract to get the unlockedAt
    const getUnlockedAtFromBlockchain = async (user, stakeData) => {
      // get the real unlockedAt in seconds
      // set by the contract
      const realUnlockedAt = await TimeLockedStaking.methods.getStakeRecordUnlockedAt(
        user, stakeData,
      ).call();
      const realUnlockedAtDate = new Date(realUnlockedAt * 1000);
      return realUnlockedAtDate;
    };

    // determine canUnstake after getting the correct unlockedAt
    const determineCanUnstake = (unlockedAt, rawAmount) => {
      const isBeforeNow = Date.now() > unlockedAt.getTime();
      const hasBalance = rawAmount.gt(bigNumber(0));
      return isBeforeNow && hasBalance;
    };

    // key is the original stake's payload data field
    const populatedStakeRecordTasks = Object.keys(aggregatedEvents).map(async (key) => {
      const data = aggregatedEvents[key];
      const name = await getNameFromCMS(data.ein);
      const unlockedAt = await getUnlockedAtFromBlockchain(account, key);

      const canUnstake = determineCanUnstake(
        unlockedAt,
        data.rawAmount,
      );

      return Object.assign(data, {
        name, unlockedAt, canUnstake, stakeData: key,
      });
    });

    Promise.all(populatedStakeRecordTasks).then((completed) => {
      dispatch(findAccountActivities(completed));
    });
  });
};

export const dispatchTRSTBalance = (dispatch, TRST, account) => {
  TRST.methods.balanceOf(account).call()
    .then((trstBalance) => {
      dispatch(findTrstBalance(trstBalance));
    });
};

// TODO optimize this with dispatchAccountActivities
export const dispatchOverallStats = (dispatch, TimeLockedStaking) => {
  TimeLockedStaking.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest',
    // topics: TOPICS,
  }, (err, events) => {
    if (err || !events) {
      // TODO send log
      return;
    }

    // each event contains the user address and user total stake amount
    // however, don't rely on the events being sorted chronologically.
    // keep track of block number to see what total stake amount is the latest.
    // trying to construct the userStats map:
    // {
    //   "<user address i.e 0x>": { total, blockNumber },
    //   ...
    // }
    const userStatsReducer = (accumulator, currentEvent) => {
      const { blockNumber, returnValues, event } = currentEvent;
      const { user, total } = returnValues;

      if (event !== 'Staked' && event !== 'Unstaked') {
        // maybe we're on wrong network
        // or the topics is wrong
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
    dispatch(findOverallStats({
      currentStakes: trst(total),
      currentStakers: numberString(count),
      averageStakes: trst(average),
      averageStakesInUSD: currency(averageInUSD),
    }));
  });
};
