// src/components/layout/Navbar.tsx
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  Bars3Icon,
  SparklesIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import useAppStore from '../../store/appStore';
import VoiceControl from './VoiceControl';

import DealSelector from './DealSelector';

// Demo notifications
const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Sarah Chen commented on Section 7.1',
    time: '5 min ago',
    unread: true,
  },
  {
    id: '2',
    title: 'Document generation complete',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: '3',
    title: 'AI resolved leverage covenant conflict',
    time: '2 hours ago',
    unread: true,
  },
];

// Demo search results
const DEMO_SEARCH_RESULTS = [
  {
    id: '1',
    type: 'deal',
    title: 'TechCorp LBO Financing',
    subtitle: '$450M Facility | Active',
    icon: BriefcaseIcon,
    route: '/dashboard'
  },
  {
    id: '2',
    type: 'document',
    title: 'TechCorp Facility Agreement v1',
    subtitle: '287 pages | Under Review',
    icon: DocumentTextIcon,
    route: '/documents'
  },
  {
    id: '3',
    type: 'negotiation',
    title: 'Total Net Leverage Ratio',
    subtitle: 'Section 7.1 | 5 parties',
    icon: ChatBubbleLeftRightIcon,
    route: '/negotiations'
  },
];

export default function Navbar() {
  const { currentUser, toggleMobileMenu } = useAppStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredResults = searchQuery.trim()
    ? DEMO_SEARCH_RESULTS.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : DEMO_SEARCH_RESULTS;

  const handleSearchClick = (route: string) => {
    navigate(route);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 fixed top-0 right-0 left-0 z-30 lg:left-64">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        <div className="flex items-center flex-1 max-w-4xl">
          {/* Deal Selector - Context Switcher */}
          <div className="hidden md:block">
            <DealSelector />
          </div>

          {/* Search - Hidden on mobile, visible on md+ */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                placeholder="Search deals, documents, negotiations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    {searchQuery ? `Results for "${searchQuery}"` : 'Recent & Suggested'}
                  </p>
                </div>
                {filteredResults.length > 0 ? (
                  <div className="py-2">
                    {filteredResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSearchClick(result.route)}
                        className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left flex items-start gap-3"
                      >
                        <result.icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{result.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{result.subtitle}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${result.type === 'deal' ? 'bg-blue-100 text-blue-700' :
                          result.type === 'document' ? 'bg-green-100 text-green-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                          {result.type}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching for deals, documents, or negotiations</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* Voice Control - NEW */}
          <VoiceControl />

          {/* Demo Mode Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
            <SparklesIcon className="h-4 w-4" />
            <span>Demo Mode</span>
          </div>

          {/* Notifications Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                3
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="py-1">
                  {DEMO_NOTIFICATIONS.map((notification) => (
                    <Menu.Item key={notification.id}>
                      {({ active }) => (
                        <button
                          className={`${active ? 'bg-gray-50' : ''
                            } w-full px-4 py-3 text-left border-b border-gray-100 last:border-0 transition-colors`}
                          onClick={() => console.log('Notification clicked:', notification.title)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 h-2 w-2 rounded-full ${notification.unread ? 'bg-primary-500' : 'bg-gray-300'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* User Profile Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-10 w-10 rounded-full"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-600">{currentUser.organization}</p>
              </div>
              <ChevronDownIcon className="hidden md:block h-4 w-4 text-gray-400" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-gray-50' : ''
                          } w-full px-4 py-2 text-left flex items-center gap-3 cursor-not-allowed`}
                        disabled
                      >
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-400">Profile</span>
                          <span className="block text-xs text-gray-400">Coming Soon</span>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-gray-50' : ''
                          } w-full px-4 py-2 text-left flex items-center gap-3 cursor-not-allowed`}
                        disabled
                      >
                        <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-400">Settings</span>
                          <span className="block text-xs text-gray-400">Coming Soon</span>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-200 my-1" />
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-2 text-amber-700 bg-amber-50 rounded px-2 py-1.5">
                      <SparklesIcon className="h-4 w-4" />
                      <span className="text-xs font-medium">Demo Mode Active</span>
                    </div>
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
}
