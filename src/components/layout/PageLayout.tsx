import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { VoiceCommander } from '../voice/VoiceCommander';
import { AIAssistant } from '../ai/AIAssistant';

export default function PageLayout() {
  return (
    <div className="min-h-screen bg-navy-900 flex">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col">
        {/* <Navbar /> Optional: Keep navbar hidden if we want sidebar-only nav for cleaner look, but Sidebar needs to be width-fixed */}
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
