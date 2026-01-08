// src/store/appStore.ts - UPDATED with loadDemoData implementation
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Deal, Document, Negotiation, Party, Activity, User, DashboardStats } from '../types';
import type { ToastType } from '../components/common/Toast';
import { DEMO_DEAL, DEMO_PARTIES, DEMO_NEGOTIATIONS, DEMO_ACTIVITIES, DEMO_STATS, DEMO_DOCUMENT } from '../data/demo-data';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  show: boolean;
}

interface AppState {
  // Core data
  currentDeal: Deal | null;
  deals: Deal[];
  documents: Document[];
  negotiations: Negotiation[];
  parties: Party[];
  activities: Activity[];
  stats: DashboardStats | null;
  currentUser: User;

  // UI state
  isGenerating: boolean;
  generationProgress: number;
  generationStep: string;
  selectedNegotiation: string | null;
  isMobileMenuOpen: boolean;
  toasts: ToastMessage[];

  // Demo mode
  isDemoMode: boolean;
  
  // Actions
  setCurrentDeal: (deal: Deal | null) => void;
  addDeal: (deal: Deal) => void;
  addDocument: (doc: Document) => void;
  addNegotiation: (negotiation: Negotiation) => void;
  updateNegotiation: (id: string, updates: Partial<Negotiation>) => void;
  setParties: (parties: Party[]) => void;
  addActivity: (activity: Activity) => void;
  setStats: (stats: DashboardStats) => void;
  
  // Generation
  startGeneration: () => void;
  updateGeneration: (progress: number, step: string) => void;
  completeGeneration: (doc: Document) => void;
  
  // Navigation
  setSelectedNegotiation: (id: string | null) => void;

  // Mobile menu
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Toast notifications
  showToast: (type: ToastType, title: string, message?: string) => void;
  hideToast: (id: string) => void;

  // Demo mode
  loadDemoData: () => void;
  resetStore: () => void;
}

// Default user (always logged in for demo)
const DEFAULT_USER: User = {
  id: 'user_001',
  name: 'John Morrison',
  email: 'john.morrison@globalbank.com',
  organization: 'Global Investment Bank',
  role: 'Managing Director',
  avatar: 'https://ui-avatars.com/api/?name=John+Morrison&background=2563eb&color=fff'
};

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentDeal: null,
      deals: [],
      documents: [],
      negotiations: [],
      parties: [],
      activities: [],
      stats: null,
      currentUser: DEFAULT_USER,
      
      isGenerating: false,
      generationProgress: 0,
      generationStep: '',
      selectedNegotiation: null,
      isMobileMenuOpen: false,
      toasts: [],

      isDemoMode: true, // Always true for hackathon
      
      // Actions
      setCurrentDeal: (deal) => set({ currentDeal: deal }),
      
      addDeal: (deal) => set((state) => ({
        deals: [...state.deals, deal],
        currentDeal: deal
      })),
      
      addDocument: (doc) => set((state) => ({
        documents: [...state.documents, doc]
      })),
      
      addNegotiation: (negotiation) => set((state) => ({
        negotiations: [...state.negotiations, negotiation]
      })),
      
      updateNegotiation: (id, updates) => set((state) => ({
        negotiations: state.negotiations.map(neg =>
          neg.negotiation_id === id ? { ...neg, ...updates } : neg
        )
      })),
      
      setParties: (parties) => set({ parties }),
      
      addActivity: (activity) => set((state) => ({
        activities: [activity, ...state.activities].slice(0, 50) // Keep last 50
      })),
      
      setStats: (stats) => set({ stats }),
      
      // Generation
      startGeneration: () => set({
        isGenerating: true,
        generationProgress: 0,
        generationStep: 'Initializing...'
      }),
      
      updateGeneration: (progress, step) => set({
        generationProgress: progress,
        generationStep: step
      }),
      
      completeGeneration: (doc) => set((state) => ({
        isGenerating: false,
        generationProgress: 100,
        generationStep: 'Complete!',
        documents: [...state.documents, doc]
      })),
      
      // Navigation
      setSelectedNegotiation: (id) => set({ selectedNegotiation: id }),

      // Mobile menu
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      // Toast notifications
      showToast: (type, title, message) => {
        const id = `toast_${Date.now()}`;
        const newToast: ToastMessage = { id, type, title, message, show: true };

        set((state) => ({
          toasts: [...state.toasts, newToast]
        }));

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          get().hideToast(id);
        }, 5000);
      },

      hideToast: (id) => set((state) => ({
        toasts: state.toasts.filter(toast => toast.id !== id)
      })),

      // Demo mode - NOW IMPLEMENTED
      loadDemoData: () => {
        const state = get();
        
        // Only load if not already loaded
        if (state.currentDeal === null) {
          set({
            currentDeal: DEMO_DEAL,
            deals: [DEMO_DEAL],
            documents: [DEMO_DOCUMENT],
            parties: DEMO_PARTIES,
            negotiations: DEMO_NEGOTIATIONS,
            activities: DEMO_ACTIVITIES,
            stats: DEMO_STATS
          });
        }
      },
      
      resetStore: () => set({
        currentDeal: null,
        deals: [],
        documents: [],
        negotiations: [],
        parties: [],
        activities: [],
        stats: null,
        isGenerating: false,
        generationProgress: 0,
        generationStep: '',
        selectedNegotiation: null,
        toasts: []
      })
    }),
    {
      name: 'syndisync-storage',
      version: 1, // Add version for migrations
      migrate: (persistedState: any, version: number) => {
        // Migration: Add deal_id to old negotiations
        if (version === 0 && persistedState?.negotiations) {
          const defaultDealId = 'deal_20250112_001';
          persistedState.negotiations = persistedState.negotiations.map((neg: any) => ({
            ...neg,
            deal_id: neg.deal_id || defaultDealId
          }));
        }
        return persistedState;
      },
      partialize: (state) => ({
        // Only persist these fields
        deals: state.deals,
        documents: state.documents,
        negotiations: state.negotiations,
        parties: state.parties,
        activities: state.activities,
        stats: state.stats,
        currentDeal: state.currentDeal,
        isDemoMode: state.isDemoMode
      })
    }
  )
);

export default useAppStore;
