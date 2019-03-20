import { bigNumber } from './formatter';
import { parseStakePayload, getCauseFromCMS } from './utils';
import { findUsersStats, findCausesStats } from './actions';

const getUsersStats = (eventData, causesInfo) => {};

const getCausesStats = (eventData, causesInfo) => {};

const mapEventData = (events) => {
  const temp = {};
  for (const e of events) {
    const { transactionHash, returnValues, event } = e;
    if (event !== 'Staked' && event !== 'Unstaked') {
      continue;
    }

    const { amount, data, user } = returnValues;

    if (!temp[data]) {
      const { stakingId, unlockedAtInPayload } = parseStakePayload(data);
      temp[data] = {
        amount: bigNumber(0),
        user: user.toLowerCase(),
        stakingId,
        unlockedAtInPayload,
        activities: [],
      };
    }

    const currentAmount = temp[data].amount;
    if (event === 'Staked') {
      temp[data].amount = bigNumber(amount).add(currentAmount);
    }

    if (event === 'Unstaked') {
      temp[data].amount = currentAmount.sub(bigNumber(amount));
    }

    temp[data].activities.push({
      transactionHash,
      event,
    });
  }
  return temp;
};

const getStakingIdSet = (eventData) => {
  const uniqStakingIds = new Set();
  for (const data of Object.keys(eventData)) {
    uniqStakingIds.add(eventData[data].stakingId);
  }
  return uniqStakingIds;
};

const getCausesInfo = async (stakingIdSet) => {
  const iterator = stakingIdSet.entries();
  for (const entry of iterator) {
    const stakingId = entry[0];
    const cache =
      window.localStorage.causes && window.localStorage.causes[stakingId];
    // 20 minutes cache
    if (!cache || cache.lastFetch - Date.now() > 20 * 60 * 1000) {
      const cause = await getCauseFromCMS();
      window.localStorage.causes[stakingId] = {
        lastFetch: Date.now(),
        ...cause,
      };
    }
  }
  return window.localStorage.causes;
};

export default (dispatch, TimeLockedStaking) => {
  TimeLockedStaking.getPastEvents(
    'allEvents',
    {
      fromBlock: TimeLockedStaking.deployedAt || 0,
      toBlock: 'latest',
    },
    async (err, events) => {
      if (err || !events) {
        // TODO send log
        return;
      }

      const eventData = mapEventData(events);
      const stakingIds = getStakingIdSet(eventData);
      const causesInfo = await getCausesInfo(stakingIds);

      const usersStats = getUsersStats(eventData, causesInfo);
      const causesStats = getCausesStats(eventData, causesInfo);
      dispatch(findUsersStats(usersStats));
      dispatch(findCausesStats(causesStats));
    },
  );
};
