import React from 'react';
import logo from '../assets/logo.png';
import './AppLayout.css';

const AppLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div>
      <header className="app-header">
        <div className="app-container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <img src={logo} alt="TalkBerry" className="app-logo" />
            <span className="brand">TalkBerry</span>
          </div>
          <nav className="small">Main · Users · Messages</nav>
        </div>
      </header>

      <main style={{paddingTop:20}}>
        <div className="app-container">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;