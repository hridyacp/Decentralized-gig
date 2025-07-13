import React from 'react';

type HeaderProps = {
  account: string;
  theme: string;
  connectWallet: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

const Header: React.FC<HeaderProps> = ({ account, theme, connectWallet, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className="header">
      <h1>GigMarket</h1>
      <div className="wallet-info">
        {account ? (
          <div className="account-display" title={account}>
            {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
          </div>
        ) : (
          <button className="button" onClick={connectWallet}>Connect Wallet</button>
        )}
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header;
