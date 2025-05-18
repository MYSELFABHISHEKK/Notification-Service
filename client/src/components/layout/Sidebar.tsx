import { Link, useLocation } from "wouter";

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}

const NavItem = ({ href, icon, label, active }: NavItemProps) => (
  <Link href={href}>
    <a className={`sidebar-nav-item flex items-center pl-8 pr-4 py-3 ${
      active 
        ? "active text-primary" 
        : "text-neutral-400 hover:text-primary"
    }`}>
      <i className={`fas fa-${icon} mr-3`}></i>
      <span>{label}</span>
    </a>
  </Link>
);

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <i className="fas fa-bell text-primary text-xl"></i>
          <h1 className="text-xl font-semibold text-neutral-500">Notification Service</h1>
        </div>
      </div>
      
      <nav className="flex-1 pt-4 overflow-y-auto">
        <div className="px-4 mb-2 text-neutral-400 text-sm font-semibold">MAIN</div>
        <NavItem 
          href="/" 
          icon="tachometer-alt" 
          label="Dashboard" 
          active={location === "/"}
        />
        <NavItem 
          href="/notifications" 
          icon="bell" 
          label="Notifications" 
          active={location === "/notifications"}
        />
        <NavItem 
          href="/users" 
          icon="user" 
          label="Users" 
          active={location === "/users"}
        />
        
        <div className="px-4 mt-6 mb-2 text-neutral-400 text-sm font-semibold">DEVELOPMENT</div>
        <NavItem 
          href="/api-docs" 
          icon="code" 
          label="API Documentation" 
          active={location === "/api-docs"}
        />
        <NavItem 
          href="/test-console" 
          icon="vial" 
          label="Test Console" 
          active={location === "/test-console"}
        />
        <NavItem 
          href="/analytics" 
          icon="chart-line" 
          label="Analytics" 
          active={location === "/analytics"}
        />
        
        <div className="px-4 mt-6 mb-2 text-neutral-400 text-sm font-semibold">SETTINGS</div>
        <NavItem 
          href="/configuration" 
          icon="cog" 
          label="Configuration" 
          active={location === "/configuration"}
        />
        <NavItem 
          href="/logs" 
          icon="history" 
          label="Logs" 
          active={location === "/logs"}
        />
      </nav>
      
      <div className="p-4 border-t border-neutral-200">
        <a href="#" className="flex items-center text-neutral-400 hover:text-primary">
          <i className="fas fa-question-circle mr-2"></i>
          <span>Help & Documentation</span>
        </a>
      </div>
    </div>
  );
}
