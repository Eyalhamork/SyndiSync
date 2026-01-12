import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon, FolderIcon } from '@heroicons/react/24/outline';
import useAppStore from '../../store/appStore';
import { useNavigate } from 'react-router-dom';

export default function DealSelector() {
    const { currentDeal, deals, setCurrentDeal } = useAppStore();
    const navigate = useNavigate();

    const handleSelectDeal = (dealId: string) => {
        const selected = deals.find(d => d.deal_id === dealId);
        if (selected) {
            setCurrentDeal(selected);
            // Optional: Navigate to dashboard on switch to ensure context is fresh
            navigate('/dashboard');
        }
    };

    const handleNewDeal = () => {
        navigate('/generate');
    };

    if (!currentDeal && deals.length === 0) {
        return (
            <button
                onClick={handleNewDeal}
                className="flex items-center gap-2 px-3 py-1.5 bg-gold-500/10 text-gold-600 rounded-lg text-sm font-medium hover:bg-gold-500/20 transition-colors border border-gold-500/20"
            >
                <PlusIcon className="h-4 w-4" />
                <span>Create First Deal</span>
            </button>
        )
    }

    return (
        <div className="relative mr-4">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="group inline-flex w-full items-center justify-between gap-x-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-100 rounded text-blue-600">
                                <FolderIcon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider leading-none mb-0.5">Current Deal</span>
                                <span className="text-gray-900 leading-none">{currentDeal?.deal_name || 'Select Deal'}</span>
                            </div>
                        </div>
                        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-0 z-50 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                        <div className="py-2 px-2 max-h-64 overflow-y-auto">
                            <div className="px-2 py-1 mb-1">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Deals</p>
                            </div>
                            {deals.map((deal) => (
                                <Menu.Item key={deal.deal_id}>
                                    {({ active }) => (
                                        <button
                                            onClick={() => handleSelectDeal(deal.deal_id)}
                                            className={`${active ? 'bg-gray-50' : ''
                                                } ${currentDeal?.deal_id === deal.deal_id ? 'bg-blue-50/50' : ''
                                                } group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors`}
                                        >
                                            <div className={`p-1.5 rounded-md ${currentDeal?.deal_id === deal.deal_id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm'}`}>
                                                <FolderIcon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className={`font-medium ${currentDeal?.deal_id === deal.deal_id ? 'text-blue-700' : 'text-gray-900'}`}>{deal.deal_name}</p>
                                                <p className="text-xs text-gray-500">${(deal.facility_amount / 1000000).toFixed(0)}M • {deal.status}</p>
                                            </div>
                                            {currentDeal?.deal_id === deal.deal_id && (
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            )}
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                        <div className="p-2">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleNewDeal}
                                        className={`${active ? 'bg-gold-50 text-gold-700' : 'text-gray-700'
                                            } group flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-dashed border-gray-300 hover:border-gold-400 hover:text-gold-600 transition-all`}
                                    >
                                        <PlusIcon className="h-4 w-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                                        New Deal
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
