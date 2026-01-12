// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  avatar?: string;
}

export interface Deal {
  deal_id: string;
  deal_name: string;
  borrower: {
    name: string;
    industry: string;
    credit_rating: string;
    annual_revenue: number;
    headquarters: string;
    founded: number;
    employees: number;
  };
  deal_type: 'LBO' | 'Acquisition' | 'Refinancing' | 'Growth Capital';
  jurisdiction: string;
  facility_amount: number;
  currency: string;
  tenor_months: number;
  purpose: string;
  status: 'draft' | 'under_negotiation' | 'approved' | 'executed';
  created_at: string;
  updated_at: string;
  created_by: string;
  arranger_bank: string;
  // ESG Fields
  esg_score?: number; // 0-100
  carbon_offset_tons?: number;
  sustainability_linked?: boolean;
}

export interface Party {
  organization_id: string;
  name: string;
  role: string;
  commitment: number;
  logo_url?: string;
  contact: {
    name: string;
    title: string;
    email: string;
  };
  preferences: {
    leverage_max: number;
    interest_coverage_min: number;
    esg_requirements: boolean;
  };
}

export interface Position {
  party: string;
  position: string;
  rationale: string;
}

export interface Negotiation {
  negotiation_id: string;
  deal_id: string;
  clause_reference: string;
  conflict_description: string;
  parties_involved: string[];
  positions: Position[];
  market_context?: {
    median: string;
    p25: string;
    p75: string;
    sample_size: number;
    recent_trend: string;
    comparable_deals: string[];
  };
  ai_proposed_resolutions?: AIResolution[];
  selected_resolution: string | null;
  resolution_rationale: string | null;
  status: 'pending' | 'discussing' | 'resolved' | 'approved';
  created_at: string;
  updated_at: string;
}

export interface AIResolution {
  resolution_text: string;
  rationale: string;
  predicted_acceptance: number;
  pros: string[];
  cons: string[];
  affected_clauses?: string[];
}

export interface Document {
  document_id: string;
  deal_id: string;
  document_type: string;
  document_name: string;
  version_number: number;
  page_count: number;
  word_count: number;
  generated_by: 'ai' | 'manual';
  ai_model?: string;
  generation_time_seconds?: number;
  ai_confidence_score?: number;
  status: 'draft' | 'under_review' | 'approved' | 'executed';
  created_at: string;
  sections?: DocumentSection[];
  lma_compliance?: {
    template_version: string;
    jurisdiction: string;
    mandatory_provisions_included: number;
    optional_provisions_included: number;
    compliance_score: number;
  };
  // AI-extracted deal data for PDF generation
  extracted_data?: {
    borrower: {
      name: string;
      industry: string;
      headquarters: string;
      credit_rating: string;
      annual_revenue: number;
      employees: number;
    };
    facility: {
      amount: number;
      currency: string;
      type: string;
      tenor_months: number;
      purpose: string;
    };
    covenants: {
      leverage_ratio: number;
      interest_coverage: number;
      capex_limit: number;
      debt_incurrence_test: string;
    };
    parties: Array<{
      name: string;
      role: string;
      commitment: number;
    }>;
    pricing: {
      base_rate: string;
      margin_bps: number;
      commitment_fee_bps: number;
      upfront_fee_bps: number;
    };
    esg: {
      sustainability_linked: boolean;
      green_use_of_proceeds: boolean;
      esg_kpis: string[];
      margin_adjustment_bps: number;
    };
    jurisdiction: string;
  };
}

export interface DocumentSection {
  section_name: string;
  page_start: number;
  page_end: number;
  ai_confidence: number;
  review_notes: string[];
}

export interface Activity {
  id: string;
  timestamp: string;
  user: string;
  action: 'commented' | 'approved' | 'rejected' | 'uploaded' | 'generated' | 'resolved' | 'created' | 'joined' | 'requested';
  target: string;
  description: string;
  icon: string;
}

export interface CovenantBenchmark {
  leverage: {
    p10?: number;
    p25: number;
    median: number;
    p75: number;
    p90?: number;
    sample_size: number;
    last_updated?: string;
  };
  interest_coverage: {
    p10?: number;
    p25: number;
    median: number;
    p75: number;
    p90?: number;
    sample_size: number;
  };
  equity_cure_prevalence?: number;
  typical_cure_limit?: number;
  testing_frequency?: string;
}

export interface DashboardStats {
  total_deals: number;
  active_negotiations: number;
  documents_generated: number;
  time_saved_hours: number;
  cost_saved_total: number;
  avg_generation_time_seconds: number;
  ai_confidence_avg: number;
  user_satisfaction: number;
}

export interface GenerationProgress {
  step: string;
  progress: number;
  time: number;
}
