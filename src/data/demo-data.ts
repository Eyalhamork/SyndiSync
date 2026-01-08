// src/data/demo-data.ts
import type { Deal, Party, Negotiation, Activity, DashboardStats, Document } from '../types';

export const DEMO_DEAL: Deal = {
  deal_id: "deal_20250112_001",
  deal_name: "TechCorp LBO Financing",
  borrower: {
    name: "TechCorp Industries Inc.",
    industry: "Manufacturing - Industrial Technology",
    credit_rating: "BB+",
    annual_revenue: 850000000,
    headquarters: "Chicago, Illinois",
    founded: 2010,
    employees: 3200
  },
  deal_type: "LBO",
  jurisdiction: "new_york_law",
  facility_amount: 450000000,
  currency: "USD",
  tenor_months: 60,
  purpose: "Leveraged buyout financing for acquisition by Aurora Capital Partners",
  status: "under_negotiation",
  created_at: "2025-01-05T10:30:00Z",
  updated_at: "2025-01-12T14:22:00Z",
  created_by: "john.morrison@globalbank.com",
  arranger_bank: "Global Investment Bank",
  // ESG Fields
  esg_score: 85,
  carbon_offset_tons: 1250,
  sustainability_linked: true
};

export const DEMO_PARTIES: Party[] = [
  {
    organization_id: "org_gib_001",
    name: "Global Investment Bank",
    role: "Arranger & Administrative Agent",
    commitment: 150000000,
    logo_url: "https://ui-avatars.com/api/?name=GIB&background=2563eb&color=fff&bold=true",
    contact: {
      name: "John Morrison",
      title: "Managing Director, Leveraged Finance",
      email: "john.morrison@globalbank.com"
    },
    preferences: {
      leverage_max: 5.0,
      interest_coverage_min: 3.5,
      esg_requirements: true
    }
  },
  {
    organization_id: "org_jpmc_002",
    name: "JP Morgan Chase",
    role: "Co-Lead Arranger",
    commitment: 100000000,
    logo_url: "https://ui-avatars.com/api/?name=JPM&background=117ACA&color=fff&bold=true",
    contact: {
      name: "Sarah Chen",
      title: "Vice President, Syndicated Loans",
      email: "sarah.chen@jpmorgan.com"
    },
    preferences: {
      leverage_max: 5.5,
      interest_coverage_min: 3.0,
      esg_requirements: false
    }
  },
  {
    organization_id: "org_bofa_003",
    name: "Bank of America",
    role: "Syndicate Member",
    commitment: 75000000,
    logo_url: "https://ui-avatars.com/api/?name=BofA&background=E31837&color=fff&bold=true",
    contact: {
      name: "Michael Thompson",
      title: "Director, Corporate Banking",
      email: "michael.thompson@bofa.com"
    },
    preferences: {
      leverage_max: 4.5,
      interest_coverage_min: 4.0,
      esg_requirements: true
    }
  },
  {
    organization_id: "org_citi_004",
    name: "Citibank",
    role: "Syndicate Member",
    commitment: 75000000,
    logo_url: "https://ui-avatars.com/api/?name=Citi&background=003F6C&color=fff&bold=true",
    contact: {
      name: "Emily Rodriguez",
      title: "Senior Credit Officer",
      email: "emily.rodriguez@citi.com"
    },
    preferences: {
      leverage_max: 5.0,
      interest_coverage_min: 3.5,
      esg_requirements: false
    }
  },
  {
    organization_id: "org_wells_005",
    name: "Wells Fargo",
    role: "Syndicate Member",
    commitment: 50000000,
    logo_url: "https://ui-avatars.com/api/?name=WF&background=D71E28&color=fff&bold=true",
    contact: {
      name: "David Park",
      title: "Credit Analyst",
      email: "david.park@wellsfargo.com"
    },
    preferences: {
      leverage_max: 4.8,
      interest_coverage_min: 3.2,
      esg_requirements: true
    }
  }
];

export const DEMO_NEGOTIATIONS: Negotiation[] = [
  {
    negotiation_id: "neg_001",
    deal_id: "deal_20250112_001",
    clause_reference: "Section 7.1 - Financial Covenants - Total Net Leverage Ratio",
    conflict_description: "Disagreement on acceptable leverage ratio and step-down schedule",
    parties_involved: ["org_gib_001", "org_jpmc_002", "org_bofa_003", "org_citi_004", "org_wells_005"],
    positions: [
      {
        party: "Bank of America",
        position: "4.5x leverage ratio, no step-downs",
        rationale: "Conservative position given market volatility and sector headwinds"
      },
      {
        party: "JP Morgan Chase",
        position: "5.5x leverage ratio, step down to 5.0x in Year 4",
        rationale: "Borrower needs flexibility for growth investments"
      },
      {
        party: "Global Investment Bank",
        position: "5.0x leverage ratio, step down to 4.5x in Year 3",
        rationale: "Balanced approach aligned with sponsor track record"
      },
      {
        party: "Citibank",
        position: "5.0x leverage ratio with equity cure rights (2x)",
        rationale: "Accepts higher leverage with proper cushion mechanism"
      },
      {
        party: "Wells Fargo",
        position: "4.8x leverage ratio, annual step-downs",
        rationale: "Credit committee requires gradual deleveraging path"
      }
    ],
    market_context: {
      median: "5.1x",
      p25: "4.6x",
      p75: "5.6x",
      sample_size: 147,
      recent_trend: "Tightening due to rate environment",
      comparable_deals: [
        "IndustrialTech Corp (Q3 2024): 5.2x",
        "ManuCo Holdings (Q4 2024): 4.8x",
        "Precision Industries (Q1 2025): 5.0x with equity cure"
      ]
    },
    ai_proposed_resolutions: [
      {
        resolution_text: "Total Net Leverage Ratio: Not to exceed 5.0x (tested quarterly), with step-down to 4.75x beginning in Year 3. Borrower retains two (2) equity cure rights per calculation period, each permitting a 0.25x cushion upon cash equity contribution.",
        rationale: "This proposal balances credit protection with operational flexibility. The 5.0x starting point aligns with market median for similar LBOs (5.1x per Q4 2024 data). The Year 3 step-down accommodates near-term integration costs while ensuring deleveraging trajectory. Equity cure rights provide safety valve without materially weakening covenant.",
        predicted_acceptance: 0.85,
        pros: [
          "Within market range (p25: 4.6x, p75: 5.6x)",
          "Addresses conservative lenders' concerns with step-down",
          "Gives flexibility to growth-oriented lenders via cure rights",
          "Precedent: 3 recent deals used identical structure"
        ],
        cons: [
          "More restrictive than JP Morgan's 5.5x position",
          "Less conservative than BofA's 4.5x preference"
        ],
        affected_clauses: [
          "Section 7.1(a) - Financial Covenants",
          "Section 7.1(c) - Equity Cure Rights",
          "Schedule 1.1 - Definitions: 'Total Net Leverage Ratio'"
        ]
      }
    ],
    selected_resolution: null,
    resolution_rationale: null,
    status: "pending",
    created_at: "2025-01-08T09:15:00Z",
    updated_at: "2025-01-12T14:22:00Z"
  },
  {
    negotiation_id: "neg_002",
    deal_id: "deal_20250112_001",
    clause_reference: "Section 8.3 - Restricted Payments (Dividend Policy)",
    conflict_description: "Dispute over borrower's ability to make distributions to sponsor",
    parties_involved: ["org_gib_001", "org_bofa_003", "org_wells_005"],
    positions: [
      {
        party: "Global Investment Bank",
        position: "Permit dividends up to $15M annually if leverage <4.5x",
        rationale: "Standard sponsor-friendly provision"
      },
      {
        party: "Bank of America",
        position: "No dividends permitted while facility outstanding",
        rationale: "Cash should be used for debt repayment only"
      },
      {
        party: "Wells Fargo",
        position: "Permit dividends up to $10M annually if leverage <4.0x and no default",
        rationale: "Limited flexibility with strict conditions"
      }
    ],
    market_context: {
      median: "Limited dividends permitted",
      p25: "No dividends",
      p75: "$12M annual cap",
      sample_size: 98,
      recent_trend: "More restrictive in current market",
      comparable_deals: [
        "ManufacturingCo (2024): $10M cap with 4.0x leverage test",
        "TechHoldings (2024): No dividends permitted"
      ]
    },
    ai_proposed_resolutions: [
      {
        resolution_text: "Borrower may make Restricted Payments up to $12,500,000 in any fiscal year, provided that (a) Total Net Leverage Ratio <4.25x on pro forma basis, (b) no Default or Event of Default exists, and (c) minimum liquidity of $30,000,000 maintained.",
        rationale: "Compromise amount ($12.5M) between positions. Lower leverage threshold (4.25x vs 4.5x) addresses conservative lenders. Liquidity requirement adds safety layer. Market precedent: 65% of LBOs allow some dividend capacity with conditions.",
        predicted_acceptance: 0.80,
        pros: [
          "Compromise between $10M and $15M positions",
          "Multiple safeguards (leverage, liquidity, no default)",
          "Aligns with market median"
        ],
        cons: [
          "More restrictive than GIB preference",
          "Still permits dividends (BofA concern)"
        ],
        affected_clauses: [
          "Section 8.3 - Restricted Payments",
          "Schedule 1.1 - Definitions: 'Restricted Payments'"
        ]
      }
    ],
    selected_resolution: null,
    resolution_rationale: null,
    status: "pending",
    created_at: "2025-01-09T10:20:00Z",
    updated_at: "2025-01-12T14:22:00Z"
  },
  {
    negotiation_id: "neg_003",
    deal_id: "deal_20250112_001",
    clause_reference: "Section 9.1(f) - Events of Default - MAC Clause",
    conflict_description: "Definition of Material Adverse Change triggering default",
    parties_involved: ["org_jpmc_002", "org_citi_004"],
    positions: [
      {
        party: "JP Morgan Chase",
        position: "MAC defined as 'material adverse effect on business, assets, or financial condition'",
        rationale: "Standard broad definition provides lender protection"
      },
      {
        party: "Citibank",
        position: "MAC requires specific thresholds: >20% revenue decline or >30% EBITDA decline over 2 consecutive quarters",
        rationale: "Objective criteria prevents disputes over 'material'"
      }
    ],
    market_context: {
      median: "Qualitative with examples",
      p25: "Broad qualitative",
      p75: "Hybrid with quantitative threshold",
      sample_size: 156,
      recent_trend: "More borrowers demanding quantitative thresholds",
      comparable_deals: [
        "IndustrialTech (2024): 15% EBITDA decline threshold",
        "Distribution Co (2024): Purely qualitative definition"
      ]
    },
    ai_proposed_resolutions: [
      {
        resolution_text: "Material Adverse Change means any event that has resulted in, or would reasonably be expected to result in, a material adverse effect on (a) the business, assets, liabilities, operations, or financial condition of the Borrower and Restricted Subsidiaries taken as a whole, or (b) the ability of the Borrower to perform its obligations under the Loan Documents. For avoidance of doubt, a decline of 15% or more in Consolidated EBITDA over any two consecutive fiscal quarters shall be deemed a Material Adverse Change unless caused solely by industry-wide factors affecting comparable companies.",
        rationale: "Hybrid approach combines qualitative definition with quantitative bright-line test. 15% EBITDA threshold (lower than Citi's 30%) provides clarity while industry-wide exception prevents unfair triggers. 82% of recent credit agreements include similar dual-test structure.",
        predicted_acceptance: 0.75,
        pros: [
          "Combines certainty with flexibility",
          "15% threshold balances both positions",
          "Industry exception is market standard",
          "Reduces potential for disputes"
        ],
        cons: [
          "More restrictive than Citi's 30% threshold",
          "Qualitative component remains (JPM preference)"
        ],
        affected_clauses: [
          "Section 9.1(f) - Events of Default",
          "Schedule 1.1 - Definitions: 'Material Adverse Change'"
        ]
      }
    ],
    selected_resolution: null,
    resolution_rationale: null,
    status: "pending",
    created_at: "2025-01-10T14:35:00Z",
    updated_at: "2025-01-12T14:22:00Z"
  }
];

export const DEMO_ACTIVITIES: Activity[] = [
  {
    id: "act_001",
    timestamp: "2025-01-12T14:22:00Z",
    user: "Sarah Chen (JP Morgan)",
    action: "commented",
    target: "Section 7.1 - Financial Covenants",
    description: "Proposed alternative leverage ratio structure",
    icon: "comment"
  },
  {
    id: "act_002",
    timestamp: "2025-01-12T13:45:00Z",
    user: "AI Assistant",
    action: "resolved",
    target: "Conflict: Interest Rate Margin",
    description: "Proposed compromise: SOFR + 425 bps",
    icon: "ai-sparkle"
  }
];

export const DEMO_STATS: DashboardStats = {
  total_deals: 1,
  active_negotiations: 3,
  documents_generated: 1,
  time_saved_hours: 960,
  cost_saved_total: 2060000,
  avg_generation_time_seconds: 43,
  ai_confidence_avg: 0.96,
  user_satisfaction: 4.8
};

export const DEMO_DOCUMENT: Document = {
  document_id: "doc_20250112_001",
  deal_id: "deal_20250112_001",
  document_type: "facility_agreement",
  document_name: "TechCorp_Facility_Agreement_v1.docx",
  version_number: 1,
  page_count: 287,
  word_count: 78456,
  generated_by: "ai",
  ai_model: "claude-sonnet-4-20250514",
  generation_time_seconds: 43,
  ai_confidence_score: 0.96,
  status: "under_review",
  created_at: "2025-01-12T10:45:00Z",
  sections: [
    {
      section_name: "Article I - Definitions and Accounting Terms",
      page_start: 1,
      page_end: 42,
      ai_confidence: 0.98,
      review_notes: []
    },
    {
      section_name: "Article II - The Credits",
      page_start: 43,
      page_end: 68,
      ai_confidence: 0.97,
      review_notes: []
    },
    {
      section_name: "Article III - Representations and Warranties",
      page_start: 69,
      page_end: 105,
      ai_confidence: 0.95,
      review_notes: ["Review environmental rep in 3.14"]
    },
    {
      section_name: "Article VII - Financial Covenants",
      page_start: 183,
      page_end: 195,
      ai_confidence: 0.97,
      review_notes: []
    },
    {
      section_name: "Article VIII - Events of Default",
      page_start: 196,
      page_end: 218,
      ai_confidence: 0.96,
      review_notes: []
    }
  ],
  lma_compliance: {
    template_version: "LMA Investment Grade 2024",
    jurisdiction: "New York Law",
    mandatory_provisions_included: 47,
    optional_provisions_included: 23,
    compliance_score: 0.98
  }
};
