# 🏗️ SyndiSync AI - Multi-Deal Architecture
**From Single Hardcoded Deal to Scalable Multi-Deal System**  
**Implementation Time:** 6-8 hours

---

## CURRENT STATE ANALYSIS

### **What You Have Now:**
```typescript
// appStore.ts
currentDeal: Deal | null;  // Single deal
deals: Deal[];             // Array exists but only holds 1 deal
```

**Problems:**
1. ❌ Can only work with one deal at a time
2. ❌ Demo data is loaded once and persisted
3. ❌ No way to create new deals from UI
4. ❌ Documents/negotiations are not properly filtered by deal

---

## TARGET ARCHITECTURE

### **What You Need:**
```typescript
// appStore.ts
deals: Deal[];              // Multiple deals
currentDealId: string | null;  // Active deal ID
documents: Document[];      // All documents (filtered by deal_id)
negotiations: Negotiation[]; // All negotiations (filtered by deal_id)
```

**Features:**
1. ✅ Support 2-5 concurrent deals
2. ✅ Switch between deals via dropdown
3. ✅ Create new deal from term sheet upload
4. ✅ Each deal has isolated documents/negotiations
5. ✅ Persist all deals to localStorage

---

## IMPLEMENTATION PLAN

### **STEP 1: Update Zustand Store (2 hours)**

```typescript
// src/store/appStore.ts

interface AppState {
  // UPDATED: Multi-deal support
  deals: Deal[];
  currentDealId: string | null;
  
  // Keep existing
  documents: Document[];
  negotiations: Negotiation[];
  parties: Party[];
  activities: Activity[];
  stats: DashboardStats | null;
  currentUser: User;
  
  // ... rest of state
  
  // UPDATED ACTIONS
  setCurrentDeal: (dealId: string | null) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  deleteDeal: (dealId: string) => void;
  
  // NEW ACTIONS
  createDealFromTermSheet: (file: File, extractedData: any) => Promise<void>;
  
  // COMPUTED GETTERS (not in store, but useful)
  getCurrentDeal: () => Deal | null;
  getCurrentDocuments: () => Document[];
  getCurrentNegotiations: () => Negotiation[];
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      deals: [],
      currentDealId: null,
      documents: [],
      negotiations: [],
      parties: [],
      activities: [],
      stats: null,
      currentUser: DEFAULT_USER,
      
      // ... rest of initial state
      
      // UPDATED: Set current deal by ID
      setCurrentDeal: (dealId) => set({ currentDealId: dealId }),
      
      // UPDATED: Add deal and set as current
      addDeal: (deal) => set((state) => ({
        deals: [...state.deals, deal],
        currentDealId: deal.deal_id
      })),
      
      // NEW: Update existing deal
      updateDeal: (dealId, updates) => set((state) => ({
        deals: state.deals.map(d => 
          d.deal_id === dealId ? { ...d, ...updates } : d
        )
      })),
      
      // NEW: Delete deal and its associated data
      deleteDeal: (dealId) => set((state) => ({
        deals: state.deals.filter(d => d.deal_id !== dealId),
        documents: state.documents.filter(doc => doc.deal_id !== dealId),
        negotiations: state.negotiations.filter(neg => neg.deal_id !== dealId),
        currentDealId: state.currentDealId === dealId 
          ? (state.deals.length > 1 ? state.deals[0].deal_id : null)
          : state.currentDealId
      })),
      
      // NEW: Create deal from term sheet upload
      createDealFromTermSheet: async (file, extractedData) => {
        const newDeal: Deal = {
          deal_id: `deal_${Date.now()}`,
          deal_name: extractedData.borrower?.name || file.name.replace('.pdf', ''),
          borrower: extractedData.borrower || {
            name: file.name.replace('.pdf', ''),
            industry: 'Unknown',
            credit_rating: 'NR',
            annual_revenue: 0,
            headquarters: 'Unknown',
            founded: 2020,
            employees: 0
          },
          deal_type: extractedData.facility?.type || 'LBO',
          jurisdiction: 'new_york_law',
          facility_amount: extractedData.facility?.amount || 0,
          currency: extractedData.facility?.currency || 'USD',
          tenor_months: extractedData.facility?.tenor_months || 60,
          purpose: extractedData.facility?.purpose || 'General corporate purposes',
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: get().currentUser.email,
          arranger_bank: get().currentUser.organization,
          esg_score: 0,
          carbon_offset_tons: 0,
          sustainability_linked: false
        };
        
        set((state) => ({
          deals: [...state.deals, newDeal],
          currentDealId: newDeal.deal_id
        }));
      },
      
      // HELPER: Get current deal object
      getCurrentDeal: () => {
        const state = get();
        return state.deals.find(d => d.deal_id === state.currentDealId) || null;
      },
      
      // HELPER: Get documents for current deal
      getCurrentDocuments: () => {
        const state = get();
        return state.documents.filter(doc => doc.deal_id === state.currentDealId);
      },
      
      // HELPER: Get negotiations for current deal
      getCurrentNegotiations: () => {
        const state = get();
        return state.negotiations.filter(neg => neg.deal_id === state.currentDealId);
      },
      
      // UPDATED: Load demo data (now creates a demo deal)
      loadDemoData: () => {
        const state = get();
        
        // Only load if no deals exist
        if (state.deals.length === 0) {
          set({
            deals: [DEMO_DEAL],
            currentDealId: DEMO_DEAL.deal_id,
            documents: [DEMO_DOCUMENT],
            parties: DEMO_PARTIES,
            negotiations: DEMO_NEGOTIATIONS,
            activities: DEMO_ACTIVITIES,
            stats: DEMO_STATS
          });
        }
      },
      
      // ... rest of actions
    }),
    {
      name: 'syndisync-storage',
      version: 2, // BUMP VERSION for migration
      migrate: (persistedState: any, version: number) => {
        // Migration from v1 to v2: Convert single deal to array
        if (version < 2 && persistedState?.currentDeal) {
          return {
            ...persistedState,
            deals: [persistedState.currentDeal],
            currentDealId: persistedState.currentDeal.deal_id,
            currentDeal: undefined // Remove old field
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        deals: state.deals,
        currentDealId: state.currentDealId,
        documents: state.documents,
        negotiations: state.negotiations,
        parties: state.parties,
        activities: state.activities,
        stats: state.stats,
        isDemoMode: state.isDemoMode
      })
    }
  )
);

export default useAppStore;
```

---

### **STEP 2: Update Components (4-6 hours)**

#### **2A: Add Deal Selector to Navbar (1 hour)**

```typescript
// src/components/layout/Navbar.tsx

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FiChevronDown, FiPlus } from 'react-icons/fi';
import useAppStore from '../../store/appStore';

export function Navbar() {
  const { deals, currentDealId, setCurrentDeal } = useAppStore();
  const currentDeal = deals.find(d => d.deal_id === currentDealId);
  
  return (
    <nav className="bg-navy-800 border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-white">SyndiSync AI</div>
        
        {/* Deal Selector */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-navy-700 hover:bg-navy-600 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-xs text-slate-400">Current Deal</div>
              <div className="text-sm font-medium text-white">
                {currentDeal?.deal_name || 'No Deal Selected'}
              </div>
            </div>
            <FiChevronDown className="text-slate-400" />
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
            <Menu.Items className="absolute right-0 mt-2 w-72 bg-navy-800 border border-white/10 rounded-lg shadow-xl z-50">
              <div className="p-2">
                {deals.map((deal) => (
                  <Menu.Item key={deal.deal_id}>
                    {({ active }) => (
                      <button
                        onClick={() => setCurrentDeal(deal.deal_id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          active ? 'bg-navy-700' : ''
                        } ${
                          deal.deal_id === currentDealId ? 'bg-primary-600/20 border-l-2 border-primary-500' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-white">
                          {deal.deal_name}
                        </div>
                        <div className="text-xs text-slate-400">
                          ${(deal.facility_amount / 1000000).toFixed(0)}M • {deal.deal_type}
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                ))}
                
                {/* New Deal Button */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {/* Navigate to document upload */}}
                      className={`w-full text-left px-3 py-2 rounded-lg mt-2 border-t border-white/10 transition-colors ${
                        active ? 'bg-navy-700' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 text-primary-400">
                        <FiPlus />
                        <span className="text-sm font-medium">New Deal</span>
                      </div>
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        
        {/* Rest of navbar */}
      </div>
    </nav>
  );
}
```

#### **2B: Update DashboardHome to Filter by Deal (1 hour)**

```typescript
// src/components/dashboard/DashboardHome.tsx

export function DashboardHome() {
  const { 
    getCurrentDeal, 
    getCurrentDocuments, 
    getCurrentNegotiations,
    stats 
  } = useAppStore();
  
  const currentDeal = getCurrentDeal();
  const documents = getCurrentDocuments();
  const negotiations = getCurrentNegotiations();
  
  if (!currentDeal) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Deal Selected</h2>
          <p className="text-slate-400 mb-6">Create a new deal to get started</p>
          <button className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg">
            Create New Deal
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      {/* Deal Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{currentDeal.deal_name}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
          <span>{currentDeal.borrower.name}</span>
          <span>•</span>
          <span>${(currentDeal.facility_amount / 1000000).toFixed(0)}M</span>
          <span>•</span>
          <span>{currentDeal.deal_type}</span>
        </div>
      </div>
      
      {/* Stats Cards - filtered by current deal */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Documents" 
          value={documents.length} 
          icon={FiFileText}
        />
        <StatCard 
          title="Active Negotiations" 
          value={negotiations.filter(n => n.status === 'pending').length} 
          icon={FiAlertTriangle}
        />
        {/* ... rest of stats */}
      </div>
      
      {/* Rest of dashboard */}
    </div>
  );
}
```

#### **2C: Update DocumentGenerator to Create Deal (2 hours)**

```typescript
// src/components/documents/DocumentGenerator.tsx

import { analyzeTermSheet, analyzeTermSheetImage, initializeGemini, getApiKey } from '../../lib/gemini';

export default function DocumentGenerator() {
  const { createDealFromTermSheet, currentDealId } = useAppStore();
  const [state, setState] = useState<GeneratorState>('upload');
  
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setState('generating');
    
    // Step 1: Analyze term sheet with Gemini
    const apiKey = getApiKey();
    if (apiKey) {
      try {
        initializeGemini(apiKey);
        
        let analysisResult;
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
          // Convert to base64
          const base64 = await fileToBase64(file);
          analysisResult = await analyzeTermSheetImage(base64, file.type);
        } else {
          // Text extraction (for DOCX, TXT)
          const text = await file.text();
          analysisResult = await analyzeTermSheet(text);
        }
        
        // Parse JSON response
        const extractedData = JSON.parse(cleanGeminiResponse(analysisResult));
        
        // Step 2: Create new deal
        await createDealFromTermSheet(file, extractedData);
        
      } catch (error) {
        console.error('Term sheet analysis failed:', error);
        // Fall back to creating deal with minimal data
        await createDealFromTermSheet(file, {});
      }
    } else {
      // No API key - create deal with minimal data
      await createDealFromTermSheet(file, {});
    }
    
    // Step 3: Continue with document generation
    startGeneration(file);
  };
  
  // ... rest of component
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result?.toString().split(',')[1];
      resolve(base64 || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function cleanGeminiResponse(text: string): string {
  // Remove markdown code blocks
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}
```

#### **2D: Update DocumentsList to Filter (30 min)**

```typescript
// src/components/documents/DocumentsList.tsx

export function DocumentsList() {
  const { getCurrentDocuments } = useAppStore();
  const documents = getCurrentDocuments();
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Documents</h2>
      {documents.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No documents generated for this deal yet.
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map(doc => (
            <DocumentCard key={doc.document_id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### **2E: Update NegotiationHub to Filter (30 min)**

```typescript
// src/components/negotiations/NegotiationHub.tsx

export function NegotiationHub() {
  const { getCurrentNegotiations } = useAppStore();
  const negotiations = getCurrentNegotiations();
  
  // ... rest of component uses filtered negotiations
}
```

---

### **STEP 3: Testing (1 hour)**

#### **Test Scenarios:**

1. **Load demo data** → Should create 1 deal
2. **Upload new term sheet** → Should create 2nd deal and switch to it
3. **Switch between deals** → Documents/negotiations should filter correctly
4. **Refresh page** → All deals should persist
5. **Delete deal** → Should remove deal and associated data

---

## STATE PERSISTENCE

### **localStorage Structure:**

```json
{
  "syndisync-storage": {
    "state": {
      "deals": [
        {
          "deal_id": "deal_20250112_001",
          "deal_name": "TechCorp LBO Financing",
          "..."
        },
        {
          "deal_id": "deal_20250113_002",
          "deal_name": "Acme Corp Acquisition",
          "..."
        }
      ],
      "currentDealId": "deal_20250113_002",
      "documents": [
        { "document_id": "doc_001", "deal_id": "deal_20250112_001", "..." },
        { "document_id": "doc_002", "deal_id": "deal_20250113_002", "..." }
      ],
      "negotiations": [
        { "negotiation_id": "neg_001", "deal_id": "deal_20250112_001", "..." },
        { "negotiation_id": "neg_002", "deal_id": "deal_20250113_002", "..." }
      ]
    },
    "version": 2
  }
}
```

---

## MIGRATION STRATEGY

### **Handling Existing Users:**

Users with v1 data (single `currentDeal`) will automatically migrate to v2 (multi-deal):

```typescript
migrate: (persistedState: any, version: number) => {
  if (version < 2 && persistedState?.currentDeal) {
    return {
      ...persistedState,
      deals: [persistedState.currentDeal],
      currentDealId: persistedState.currentDeal.deal_id,
      currentDeal: undefined
    };
  }
  return persistedState;
}
```

---

## UI MOCKUP

```
┌─────────────────────────────────────────────────────────────┐
│ SyndiSync AI    [TechCorp LBO ▼]         [User Menu]        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TechCorp LBO Financing                                     │
│  TechCorp Industries Inc. • $450M • LBO                     │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Docs: 1  │ │ Negs: 3  │ │ Saved:   │ │ Time:    │      │
│  │          │ │          │ │ $2.0M    │ │ 960 hrs  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Deal Dropdown:
┌─────────────────────────────────────┐
│ ✓ TechCorp LBO Financing            │
│   $450M • LBO                        │
├─────────────────────────────────────┤
│   Acme Corp Acquisition              │
│   $320M • Acquisition Finance        │
├─────────────────────────────────────┤
│ + New Deal                           │
└─────────────────────────────────────┘
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Update `appStore.ts` with multi-deal state
- [ ] Add migration logic for v1 → v2
- [ ] Create `Navbar.tsx` deal selector dropdown
- [ ] Update `DashboardHome.tsx` to filter by deal
- [ ] Update `DocumentGenerator.tsx` to create deals
- [ ] Update `DocumentsList.tsx` to filter documents
- [ ] Update `NegotiationHub.tsx` to filter negotiations
- [ ] Add "No deal selected" empty state
- [ ] Test deal switching
- [ ] Test persistence across page refreshes
- [ ] Test migration from old data

---

## ESTIMATED TIMELINE

| Task | Time | Priority |
|------|------|----------|
| Update Zustand store | 2 hrs | 🔥 Critical |
| Add Navbar deal selector | 1 hr | 🔥 Critical |
| Update DashboardHome | 1 hr | 🔥 Critical |
| Update DocumentGenerator | 2 hrs | 🟠 High |
| Update other components | 1 hr | 🟠 High |
| Testing | 1 hr | 🟢 Medium |
| **TOTAL** | **8 hrs** | |

---

## FUTURE ENHANCEMENTS (Post-Hackathon)

- [ ] Deal templates (LBO, Acquisition, Revolving Credit)
- [ ] Deal comparison view (side-by-side)
- [ ] Deal archiving (soft delete)
- [ ] Deal sharing (export/import)
- [ ] Deal search and filtering
- [ ] Deal analytics dashboard (across all deals)

---

**This gives you a scalable multi-deal system in one focused day of work!** 🚀
