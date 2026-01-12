// src/components/analytics/ESGMethodologyModal.tsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FiCheck, FiInfo } from 'react-icons/fi';

interface ESGMethodologyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const METHODOLOGY_SECTIONS = [
    {
        title: 'Environmental Score (40%)',
        icon: '🌍',
        color: 'green',
        criteria: [
            { name: 'Carbon Reduction Targets', weight: '15%', description: 'Science-based targets aligned with Paris Agreement' },
            { name: 'Renewable Energy Usage', weight: '10%', description: 'Percentage of operations powered by renewables' },
            { name: 'Waste & Water Management', weight: '10%', description: 'Circular economy initiatives and water stewardship' },
            { name: 'Environmental Certifications', weight: '5%', description: 'ISO 14001, LEED, B Corp, etc.' },
        ]
    },
    {
        title: 'Social Score (30%)',
        icon: '👥',
        color: 'blue',
        criteria: [
            { name: 'Workforce Diversity', weight: '10%', description: 'Gender, ethnic, and leadership diversity metrics' },
            { name: 'Employee Safety & Wellbeing', weight: '10%', description: 'OSHA compliance, mental health programs' },
            { name: 'Community Engagement', weight: '5%', description: 'Local hiring, charitable initiatives' },
            { name: 'Supply Chain Ethics', weight: '5%', description: 'Modern slavery audits, fair trade practices' },
        ]
    },
    {
        title: 'Governance Score (30%)',
        icon: '🏛️',
        color: 'purple',
        criteria: [
            { name: 'Board Independence', weight: '10%', description: 'Independent directors, committees, oversight' },
            { name: 'Executive Compensation', weight: '8%', description: 'ESG-linked pay, CEO-worker pay ratio' },
            { name: 'Transparency & Reporting', weight: '7%', description: 'TCFD, SASB, GRI disclosures' },
            { name: 'Anti-Corruption Policies', weight: '5%', description: 'FCPA compliance, whistleblower programs' },
        ]
    }
];

const MARGIN_ADJUSTMENT_TABLE = [
    { score: '90-100', adjustment: '-5.5 bps', label: 'Excellent', color: 'text-green-400' },
    { score: '80-89', adjustment: '-3.0 bps', label: 'Good', color: 'text-green-300' },
    { score: '70-79', adjustment: '0 bps', label: 'Average', color: 'text-slate-300' },
    { score: '60-69', adjustment: '+2.5 bps', label: 'Below Average', color: 'text-yellow-400' },
    { score: '<60', adjustment: '+5.0 bps', label: 'Poor', color: 'text-red-400' },
];

export default function ESGMethodologyModal({ isOpen, onClose }: ESGMethodologyModalProps) {
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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-navy-800 border border-white/10 shadow-2xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-green-900/30 to-navy-800">
                                    <div>
                                        <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
                                            🌱 ESG Scoring Methodology
                                        </Dialog.Title>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Based on SLLP, ICMA Green Bond Principles, and UN SDG Framework
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="max-h-[70vh] overflow-y-auto">
                                    {/* Scoring Breakdown */}
                                    <div className="p-6 space-y-6">
                                        {METHODOLOGY_SECTIONS.map((section, idx) => (
                                            <div key={idx} className={`rounded-xl border ${section.color === 'green' ? 'border-green-500/30 bg-green-900/10' :
                                                    section.color === 'blue' ? 'border-blue-500/30 bg-blue-900/10' :
                                                        'border-purple-500/30 bg-purple-900/10'
                                                }`}>
                                                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        <span className="text-xl">{section.icon}</span>
                                                        {section.title}
                                                    </h3>
                                                </div>
                                                <div className="p-4">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="text-slate-400 text-xs uppercase">
                                                                <th className="text-left pb-2">Criteria</th>
                                                                <th className="text-center pb-2 w-20">Weight</th>
                                                                <th className="text-left pb-2">Description</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {section.criteria.map((criterion, cIdx) => (
                                                                <tr key={cIdx} className="border-t border-white/5">
                                                                    <td className="py-2 text-white font-medium flex items-center gap-2">
                                                                        <FiCheck className={`${section.color === 'green' ? 'text-green-400' :
                                                                                section.color === 'blue' ? 'text-blue-400' :
                                                                                    'text-purple-400'
                                                                            }`} />
                                                                        {criterion.name}
                                                                    </td>
                                                                    <td className="py-2 text-center text-slate-300">{criterion.weight}</td>
                                                                    <td className="py-2 text-slate-400">{criterion.description}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Margin Adjustment Table */}
                                        <div className="rounded-xl border border-gold-500/30 bg-gold-900/10">
                                            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                                <h3 className="font-bold text-white flex items-center gap-2">
                                                    💰 Interest Margin Adjustment
                                                </h3>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <FiInfo size={12} />
                                                    Applied to base SOFR margin
                                                </span>
                                            </div>
                                            <div className="p-4">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-slate-400 text-xs uppercase">
                                                            <th className="text-left pb-2">ESG Score Range</th>
                                                            <th className="text-center pb-2">Margin Adjustment</th>
                                                            <th className="text-center pb-2">Rating</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {MARGIN_ADJUSTMENT_TABLE.map((row, idx) => (
                                                            <tr key={idx} className="border-t border-white/5">
                                                                <td className="py-2 text-white font-mono">{row.score}</td>
                                                                <td className={`py-2 text-center font-bold ${row.color}`}>{row.adjustment}</td>
                                                                <td className={`py-2 text-center ${row.color}`}>{row.label}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Data Sources */}
                                        <div className="rounded-xl bg-navy-900/50 p-4 border border-white/5">
                                            <h4 className="text-sm font-semibold text-white mb-2">Data Sources & Standards</h4>
                                            <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    Sustainability-Linked Loan Principles (SLLP)
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    ICMA Green Bond Principles
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                                    Task Force on Climate-related Financial Disclosures (TCFD)
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-gold-500"></div>
                                                    UN Sustainable Development Goals (SDGs)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 border-t border-white/10 bg-navy-900/50 flex justify-between items-center">
                                    <p className="text-xs text-slate-500">
                                        Methodology last updated: Q4 2025 • SyndiSync AI ESG Framework v2.1
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                        Got It
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
