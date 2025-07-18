import React, { useState } from 'react';

type PostJobFormProps = {
  handlePostJob: (description: string, payment: string) => Promise<void>;
  isLoading: boolean;
};

const PostJobForm: React.FC<PostJobFormProps> = ({ handlePostJob, isLoading }) => {
  const [description, setDescription] = useState('');
  const [payment, setPayment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !payment) return alert("Please fill out all fields.");
    await handlePostJob(description, payment);
    setDescription('');
    setPayment('');
  };

  return (
    <div className="form-container">
    <div className="form-sub">
      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <input
            id="description"
            className="form-input"
            type="text"
            placeholder="e.g., 'Build a responsive landing page'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="payment">Payment in ETH</label>
          <input
            id="payment"
            className="form-input"
            type="text"
            placeholder="e.g., '0.1'"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default PostJobForm;
