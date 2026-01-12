import { FiPlus, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CurrencyCounter, AnimatedCounter } from '../common/AnimatedCounter';
import { useLiveNotifications } from '../../hooks/useLiveNotifications';
import { staggerContainer, staggerItem } from '../common/PageTransition';
import useAppStore from '../../store/appStore';
import { formatDistanceToNow, subHours, subDays } from 'date-fns';
import type { Deal } from '../../types';

// Demo deals to ensure the Recent Deals section is always populated
const DEMO_RECENT_DEALS: Deal[] = [
  {
    deal_id: 'demo_meridian',
    deal_name: 'Meridian Healthcare Acquisition',
    borrower: { name: 'Meridian Health Systems', industry: 'Healthcare', credit_rating: 'BBB+', annual_revenue: 2800000000, headquarters: 'Boston, MA', founded: 1998, employees: 12000 },
    deal_type: 'Acquisition',
    jurisdiction: 'New York Law',
    facility_amount: 750000000,
    currency: 'USD',
    tenor_months: 60,
    purpose: 'Acquisition financing',
    status: 'under_negotiation',
    created_at: subHours(new Date(), 4).toISOString(),
    updated_at: subHours(new Date(), 2).toISOString(),
    created_by: 'sarah.chen',
    arranger_bank: 'JP Morgan',
    esg_score: 88,
    carbon_offset_tons: 320,
    sustainability_linked: true
  },
  {
    deal_id: 'demo_aurora',
    deal_name: 'Aurora Energy Refinancing',
    borrower: { name: 'Aurora Energy Corp', industry: 'Energy', credit_rating: 'BBB', annual_revenue: 4500000000, headquarters: 'Houston, TX', founded: 2005, employees: 8500 },
    deal_type: 'Refinancing',
    jurisdiction: 'English Law',
    facility_amount: 1200000000,
    currency: 'USD',
    tenor_months: 84,
    purpose: 'Debt refinancing',
    status: 'draft',
    created_at: subDays(new Date(), 1).toISOString(),
    updated_at: subHours(new Date(), 18).toISOString(),
    created_by: 'michael.thompson',
    arranger_bank: 'Bank of America',
    esg_score: 94,
    carbon_offset_tons: 580,
    sustainability_linked: true
  },
  {
    deal_id: 'demo_nexus',
    deal_name: 'Nexus Logistics Expansion',
    borrower: { name: 'Nexus Global Logistics', industry: 'Transportation', credit_rating: 'BB+', annual_revenue: 950000000, headquarters: 'Chicago, IL', founded: 2012, employees: 3200 },
    deal_type: 'Growth Capital',
    jurisdiction: 'New York Law',
    facility_amount: 320000000,
    currency: 'USD',
    tenor_months: 48,
    purpose: 'Fleet expansion',
    status: 'approved',
    created_at: subDays(new Date(), 3).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    created_by: 'lisa.wong',
    arranger_bank: 'Citi',
    esg_score: 76,
    carbon_offset_tons: 180,
    sustainability_linked: false
  }
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const { deals, currentDeal, currentUser } = useAppStore();

  // Enable live activity notifications for wow factor
  useLiveNotifications(true);

  // Combine store deals with demo deals, filter out the current deal
  const allDeals = [...deals, ...DEMO_RECENT_DEALS];
  const uniqueDeals = allDeals.filter((deal, index, self) =>
    index === self.findIndex(d => d.deal_id === deal.deal_id)
  );
  const recentDeals = uniqueDeals
    .filter(d => d.deal_id !== currentDeal?.deal_id)
    .slice(0, 5);

  const handleNewDeal = () => {
    navigate('/generate');
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-navy-900 text-slate-100">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Good morning, <span className="text-gradient-gold">{currentUser.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400">
            {currentDeal
              ? `Focusing on ${currentDeal.deal_name}`
              : 'Your deal pipeline requires attention.'}
          </p>
        </div>
        <motion.button
          onClick={handleNewDeal}
          className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 font-medium hover:bg-gold-500/20 hover:border-gold-500/50 transition-all group"
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(204, 164, 59, 0.3)' }}
          whileTap={{ scale: 0.98 }}
        >
          <FiPlus className="group-hover:rotate-90 transition-transform" />
          <span>New Deal</span>
        </motion.button>
      </motion.div>

      {/* Main Content Areas Staggered */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-8"
      >

        {/* ESG Intelligence Card Link */}
        <motion.div
          variants={staggerItem}
          onClick={() => navigate('/analytics')}
          className="glass-card p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all border-l-4 border-green-500"
          whileHover={{ x: 4, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌿
            </motion.div>
            <div>
              <h3 className="text-white font-bold text-lg">ESG Intelligence</h3>
              <p className="text-slate-400 text-sm">Portfolio Sustainability Score</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-400">92/100</p>
            <p className="text-xs text-green-500 font-medium flex items-center justify-end gap-1">
              <FiCheckCircle /> SLLP Certified
            </p>
          </div>
        </motion.div>

        {/* Grid Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer} // Nested stagger
        >
          <motion.div className="glass-card p-6 rounded-2xl" variants={staggerItem} whileHover={{ y: -4 }}>
            <p className="text-slate-400 text-sm">Active Volume</p>
            <p className="text-3xl font-bold mt-2 text-primary-400">
              $<AnimatedCounter value={15.2} decimals={1} duration={2000} />B
            </p>
          </motion.div>
          <motion.div className="glass-card p-6 rounded-2xl" variants={staggerItem} whileHover={{ y: -4 }}>
            <p className="text-slate-400 text-sm">Deals in Progress</p>
            <p className="text-3xl font-bold mt-2 text-white">
              <AnimatedCounter value={deals.length} decimals={0} duration={1500} />
            </p>
          </motion.div>
          <motion.div className="glass-card p-6 rounded-2xl" variants={staggerItem} whileHover={{ y: -4 }}>
            <p className="text-slate-400 text-sm">Avg. Close Time</p>
            <p className="text-3xl font-bold mt-2 text-gold-400">
              <AnimatedCounter value={12} decimals={0} duration={1800} /> Days
            </p>
          </motion.div>
        </motion.div>

        {/* ROI Savings Card */}
        <motion.div
          variants={staggerItem}
          className="glass-card p-6 rounded-2xl border-l-4 border-gold-500"
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Deal ROI Calculator</h3>
              <p className="text-slate-400 text-sm">{currentDeal ? `Total Savings for "${currentDeal.deal_name}"` : 'Total Potential Savings'}</p>
            </div>
            <div className="text-right">
              <motion.p
                className="text-4xl font-bold text-gold-400"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              >
                <CurrencyCounter value={2060000} duration={2500} />
              </motion.p>
              <p className="text-xs text-green-400 font-medium">
                <AnimatedCounter value={87} decimals={0} duration={1500} />% cost reduction
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Legal Fees</p>
              <p className="text-lg font-semibold text-white">
                <CurrencyCounter value={1200000} duration={2200} /> saved
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time Value</p>
              <p className="text-lg font-semibold text-white">
                <CurrencyCounter value={650000} duration={2000} />
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Opportunity</p>
              <p className="text-lg font-semibold text-white">
                <CurrencyCounter value={210000} duration={1800} />
              </p>
            </div>
          </div>
        </motion.div>

        {/* Active Deals List */}
        <motion.div
          variants={staggerItem}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Other Active Deals</h3>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Recent Activity</span>
          </div>

          {recentDeals.length === 0 ? (
            <div className="text-center py-8 text-slate-500 italic">
              No other active deals. Start a new one!
            </div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {recentDeals.map((deal) => (
                <motion.div
                  key={deal.deal_id}
                  onClick={() => navigate('/documents')} // Or switch context
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-gold-500/20"
                  variants={staggerItem}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-navy-800 flex items-center justify-center text-gold-500"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <FiFileText size={24} />
                    </motion.div>
                    <div>
                      <h4 className="text-white font-medium text-lg group-hover:text-gold-400 transition-colors">{deal.deal_name}</h4>
                      <p className="text-sm text-slate-400">{deal.arranger_bank || 'Syndicated'} • {formatDistanceToNow(new Date(deal.updated_at || deal.created_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${(deal.facility_amount / 1000000).toFixed(0)}M</p>
                    <div className={`text-xs px-3 py-1 rounded-full inline-block mt-1 ${deal.status === 'draft' ? 'bg-primary-500/20 text-primary-400' :
                      deal.status === 'under_negotiation' ? 'bg-gold-500/20 text-gold-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                      {deal.status.replace('_', ' ')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
