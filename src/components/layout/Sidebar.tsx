// src/components/layout/Sidebar.tsx
import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Transition, Dialog } from '@headlessui/react';
import {
  HomeIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import useAppStore from '../../store/appStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Negotiations', href: '/negotiations', icon: ChatBubbleLeftRightIcon },
  { name: 'ESG Intelligence', href: '/analytics', icon: ChartBarIcon },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <div className="flex flex-col h-full bg-navy-900 border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-glow">
            <span className="text-navy-900 font-bold text-xl">S</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold tracking-tight">SyndiSync</h1>
            <p className="text-gold-500/80 text-xs font-medium tracking-wider">AI-NATIVE LENDING</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onNavClick}
            className={({ isActive }) =>
              clsx(
                'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-white shadow-glass border border-white/5'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={clsx(
                    "mr-3 h-6 w-6 flex-shrink-0 transition-colors",
                    isActive ? "text-gold-400" : "text-slate-500 group-hover:text-white"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-navy-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">System Status</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-green-400 font-bold">Online</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Latency</span>
              <span className="text-slate-300 font-mono">24ms</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">API Calls</span>
              <span className="text-slate-300 font-mono">1,240/hr</span>
            </div>
          </div>
        </div>

        {/* Live Mode Toggle */}
        <div className="flex items-center justify-between px-2 mb-4">
          <span className="text-sm text-slate-400 font-medium">Live AI Mode</span>
          <button
            className={`w-12 h-6 rounded-full transition-colors relative ${window.localStorage.getItem('liveMode') === 'true' ? 'bg-gold-500' : 'bg-slate-700'}`}
            onClick={() => {
              const newState = !(window.localStorage.getItem('liveMode') === 'true');
              window.localStorage.setItem('liveMode', String(newState));
              // Reload to apply changes
              window.location.reload();
            }}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${window.localStorage.getItem('liveMode') === 'true' ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* API Key Input (Only in Live Mode) */}
        {window.localStorage.getItem('liveMode') === 'true' && (
          <div className="bg-navy-900/50 p-3 rounded-lg border border-gold-500/30 animate-fade-in">
            <label className="text-xs text-gold-400 font-bold uppercase block mb-2">Gemini API Key</label>
            <input
              type="password"
              placeholder="Paste API Key (or use .env)"
              className="w-full bg-white/10 text-white text-xs p-2 rounded border border-white/10 focus:border-gold-500 focus:outline-none placeholder-slate-400"
              defaultValue={window.localStorage.getItem('gemini_api_key') || ''}
              onChange={(e) => window.localStorage.setItem('gemini_api_key', e.target.value)}
            />
            <p className="text-[10px] text-slate-500 mt-1">Leave empty to use VITE_GEMINI_API_KEY</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useAppStore();

  return (
    <>
      {/* Mobile sidebar with backdrop */}
      <Transition.Root show={isMobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileMenuOpen}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-navy-900/90 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent onNavClick={() => setMobileMenuOpen(false)} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar (always visible on lg+) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-20">
        <SidebarContent />
      </div>
    </>
  );
}
