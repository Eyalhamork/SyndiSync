import { ArrowUpIcon, CheckBadgeIcon } from '@heroicons/react/20/solid';
import { BoltIcon } from '@heroicons/react/24/outline';

interface ESGCardProps {
    score: number;
    carbonOffset: number;
    isSLLP: boolean;
}

export default function ESGCard({ score, carbonOffset, isSLLP }: ESGCardProps) {
    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-emerald-900 font-semibold flex items-center gap-2">
                        <BoltIcon className="h-5 w-5 text-emerald-600" />
                        Sustainability Score
                    </h3>
                    <p className="text-emerald-700 text-sm mt-1">Impact Assessment</p>
                </div>
                {isSLLP && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                        <CheckBadgeIcon className="h-3 w-3" />
                        SLLP Certified
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-emerald-600 text-xs font-medium uppercase tracking-wider">ESG Score</p>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-emerald-900">{score}</span>
                        <span className="text-xs font-medium text-emerald-600">/ 100</span>
                    </div>
                    <div className="mt-2 w-full bg-emerald-100 rounded-full h-1.5">
                        <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: `${score}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-emerald-600 text-xs font-medium uppercase tracking-wider">Carbon Offset</p>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-emerald-900">{carbonOffset.toLocaleString()}</span>
                        <span className="text-xs font-medium text-emerald-600">tons</span>
                    </div>
                    <p className="mt-2 text-xs text-emerald-700 flex items-center gap-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        12% vs last year
                    </p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-100">
                <p className="text-xs text-emerald-800">
                    <strong>Impact:</strong> {isSLLP ? 'Rate reduction of 2.5bps triggered if target met.' : 'No sustainability link active.'}
                </p>
            </div>
        </div>
    );
}
