import { useState } from 'react';
import Sidebar from './Sidebar';

const StudentLayout = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="flex bg-black min-h-screen font-sans text-white selection:bg-primary/30">
      <Sidebar role="student" isMinimized={isMinimized} toggleSidebar={() => setIsMinimized(!isMinimized)} />
      <div className={`flex-1 p-8 relative overflow-y-auto h-screen scrollbar-hide transition-all duration-300 ${isMinimized ? 'ml-20' : 'ml-64'}`}>
        {/* Decorative Grid Background - slightly different from Admin for distinction */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-indigo-600/10 opacity-30 blur-[120px]" />
        
        {/* Main Content Area */}
        <div className="relative z-10 max-w-6xl mx-auto h-full space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
