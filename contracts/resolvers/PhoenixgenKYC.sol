pragma solidity ^0.5.0;

import "../SnowflakeResolver.sol";
import "../interfaces/IdentityRegistryInterface.sol";
import "../interfaces/SnowflakeInterface.sol";

contract PhoenixgenKYC is SnowflakeResolver {
    IdentityRegistryInterface identityRegistry;

    constructor (address snowflakeAddress)
        SnowflakeResolver("Phoenixgen KYC", "Perform KYC through Phoenixgen.", snowflakeAddress, true, true) public
    {
        setSnowflakeAddress(snowflakeAddress);
    }

    // set the snowflake address and identity registry contract wrappers
    function setSnowflakeAddress(address snowflakeAddress) public onlyOwner() {
        super.setSnowflakeAddress(snowflakeAddress);

        SnowflakeInterface snowflake = SnowflakeInterface(snowflakeAddress);
        identityRegistry = IdentityRegistryInterface(snowflake.identityRegistryAddress());
    }

    // allows identity nodes to declare themselves
    function newIdentityNode (string memory identityNodePlaintext, bytes memory extraData) public {
        bytes32 identityNode = keccak256(abi.encodePacked(msg.sender, identityNodePlaintext));
        emit PhoenixgenKYCNewIdentityNode(identityNode, msg.sender, identityNodePlaintext, extraData);
    }

    // allows identity nodes to update their extraData
    function updateIdentityNode (string memory identityNodePlaintext, bytes memory extraData) public {
        bytes32 identityNode = keccak256(abi.encodePacked(msg.sender, identityNodePlaintext));
        emit PhoenixgenKYCUpdateIdentityNode(identityNode, extraData);
    }

    // implement addition function
    function onAddition(uint ein, uint, bytes memory extraData) public senderIsSnowflake() returns (bool) {
        emit PhoenixgenKYCSignUp(ein);
        (bytes32 identityNode) = abi.decode(extraData, (bytes32));
        addIdentityNode(ein, identityNode);
        return true;
    }

    // declares an identity node for the sender's EIN
    function addIdentityNode(bytes32 identityNode) public {
        _addIdentityNode(identityRegistry.getEIN(msg.sender), identityNode);
    }

    // allows providers to declare an identity node for the sender's EIN
    function addIdentityNode(uint ein, bytes32 identityNode) public {
        require(identityRegistry.isProviderFor(ein, msg.sender), "Snowflake is not a Provider for the passed EIN.");
        _addIdentityNode(ein, identityNode);
    }

    function _addIdentityNode (uint ein, bytes32 identityNode) private {
        require(identityRegistry.isResolverFor(ein, address(this)), "The EIN has not set this resolver.");
        emit PhoenixgenKYCIdentityNodeAdded(ein, identityNode);
    }

    // revokes an identity node for the sender's EIN
    function revokeIdentityNode(bytes32 identityNode) public {
        _revokeIdentityNode(identityRegistry.getEIN(msg.sender), identityNode);
    }

    // allows providers to revoke an identity node for the sender's EIN
    function revokeIdentityNode(uint ein, bytes32 identityNode) public {
        require(identityRegistry.isProviderFor(ein, msg.sender), "Snowflake is not a Provider for the passed EIN.");
        _revokeIdentityNode(ein, identityNode);
    }

    function _revokeIdentityNode (uint ein, bytes32 identityNode) private {
        require(identityRegistry.isResolverFor(ein, address(this)), "The EIN has not set this resolver.");
        emit PhoenixgenKYCIdentityNodeRevoked(ein, identityNode);
    }

    // implement removal function
    function onRemoval(uint ein, bytes memory) public senderIsSnowflake() returns (bool) {
        emit PhoenixgenKYCRemoval(ein);
        return true;
    }

    event PhoenixgenKYCNewIdentityNode(
        bytes32 indexed identityNode, address identityNodeAddress, string identityNodePlaintext, bytes extraData
    );
    event PhoenixgenKYCUpdateIdentityNode(bytes32 indexed identityNode, bytes extraData);

    event PhoenixgenKYCSignUp(uint ein);
    event PhoenixgenKYCIdentityNodeAdded(uint indexed ein, bytes32 indexed identityNode);
    event PhoenixgenKYCIdentityNodeRevoked(uint indexed ein, bytes32 indexed identityNode);
    event PhoenixgenKYCRemoval(uint ein);
}
