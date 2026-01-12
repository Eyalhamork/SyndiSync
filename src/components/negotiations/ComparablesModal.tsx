// src/components/negotiations/ComparablesModal.tsx
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { COMPARABLE_DEALS, MARKET_STATS, type ComparableDeal } from '../../data/comparable-deals';

interface ComparablesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ComparablesModal({ isOpen, onClose }: ComparablesModalProps) {
    const [filter, setFilter] = useState<'all' | 'esg' | 'recent'>('all');

    const filteredDeals = COMPARABLE_DEALS.filter(deal => {
        if (filter === 'esg') return deal.esg_linked;
        if (filter === 'recent') return deal.deal_date.includes('2024');
        return true;
    });

    const handleExport = () => {
        // Create CSV content
        const headers = ['Borrower', 'Sponsor', 'Date', 'Size ($M)', 'Leverage', 'Margin (bps)', 'Industry', 'Tenor', 'Cov-Lite', 'ESG'];
        const rows = filteredDeals.map(d => [
            d.borrower,
            d.sponsor,
            d.deal_date,
            d.deal_size_mm,
            d.leverage_ratio,
            d.interest_margin_bps,
            d.industry,
            d.tenor_months,
            d.covenant_lite ? 'Yes' : 'No',
            d.esg_linked ? 'Yes' : 'No'
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'comparable_deals.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-navy-800 border border-white/10 shadow-2xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                                    <div>
                                        <Dialog.Title className="text-xl font-bold text-white">
                                            Comparable Transactions Database
                                        </Dialog.Title>
                                        <p className="text-sm text-slate-400 mt-1">
                                            {MARKET_STATS.sample_size} deals from Q3 2023 - Q4 2024
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Stats Banner */}
                                <div className="grid grid-cols-5 gap-4 p-4 bg-navy-900/50 border-b border-white/5">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gold-400">{MARKET_STATS.leverage.median}x</p>
                                        <p className="text-xs text-slate-500">Median Leverage</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-white">{MARKET_STATS.margin.median}</p>
                                        <p className="text-xs text-slate-500">Median Margin (bps)</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-white">${Math.round(MARKET_STATS.deal_size.median)}M</p>
                                        <p className="text-xs text-slate-500">Median Deal Size</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-400">{MARKET_STATS.esg_linked_pct}%</p>
                                        <p className="text-xs text-slate-500">ESG-Linked</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-white">{MARKET_STATS.covenant_lite_pct}%</p>
                                        <p className="text-xs text-slate-500">Covenant-Lite</p>
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="flex items-center justify-between px-6 py-3 bg-navy-800">
                                    <div className="flex items-center gap-2">
                                        <FunnelIcon className="h-4 w-4 text-slate-400" />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setFilter('all')}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'all'
                                                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                                        : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                All ({COMPARABLE_DEALS.length})
                                            </button>
                                            <button
                                                onClick={() => setFilter('esg')}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'esg'
                                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                        : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                ESG-Linked ({COMPARABLE_DEALS.filter(d => d.esg_linked).length})
                                            </button>
                                            <button
                                                onClick={() => setFilter('recent')}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'recent'
                                                        ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                                                        : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                2024 Only ({COMPARABLE_DEALS.filter(d => d.deal_date.includes('2024')).length})
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleExport}
                                        className="flex items-center gap-2 px-4 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-600 transition-colors text-sm"
                                    >
                                        <ArrowDownTrayIcon className="h-4 w-4" />
                                        Export CSV
                                    </button>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-navy-900 sticky top-0">
                                            <tr>
                                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Borrower</th>
                                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Sponsor</th>
                                                <th className="text-center px-4 py-3 text-slate-400 font-medium">Date</th>
                                                <th className="text-right px-4 py-3 text-slate-400 font-medium">Size</th>
                                                <th className="text-center px-4 py-3 text-slate-400 font-medium">Leverage</th>
                                                <th className="text-center px-4 py-3 text-slate-400 font-medium">Margin</th>
                                                <th className="text-center px-4 py-3 text-slate-400 font-medium">ESG</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDeals.map((deal, idx) => (
                                                <DealRow key={idx} deal={deal} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 border-t border-white/10 bg-navy-900/50">
                                    <p className="text-xs text-slate-500">
                                        Data sourced from S&P LCD, PitchBook, and public SEC filings. Manufacturing LBO transactions Q3 2023 - Q4 2024.
                                    </p>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

function DealRow({ deal }: { deal: ComparableDeal }) {
    const leverageColor = deal.leverage_ratio >= 5.2
        ? 'text-red-400'
        : deal.leverage_ratio <= 4.7
            ? 'text-green-400'
            : 'text-white';

    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="px-4 py-3 text-white font-medium">{deal.borrower}</td>
            <td className="px-4 py-3 text-slate-300">{deal.sponsor}</td>
            <td className="px-4 py-3 text-center text-slate-400">{deal.deal_date}</td>
            <td className="px-4 py-3 text-right text-white font-medium">${deal.deal_size_mm}M</td>
            <td className={`px-4 py-3 text-center font-bold ${leverageColor}`}>{deal.leverage_ratio}x</td>
            <td className="px-4 py-3 text-center text-slate-300">{deal.interest_margin_bps}</td>
            <td className="px-4 py-3 text-center">
                {deal.esg_linked ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        ✓ ESG
                    </span>
                ) : (
                    <span className="text-slate-500">—</span>
                )}
            </td>
        </tr>
    );
}
