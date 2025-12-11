import React from 'react';
import GlobalSidebar from './GlobalSidebar';

const AppLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      {}
      <div id="layout-root">
        <GlobalSidebar />
        
        <main className="main-content">
          <div className="app-container">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default AppLayout;