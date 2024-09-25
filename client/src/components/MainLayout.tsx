import React, { ReactNode } from 'react';

import AppHeader from './AppHeader'; // Adjust the import path
import { Container } from '@mui/material';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <AppHeader />
      <Container>
        {children}
      </Container>
    </div>
  );
};

export default MainLayout;