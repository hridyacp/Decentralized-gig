import React from 'react';
import JobCard from './JobCard';
import Spinner from './Spinner';

// Assuming the same Job type definition from JobCard.tsx
type Job = {
  id: bigint;
  client: string;
  freelancer: string;
  description: string;
  payment: bigint;
  status: number;
};

type JobListProps = {
  jobs: Job[];
  account: string;
  isLoading: boolean;
  handleAcceptJob: (jobId: number) => Promise<void>;
  handleCompleteJob: (jobId: number) => Promise<void>;
  handleSignApproval: (jobId: number) => Promise<void>;
};

const JobList: React.FC<JobListProps> = ({ jobs, account, isLoading, ...handlers }) => {
  if (isLoading && jobs.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="job-list-container">
      <h2>Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs have been posted yet. Be the first!</p>
      ) : (
        <div className="job-list">
          {jobs.map(job => (
            <JobCard
              key={Number(job.id)}
              job={job}
              account={account}
              {...handlers}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
