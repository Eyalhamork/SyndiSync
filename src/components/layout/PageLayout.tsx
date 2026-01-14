import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { VoiceCommander } from '../voice/VoiceCommander';
import { AIAssistant } from '../ai/AIAssistant';
import useAppStore from '../../store/appStore';
import clsx from 'clsx';

export default function PageLayout() {
  const { isSidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <div className="min-h-screen bg-navy-900 flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebar}
      />
      <div className={clsx("flex-1 flex flex-col transition-all duration-300", isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64")}>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <VoiceCommander />
      <AIAssistant />
    </div>
  );
}
