import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { ethers, BrowserProvider, Signer, parseEther, formatEther, getBytes } from 'ethers';

// Import ABI and Components
import GigMarketplaceABI from './data/GigMarketplace.json';
import Header from './components/Header';
import PostJobForm from './components/PostJobForm';
import JobList from './components/JobList';

declare global {
  interface Window {
    ethereum: any;
  }
}

const CONTRACT_ADDRESS = "0xbeFF2EfE0Ca13D61dce2f89Bd03bF4889C6682C3";

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Apply theme to the body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const connectWallet = async () => {
    if (!window?.ethereum) return alert("Please install MetaMask!");
    try {
      setIsLoading(true);
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []);
      const web3Signer = await web3Provider.getSigner();
      const userAddress = await web3Signer.getAddress();
      const marketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, GigMarketplaceABI.abi, web3Signer);

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(userAddress);
      setContract(marketplaceContract);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChainData = useCallback(async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const nextId = await contract.nextJobId();
      const jobs = [];
      for (let i = 1; i < Number(nextId); i++) {
        const job = await contract.jobs(i);
        // We only add non-cancelled jobs to the main list
        if(job.status !== 3) {
           jobs.push(job);
        }
      }
      setAllJobs(jobs.reverse()); // Show newest jobs first
    } catch (error) {
      console.error("Error fetching chain data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    if (contract) fetchChainData();
  }, [contract, fetchChainData]);

  // Generic transaction handler to reduce boilerplate
  const handleTransaction = async (txFunction: () => Promise<ethers.ContractTransactionResponse>) => {
    setIsLoading(true);
    try {
      const tx = await txFunction();
      await tx.wait();
      await fetchChainData();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction Failed. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostJob = async (description: string, payment: string) => {
    if (!contract) return;
    const paymentInWei = parseEther(payment);
    await handleTransaction(() => contract.postJob(description, { value: paymentInWei }));
  };

  const handleAcceptJob = async (jobId: number) => {
    if (!contract) return;
    await handleTransaction(() => contract.acceptJob(jobId));
  };

  const handleCompleteJob = async (jobId: number) => {
    if (!contract) return;
    await handleTransaction(() => contract.completeJob(jobId));
  };

  const handleSignApproval = async (jobId: number) => {
    if (!contract || !signer) return;
    try {
      const messageHash = await contract.getApprovalHash(jobId);
      const signature = await signer.signMessage(getBytes(messageHash));
      console.log("Signature:", signature);
      alert(`Approval Signed! Signature: ${signature.substring(0, 42)}...`);
    } catch (err) {
      console.error("Signing failed:", err);
    }
  };
  
  // Event Listener
  useEffect(() => {
    if (!contract) return;
    const onJobPosted = (id: bigint, client: string, payment: bigint) => {
      console.log(`EVENT: New Job Posted! ID: ${id}, Client: ${client}, Payment: ${formatEther(payment)} ETH`);
      alert(`New Job Posted with ID: ${id}!`);
      fetchChainData();
    };
    contract.on("JobPosted", onJobPosted);
    return () => { contract.off("JobPosted", onJobPosted); };
  }, [contract, fetchChainData]);

  return (
    <div className={`App ${theme}`}>
      <Header account={account} theme={theme} connectWallet={connectWallet} setTheme={setTheme} />
      {account && (
        <main>
          <PostJobForm handlePostJob={handlePostJob} isLoading={isLoading} />
          <hr />
          <JobList
            jobs={allJobs}
            account={account}
            isLoading={isLoading}
            handleAcceptJob={handleAcceptJob}
            handleCompleteJob={handleCompleteJob}
            handleSignApproval={handleSignApproval}
          />
        </main>
      )}
    </div>
  );
}

export default App;
