import { bigNumber } from './formatter';
import {
  parseStakePayload,
  getCauseFromCMS,
  getUnlockedAtFromBlockchain,
  determineCanUnstake,
  mapCMSCause,
  getSpringRanks,
  getNonSpringRanks,
} from './utils';
import { findUsersStats, findCausesStats } from './actions';

const getUsersStats = async (eventData, causesInfo, TimeLockedStaking) => {
  const usersStats = {};
  for (const key of Object.keys(eventData)) {
    const {
      user,
      amount,
      stakingId,
      unlockedAtInPayload,
      data,
      transactions,
    } = eventData[key];

    if (!usersStats[user]) {
      usersStats[user] = {
        yourStakes: [],
      };
    }

    let unlockedAt = await getUnlockedAtFromBlockchain(
      user,
      data,
      TimeLockedStaking,
    );

    // Infura is too slow on rinkeby and mainnet
    // if blockchain.unlockedAt = 0, then it means infura has not seen the new contract state
    if (unlockedAt.getTime() === new Date(0).getTime()) {
      unlockedAt = unlockedAtInPayload;
    }

    const activity = {
      id: key,
      amount,
      stakeData: data,
      cause: causesInfo[stakingId],
      canUnstake: determineCanUnstake(unlockedAt, amount),
      unlockedAtInPayload,
      unlockedAtInContract: unlockedAt,
      transactions,
    };

    usersStats[user].yourStakes.push(activity);
  }
  return usersStats;
};

const getCausesStats = (eventData, causesInfo) => {
  const causesStats = {};
  for (const key of Object.keys(eventData)) {
    const { user, amount, stakingId } = eventData[key];

    if (!causesStats[stakingId]) {
      causesStats[stakingId] = {
        amount: bigNumber(0),
        stakers: new Set(),
        rank: 0,
        name: causesInfo[stakingId].name,
        isOnSpring: !!causesInfo[stakingId].isOnSpring,
      };
    }

    const stats = causesStats[stakingId];
    if (amount.gt(bigNumber(0))) {
      stats.amount = amount.add(stats.amount);
      stats.stakers.add(user);
    }
  }

  const ranksOnSpring = getSpringRanks(causesStats);
  const ranksNotOnSpring = getNonSpringRanks(causesStats);
  for (const stakingId of Object.keys(causesStats)) {
    const { isOnSpring } = causesStats[stakingId];
    causesStats[stakingId].rank = isOnSpring
      ? ranksOnSpring[stakingId]
      : ranksNotOnSpring[stakingId];
  }

  return causesStats;
};

// assume (user, stake data) is unique
const mapEventData = (events) => {
  const temp = {};
  for (const e of events) {
    const { transactionHash, returnValues, event, blockNumber } = e;
    if (event !== 'Staked' && event !== 'Unstaked') {
      continue;
    }

    const { amount, data, user } = returnValues;

    const key = `${user}-${data}`;
    if (!temp[key]) {
      const { stakingId, unlockedAtInPayload } = parseStakePayload(data);
      temp[key] = {
        amount: bigNumber(0), // net value
        data,
        user: user.toLowerCase(),
        stakingId,
        unlockedAtInPayload,
        transactions: [],
      };
    }

    // calculating net amount
    // + on staked event
    // - on unstaked event
    //
    const currentAmount = temp[key].amount;
    if (event === 'Staked') {
      temp[key].amount = bigNumber(amount).add(currentAmount);
    }

    if (event === 'Unstaked') {
      temp[key].amount = currentAmount.sub(bigNumber(amount));
    }

    temp[key].transactions.push({
      transactionHash,
      blockNumber,
      amount: bigNumber(amount),
      event,
    });
  }
  return temp;
};

const getStakingIdSet = (eventData) => {
  const uniqStakingIds = new Set();
  for (const key of Object.keys(eventData)) {
    uniqStakingIds.add(eventData[key].stakingId);
  }
  return uniqStakingIds;
};

const getCausesInfo = async (stakingIdSet) => {
  const causes = Object.assign({}, window.localStorage.getItem('causes'));
  const iterator = stakingIdSet.entries();
  for (const entry of iterator) {
    const stakingId = entry[0];
    const cache = causes[stakingId];
    // 20 minutes cache
    if (!cache || cache.lastFetch - Date.now() > 20 * 60 * 1000) {
      const cause = await getCauseFromCMS(stakingId);
      causes[stakingId] = {
        lastFetch: Date.now(),
        ...mapCMSCause(cause),
      };
    }
  }

  window.localStorage.setItem('causes', causes);
  return causes;
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

      const usersStats = await getUsersStats(
        eventData,
        causesInfo,
        TimeLockedStaking,
      );
      const causesStats = getCausesStats(eventData, causesInfo);
      dispatch(findUsersStats(usersStats));
      dispatch(findCausesStats(causesStats));
    },
  );
};
