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
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import useAppStore from '../../store/appStore';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Negotiations', href: '/negotiations', icon: ChatBubbleLeftRightIcon },
  { name: 'ESG Intelligence', href: '/analytics', icon: ChartBarIcon },
];

// AI Chat Button Component - Premium Prominent Style
function AIChatButton({ isCollapsed }: { isCollapsed?: boolean }) {
  const { toggleAIChat } = useAppStore();

  return (
    <motion.button
      onClick={toggleAIChat}
      title={isCollapsed ? "AI Assistant" : undefined}
      className={clsx(
        'group relative flex items-center px-3 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 w-full mt-4',
        'bg-gradient-to-r from-primary-600/90 via-primary-500/80 to-gold-500/70',
        'hover:from-primary-500 hover:via-primary-400 hover:to-gold-400',
        'text-white shadow-lg shadow-primary-500/30',
        'border border-primary-400/30 hover:border-primary-300/50',
        isCollapsed && 'justify-center'
      )}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/50 to-gold-500/50 blur-xl opacity-50"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className={clsx("relative flex items-center", isCollapsed ? "justify-center" : "")}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <SparklesIcon
            className={clsx(
              "h-5 w-5 flex-shrink-0",
              !isCollapsed && "mr-2.5"
            )}
            aria-hidden="true"
          />
        </motion.div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <span className="whitespace-nowrap">AI Assistant</span>
            <motion.span
              className="px-1.5 py-0.5 text-[10px] font-bold bg-white/20 rounded-md uppercase tracking-wider"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Live
            </motion.span>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

function SidebarContent({ onNavClick, isCollapsed, toggleCollapse }: { onNavClick?: () => void, isCollapsed?: boolean, toggleCollapse?: () => void }) {
  return (
    <div className={clsx("flex flex-col h-full bg-navy-900 border-r border-white/5 transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
      {/* Logo */}
      <div className={clsx("flex items-center flex-shrink-0 px-4 py-8", isCollapsed ? "justify-center" : "justify-between")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-[2.5rem] h-10 w-10 bg-gradient-to-br from-gold-600 to-gold-800 rounded-lg flex items-center justify-center shadow-glow">
            <img src="/logo.png" alt="SyndiSync" className="h-8 w-8 object-contain" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="whitespace-nowrap"
            >
              <h1 className="text-white text-xl font-bold tracking-tight">SyndiSync</h1>
              <p className="text-gold-500/80 text-xs font-medium tracking-wider">AI-NATIVE LENDING</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2 mt-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onNavClick}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              clsx(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-white shadow-glass border border-white/5'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
                isCollapsed && 'justify-center'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={clsx(
                    "h-6 w-6 flex-shrink-0 transition-colors",
                    isActive ? "text-gold-400" : "text-slate-500 group-hover:text-white",
                    !isCollapsed && "mr-3"
                  )}
                  aria-hidden="true"
                />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* AI Assistant Button */}
        <AIChatButton isCollapsed={isCollapsed} />
      </nav>

      {/* Collapse Toggle (Desktop Only) */}
      {toggleCollapse && (
        <div className="hidden lg:flex justify-center py-4">
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-full bg-navy-800 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all"
          >
            {isCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Bottom section */}
      <div className={clsx("p-4 border-t border-white/10", isCollapsed ? "hidden" : "block")}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-navy-800 rounded-xl p-4">
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
            <div className="flex items-center justify-between px-2">
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

            {/* API Key Input */}
            {window.localStorage.getItem('liveMode') === 'true' && (
              <div className="bg-navy-900/50 p-3 rounded-lg border border-gold-500/30 animate-fade-in">
                <label className="text-xs text-gold-400 font-bold uppercase block mb-2">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="Paste API Key"
                  className="w-full bg-white/10 text-white text-xs p-2 rounded border border-white/10 focus:border-gold-500 focus:outline-none placeholder-slate-400"
                  defaultValue={window.localStorage.getItem('gemini_api_key') || ''}
                  onChange={(e) => window.localStorage.setItem('gemini_api_key', e.target.value)}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export interface SidebarProps {
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export default function Sidebar({ isCollapsed = false, toggleCollapse }: SidebarProps) {
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
      <div className={clsx("hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col z-20 transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
        <SidebarContent isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      </div>
    </>
  );
}
