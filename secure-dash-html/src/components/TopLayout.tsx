import { ReactNode } from 'react';
import TopNavigation from './TopNavigation';

interface TopLayoutProps {
  children: ReactNode;
}

const TopLayout = ({ children }: TopLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default TopLayout;