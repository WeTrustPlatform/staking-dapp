pragma solidity ^0.4.22;

/// https://eips.ethereum.org/EIPS/eip-900
/// @notice Interface with external methods
interface ISimpleStaking {

  event Staked(address indexed user, uint256 amount, uint256 total, bytes data);
  event Unstaked(address indexed user, uint256 amount, uint256 total, bytes data);

  function stake(uint256 amount, bytes data) external;
  function stakeFor(address user, uint256 amount, bytes data) external;
  function unstake(uint256 amount, bytes data) external;
  function totalStakedFor(address addr) external view returns (uint256);
  function totalStaked() external view returns (uint256);
  function token() external view returns (address);
  function supportsHistory() external pure returns (bool);

  // optional. Commented out until we have valid reason to implement these methods
  // function lastStakedFor(address addr) public view returns (uint256);
  // function totalStakedForAt(address addr, uint256 blockNumber) public view returns (uint256);
  // function totalStakedAt(uint256 blockNumber) public view returns (uint256);
}
