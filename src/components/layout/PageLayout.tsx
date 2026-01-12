import { Outlet } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import { VoiceCommander } from '../voice/VoiceCommander';
import { AIAssistant } from '../ai/AIAssistant';
import useAppStore from '../../store/appStore';

export default function PageLayout() {
  const { toggleMobileMenu } = useAppStore();

  return (
    <div className="min-h-screen bg-navy-900 flex">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
              <span className="text-navy-900 font-bold text-sm">S</span>
            </div>
            <span className="text-white font-bold">SyndiSync</span>
          </div>
        </div>

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
