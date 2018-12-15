/**
 *  modified version of TRST Trustcoin contract compiled with 0.4.25
 *
 *  ERC20 compliant (see https://github.com/ethereum/EIPs/issues/20)
 *
 *  Code is based on multiple sources:
 *  https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC20.sol
 *  https://github.com/ConsenSys/Tokens/blob/master/Token_Contracts/contracts/StandardToken.sol
 *  https://github.com/ConsenSys/Tokens/blob/master/Token_Contracts/contracts/HumanStandardToken.sol
 */

// Abstract contract for the full ERC 20 Token standard
// https://github.com/ethereum/EIPs/issues/20

// Based on https://github.com/ConsenSys/Tokens/blob/master/Token_Contracts/contracts/Token.sol
pragma solidity ^0.4.8;

import "./ERC20.sol";


contract TRST is ERC20 {

  //// Constants ////
  string public name = "Trustcoin";
  uint256 public decimals = 6;
  string public symbol = "TRST";
  string public version = "TRST1.0";

  // One hundred million coins, each divided to up to 10^decimals units.
  uint256 private constant TOTAL_TOKENS = 100000000000000;

  mapping (address => uint256) public balances; // (ERC20)
  // A mapping from an account owner to a map from approved spender to their allowances.
  // (see ERC20 for details about allowances).
  mapping (address => mapping (address => uint256)) public allowed; // (ERC20)

  //// Events ////
  event MigrationInfoSet(string newMigrationInfo);

  // This is to be used when migration to a new contract starts.
  // This string can be used for any authorative information re the migration
  // (e.g. address to use for migration, or URL to explain where to find more info)
  string public migrationInfo = "";

  // The only address that can set migrationContractAddress, a secure multisig.
  address public migrationInfoSetter;

  //// Modifiers ////
  modifier onlyFromMigrationInfoSetter {
    if (msg.sender != migrationInfoSetter) {
      revert("Sender is not the migrationInfoSetter.");
    }
    _;
  }

  //// Public functions ////
  constructor(address _migrationInfoSetter) public {
    if (_migrationInfoSetter == 0) {
      revert("_migrationInfoSetter cannot be 0.");
    }
    migrationInfoSetter = _migrationInfoSetter;
    // Upon creation, all tokens belong to the deployer.
    balances[msg.sender] = TOTAL_TOKENS;
  }

  // See ERC20
  function totalSupply() public view returns (uint256) {
    return TOTAL_TOKENS;
  }

  // See ERC20
  // WARNING: If you call this with the address of a contract, the contract will receive the
  // funds, but will have no idea where they came from. Furthermore, if the contract is
  // not aware of TRST, the tokens will remain locked away in the contract forever.
  // It is always recommended to call instead compareAndApprove() (or approve()) and have the
  // receiving contract withdraw the money using transferFrom().
  function transfer(address _to, uint256 _value) public returns (bool) {
    if (balances[msg.sender] >= _value) {
      balances[msg.sender] -= _value;
      balances[_to] += _value;
      emit Transfer(msg.sender, _to, _value);
      return true;
    }
    return false;
  }

  // See ERC20
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value) {
      balances[_from] -= _value;
      allowed[_from][msg.sender] -= _value;
      balances[_to] += _value;
      emit Transfer(_from, _to, _value);
      return true;
    }
    return false;
  }

  // See ERC20
  function balanceOf(address _owner) public view returns (uint256) {
    return balances[_owner];
  }

  // See ERC20
  // NOTE: this method is vulnerable and is placed here only to follow the ERC20 standard.
  // Before using, please take a look at the better compareAndApprove below.
  function approve(address _spender, uint256 _value) public returns (bool) {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  // A vulernability of the approve method in the ERC20 standard was identified by
  // Mikhail Vladimirov and Dmitry Khovratovich here:
  // https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM
  // It's better to use this method which is not susceptible to over-withdrawing by the approvee.
  /// @param _spender The address to approve
  /// @param _currentValue The previous value approved, which can be retrieved with allowance(msg.sender, _spender)
  /// @param _newValue The new value to approve, this will replace the _currentValue
  /// @return bool Whether the approval was a success (see ERC20's `approve`)
  function compareAndApprove(address _spender, uint256 _currentValue, uint256 _newValue) public returns(bool) {
    if (allowed[msg.sender][_spender] != _currentValue) {
      return false;
    }
    return approve(_spender, _newValue);
  }

  // See ERC20
  function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }

  // Allows setting a descriptive string, which will aid any users in migrating their token
  // to a newer version of the contract. This field provides a kind of 'double-layer' of
  // authentication for any migration announcement, as it can only be set by WeTrust.
  /// @param _migrationInfo The information string to be stored on the contract
  function setMigrationInfo(string _migrationInfo) public onlyFromMigrationInfoSetter {
    migrationInfo = _migrationInfo;
    emit MigrationInfoSet(_migrationInfo);
  }

  // To be used if the migrationInfoSetter wishes to transfer the migrationInfoSetter
  // permission to a new account, e.g. because of change in personnel, a concern that account
  // may have been compromised etc.
  /// @param _newMigrationInfoSetter The address of the new Migration Info Setter
  function changeMigrationInfoSetter(address _newMigrationInfoSetter) public onlyFromMigrationInfoSetter {
    migrationInfoSetter = _newMigrationInfoSetter;
  }
}
