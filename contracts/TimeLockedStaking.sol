pragma solidity ^0.4.25;

import "./interfaces/ERC165.sol";
import "./interfaces/ISimpleStaking.sol";
import "./lib/SafeMath.sol";
import "./lib/ERC20.sol";


/**
* Smart contract to stake ERC20 and optionally lock it in for a period of time.
* Users can add more stake any time
* and whether to extend the current locked-in period or not.
* Maximum locked-in time is 365 days from now.
*
* It also keeps track of the effective start time which is recorded on the very
* first stake. Think of it as the "member since" attribute.
* If user unstakes (full or partial) at any point, the effective start time is reset.
*
*/
contract TimeLockedStaking is ERC165, ISimpleStaking {
  using SafeMath for uint256;

  struct StakeInfo {
    /// total tokens this user stakes
    uint256 amount;
    /// "member since" in unix timestamp. Reset when user unstakes.
    uint256 effectiveAt;
    /// unix timestamp when user can unstake
    uint256 unlockedAt;
  }

  /// @dev Address of the ERC20 token contract used for staking
  ERC20 internal erc20Token;

  /// @dev https://solidity.readthedocs.io/en/v0.4.25/style-guide.html#avoiding-naming-collisions
  uint256 internal totalStaked_ = 0;

  /// Keep track of all stakers
  mapping (address => StakeInfo) public stakers;

  modifier greaterThanZero(uint256 num) {
    require(num > 0, "Must be greater than 0.");
    _;
  }

  constructor(address token) public {
    erc20Token = ERC20(token);
  }

  /// @dev Implement ERC165
  /// With three or more supported interfaces (including ERC165 itself as a required supported interface),
  /// the mapping approach (in every case) costs less gas than the pure approach (at worst case).
  function supportsInterface(bytes4 interfaceID) external view returns (bool) {
    return
      interfaceID == this.supportsInterface.selector ||
      interfaceID == this.stake.selector ^ this.stakeFor.selector ^ this.unstake.selector ^ this.totalStakedFor.selector ^ this.totalStaked.selector ^ this.token.selector ^ this.supportsHistory.selector;
  }

  /// @dev msg.sender stakes for him/her self.
  /// @param amount Number of ERC20 to be staked. Amount must be > 0.
  /// @param data Used for signaling the unlocked time.
  function stake(uint256 amount, bytes data) external {
    registerStake(msg.sender, amount, data);
  }

  /// @dev msg.sender stakes for someone else.
  /// @param amount Number of ERC20 to be staked. Must be > 0.
  /// @param data Used for signaling the unlocked time.
  function stakeFor(address user, uint256 amount, bytes data) external {
    registerStake(user, amount, data);
  }

  /// @dev msg.sender can unstake full amount or partial if unlockedAt =< now
  /// @notice as a result, the "member since" attribute is reset.
  /// @param amount Number of ERC20 to be unstaked. Must be > 0 and =< staked amount.
  /// @param data Just follow the interface. Don't have a use case for now.
  function unstake(uint256 amount, bytes data)
    external
    greaterThanZero(stakers[msg.sender].effectiveAt) // must be a member
    greaterThanZero(block.timestamp - stakers[msg.sender].unlockedAt) // must be unlocked
    greaterThanZero(amount)
  {
    address user = msg.sender;
    stakers[user].amount = stakers[user].amount.sub(amount);
    stakers[user].effectiveAt = block.timestamp;

    totalStaked_ = totalStaked_.sub(amount);

    require(erc20Token.transfer(user, amount));
    emit Unstaked(user, amount, stakers[user].amount, data);
  }

  /// @return The staked amount of an address.
  function totalStakedFor(address addr) external view returns (uint256) {
    return stakers[addr].amount;
  }

  /// @return Total number of tokens this smart contract hold.
  function totalStaked() external view returns (uint256) {
    return totalStaked_;
  }

  /// @return Address of the ERC20 used for staking.
  function token() external view returns (address) {
    return address(erc20Token);
  }

  /// @dev This smart contract does not store staking activities on chain.
  /// @return false History is processed off-chain via event logs.
  function supportsHistory() external pure returns (bool) {
    return false;
  }

  /// Helpers
  ///

  function max(uint256 a, uint256 b) public pure returns (uint256) {
    return a > b ? a : b;
  }

  function min(uint256 a, uint256 b) public pure returns (uint256) {
    return a > b ? b : a;
  }

  /// @dev Get the unlockedAt (if any) in the data field.
  /// Maximum of 365 days from now.
  /// @param data The left-most 256 bits are unix timestamp in seconds.
  /// @return The unlockedAt in the data or 365 days from now whichever is sooner.
  function getUnlockedAtSignal(bytes data) public view returns (uint256) {
    uint256 unlockedAt;
    assembly {
      let d := add(data, 32)  // first 32 bytes are the padded length of data
      unlockedAt := mload(d)
    }

    // Maximum 365 days from now
    uint256 oneYearFromNow = block.timestamp + 365 days;

    return min(unlockedAt, oneYearFromNow);
  }

  function registerStake(address user, uint256 amount, bytes data) private greaterThanZero(amount) {
    require(erc20Token.transferFrom(msg.sender, address(this), amount));

    StakeInfo memory info = stakers[user];

    uint256 effectiveAt = info.effectiveAt == 0 ? block.timestamp : info.effectiveAt;
    uint256 unlockedAt = max(info.unlockedAt, getUnlockedAtSignal(data));

    stakers[user] = StakeInfo(amount.add(stakers[user].amount), effectiveAt, unlockedAt);

    totalStaked_ = totalStaked_.add(amount);

    emit Staked(user, amount, stakers[user].amount, data);
  }

}
