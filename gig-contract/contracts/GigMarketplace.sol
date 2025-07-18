// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GigMarketplace is Ownable {
constructor() Ownable(msg.sender) {
 
}
    struct Job {
        uint256 id;
        address client;
        address payable freelancer;
        string description;
        uint256 payment;
        JobStatus status;
    }

    enum JobStatus { Open, InProgress, Completed, Cancelled }

    uint256 public platformFeePercent = 2;
    uint256 public nextJobId = 1;

    mapping(uint256 => Job) public jobs;

    event JobPosted(uint256 id, address client, uint256 payment);
    event JobAccepted(uint256 id, address freelancer);
    event JobCompleted(uint256 id, address freelancer, uint256 payment);

    function postJob(string memory _description) external payable {
        require(msg.value > 0, "Payment must be greater than zero");
        
        jobs[nextJobId] = Job({
            id: nextJobId,
            client: msg.sender,
            freelancer: payable(address(0)),
            description: _description,
            payment: msg.value,
            status: JobStatus.Open
        });

        emit JobPosted(nextJobId, msg.sender, msg.value);
        nextJobId++;
    }

    function acceptJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(job.status == JobStatus.Open, "Job is not open");
        
        job.freelancer = payable(msg.sender);
        job.status = JobStatus.InProgress;

        emit JobAccepted(_jobId, msg.sender);
    }

    function completeJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client, "Only the client can complete the job");
        require(job.status == JobStatus.InProgress, "Job is not in progress");

        // <-- CHANGED: Use standard Solidity math operators.
        // The compiler will automatically check for overflow/underflow.
        uint256 fee = (job.payment * platformFeePercent) / 100;
        uint256 freelancerPayment = job.payment - fee;
        
        job.freelancer.transfer(freelancerPayment);
        
        job.status = JobStatus.Completed;
        emit JobCompleted(_jobId, job.freelancer, freelancerPayment);
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }

    function getApprovalHash(uint256 _jobId) public view returns (bytes32) {
        return keccak256(abi.encodePacked("APPROVE_JOB", _jobId, address(this)));
    }
}
