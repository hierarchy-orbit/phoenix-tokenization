pragma solidity ^0.5.0;

import '../interfaces/PhoenixInterface.sol';
//import '../PhoenixSecuritiesToken.sol';

/**
 * @title PhoenixEscrow
 * @notice Stores PHOENIX inside as an escrow for PST issuing. This contracts stores any funds sent by the token creator and the funds that users pay to participate in the issuing. It distributes any refunds, and the corresponding dividends and interests to their receivers.
 * @author Fatima Castiglione Maldonado <castiglionemaldonado@gmail.com>
 */
contract PSTEscrow {
    uint256 public issuingEndingTimestamp;
    address public phoenixSecurityTokenAddress;
    address public phoenixTokenAddress;
    uint256 public totalPhoenixCapitalization;
    address payable public phoenixCapitalReceiverAddress;
    PhoenixInterface public phoenixToken;
    // PhoenixSecuritiesToken public phoenixSecuritiesToken;


    modifier onlyPhoenixSecurityToken() {
        require(msg.sender == phoenixSecurityTokenAddress, 'This function can only be executed by the original PhoenixSecurityToken');
        _;
    }

    /**
    * @notice Constructor
    * @dev    For the escrow to work properly, you need to set this variables.
    * @param  _issuingEndingTimestamp Time+Date when token issuing must stop
    * @param  _phoenixSecurityTokenAddress The address of the token being issued
    * @param  _totalPhoenixCapitalization Total capitalization accepted, measured in Phoenix
    * @param  _phoenixCapitalReceiver The address of the capital receiver account
    */
    constructor(uint256 _issuingEndingTimestamp, address _phoenixSecurityTokenAddress, uint256 _totalPhoenixCapitalization, address payable _phoenixCapitalReceiver) public {
        require(_issuingEndingTimestamp > now, 'The token issuing must end after now');
        require(_phoenixSecurityTokenAddress != address(0), 'You must set the token address');
        require(_totalPhoenixCapitalization > 0, 'The total capitalization must be larger than zero');
        require(_phoenixCapitalReceiver != address(0), 'You must set a capital receiver');
        issuingEndingTimestamp = _issuingEndingTimestamp;
        phoenixSecurityTokenAddress = msg.sender;
        // phoenixSecuritiesToken = PhoenixSecuritiesToken(_phoenixSecurityTokenAddress);
        phoenixCapitalReceiverAddress = _phoenixCapitalReceiver;
    }

    /**
    * @notice Send the collected capital to the capital receiver
    * @return uint8 The reason code: 0 means success.
    */
    function releaseCollectedCapital() public onlyPhoenixSecurityToken returns(uint8) {
        require(now >= issuingEndingTimestamp, 'You can only release funds after the token issuing has ended');
        uint256 phoenixInsideThisContract = phoenixToken.balanceOf(address(this));
        phoenixToken.transfer(phoenixCapitalReceiverAddress, phoenixInsideThisContract);
        return(0);
    }
}
