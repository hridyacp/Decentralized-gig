import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {AttestationId} from "@selfxyz/contracts/contracts/constants/AttestationId.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ExampleV2 is SelfVerificationRoot, Ownable {
    // Your app-specific configuration ID
    bytes32 public configId;
    
    constructor(
        address _identityVerificationHubV2, // V2 Hub address
        uint256 _scope // Application-specific scope identifier
    ) 
        SelfVerificationRoot(_identityVerificationHubV2, _scope)
        Ownable(msg.sender)
    {
        // Initialize with empty configId - set it up in Step 2
    }
 function setScope(uint256 _newScope) external onlyOwner {
        // The `_setScope` function is an internal function provided by the parent
        // `SelfVerificationRoot` contract. It's the correct way to update the scope.
        _setScope(_newScope);
    }
    // Required: Override to provide configId for verification
    function getConfigId(
        bytes32 destinationChainId,
        bytes32 userIdentifier, 
        bytes memory userDefinedData // Custom data from the qr code configuration
    ) public view override returns (bytes32) {
        // Return your app's configuration ID
        return 0x389b10c97afe42a07bee266e7cea1621eb663be8a8bc1933d388dee3094132c0;
    }

    // Override to handle successful verification
     function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory // userData
    ) internal virtual override {
        // 1. Define constants for clarity and maintainability.
        // We use 365 days as a standard approximation for a year.
        uint256 constant SECONDS_IN_A_DAY = 86400;
        uint256 constant DAYS_IN_A_YEAR = 365;
        uint256 constant REQUIRED_AGE_IN_YEARS = 17;

        // 2. Check if Date of Birth was provided by the user during verification.
        uint256 dateOfBirth = output.dateOfBirth;
        require(dateOfBirth > 0, "User must provide their date of birth for verification.");

        // 3. Calculate the required age in seconds.
        uint256 requiredAgeInSeconds = REQUIRED_AGE_IN_YEARS * DAYS_IN_A_YEAR * SECONDS_IN_A_DAY;

        // 4. Calculate the user's current age in seconds.
        uint256 userAgeInSeconds = block.timestamp - dateOfBirth;

        // 5. The core verification logic. If this fails, the transaction reverts.
        require(userAgeInSeconds > requiredAgeInSeconds, "User must be older than 17 to use this service.");

        // --- If the check passes, you can proceed with other business logic ---
        
        // For example, emit an event confirming the user is age-verified.
        // Your off-chain application can listen for this event.
        emit UserAgeVerified(output.userIdentifier, userAgeInSeconds);
    }

    // A new event to signal successful age verification
    event UserAgeVerified(bytes32 indexed userIdentifier, uint256 ageInSeconds);
    }
