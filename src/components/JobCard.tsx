import React from 'react';
import { formatEther } from 'ethers';

// Define a type for the job object for better type safety
type Job = {
  id: bigint;
  client: string;
  freelancer: string;
  description: string;
  payment: bigint;
  status: number;
};

type JobCardProps = {
  job: Job;
  account: string;
  handleAcceptJob: (jobId: number) => Promise<void>;
  handleCompleteJob: (jobId: number) => Promise<void>;
  handleSignApproval: (jobId: number) => Promise<void>;
};

const JOB_STATUS = ['Open', 'InProgress', 'Completed', 'Cancelled'];

const JobCard: React.FC<JobCardProps> = ({ job, account, handleAcceptJob, handleCompleteJob, handleSignApproval }) => {
  const statusString = JOB_STATUS[job.status] || 'Unknown';
  const isClient = job.client.toLowerCase() === account.toLowerCase();

  return (
    <div className="job-card">
      <h3>Job #{Number(job.id)}</h3>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Payment:</strong> {formatEther(job.payment)} ETH</p>
      <p><strong>Status:</strong> <span className={`status-badge status-${statusString}`}>{statusString}</span></p>
      <p><strong>Client:</strong> <span title={job.client}>{`${job.client.substring(0, 6)}...`}</span></p>
      
      <div className="job-card-actions">
        {/* Freelancer can accept an open job */}
        {job.status === 0 && !isClient && (
          <button className="button" onClick={() => handleAcceptJob(Number(job.id))}>Accept Job</button>
        )}
        {/* Client can complete an in-progress job */}
        {job.status === 1 && isClient && (
          <>
            <button className="button" onClick={() => handleCompleteJob(Number(job.id))}>Mark Complete</button>
            <button className="button" onClick={() => handleSignApproval(Number(job.id))}>Sign Approval</button>
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;
