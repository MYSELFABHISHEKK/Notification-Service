interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm py-4 px-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-neutral-500">{title}</h2>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="relative p-1 text-neutral-400 hover:text-primary focus:outline-none">
              <i className="fas fa-bell"></i>
              <span className="badge absolute -top-1 -right-1 bg-accent text-white">3</span>
            </button>
          </div>
          
          <div className="h-8 w-px bg-neutral-200"></div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="font-semibold text-sm">JD</span>
            </div>
            <span className="text-neutral-500 font-medium">John Doe</span>
            <i className="fas fa-chevron-down text-xs text-neutral-400"></i>
          </div>
        </div>
      </div>
    </header>
  );
}
