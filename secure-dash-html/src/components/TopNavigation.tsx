import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Home, Search, FileText, Settings, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/scan', icon: Search, label: 'New Scan' },
    { path: '/results', icon: FileText, label: 'Results' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/about', icon: Users, label: 'About' },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">SecureShield</h1>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex">
            <div className="flex items-center space-x-1 bg-background/50 rounded-full p-1 border border-border/50">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`rounded-full px-4 gap-2 ${
                      isActive(item.path) 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex items-center justify-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-full px-3 ${
                    isActive(item.path) 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;