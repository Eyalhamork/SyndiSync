// MOCK DATA FOR SYNDISYNC AI DEMO
// Use this to pre-populate the demo without building complex backend

export const DEMO_DEAL = {
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
  arranger_bank: "Global Investment Bank"
};

export const DEMO_PARTIES = [
  {
    organization_id: "org_gib_001",
    name: "Global Investment Bank",
    role: "Arranger & Administrative Agent",
    commitment: 150000000,
    logo_url: "/logos/global-bank.svg",
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
    logo_url: "/logos/jpmorgan.svg",
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
    logo_url: "/logos/bofa.svg",
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
    logo_url: "/logos/citibank.svg",
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
    logo_url: "/logos/wells-fargo.svg",
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

export const DEMO_TERM_SHEET = {
  filename: "TechCorp_LBO_Term_Sheet.pdf",
  uploaded_at: "2025-01-05T10:30:00Z",
  key_terms: {
    borrower: "TechCorp Industries Inc.",
    sponsors: "Aurora Capital Partners LP",
    facility_amount: "$450,000,000",
    facility_type: "Senior Secured Term Loan B",
    maturity: "5 years from closing",
    interest_rate: "SOFR + 450 bps",
    call_protection: "Non-call 2 years, 102/101/100",
    security: "First lien on all assets",
    guarantors: "All material subsidiaries",
    financial_covenants: [
      "Total Net Leverage Ratio: <5.5x (step down to 5.0x in Year 3)",
      "Interest Coverage Ratio: >3.0x",
      "Quarterly testing"
    ],
    use_of_proceeds: "Finance LBO, refinance existing debt, transaction costs",
    closing_date: "Expected March 15, 2025"
  }
};

// Pre-scripted negotiation scenarios for impressive demo
export const DEMO_NEGOTIATIONS = [
  {
    negotiation_id: "neg_001",
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
      median: "5.1x for manufacturing LBOs",
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
        resolution_text: "Total Net Leverage Ratio: Not to exceed 5.0x (tested quarterly), with step-down to 4.75x beginning in Year 3. Borrower retains two (2) equity cure rights per the calculation period, each permitting a 0.25x cushion upon cash equity contribution.",
        rationale: "This proposal balances credit protection with operational flexibility. The 5.0x starting point aligns with market median for similar LBOs (5.1x per Q4 2024 data). The Year 3 step-down accommodates near-term integration costs while ensuring deleveraging trajectory. Equity cure rights provide safety valve without materially weakening covenant. 78% of comparable deals included similar provisions.",
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
      },
      {
        resolution_text: "Total Net Leverage Ratio: Not to exceed 5.25x (tested quarterly) for Years 1-2, stepping down to 5.0x in Year 3, 4.75x in Year 4, and 4.5x in Year 5. No equity cure rights permitted.",
        rationale: "More aggressive initial leverage accommodates borrower's growth plans while implementing strict deleveraging schedule that satisfies conservative lenders. Removes equity cure complexity. Market data shows 23% of manufacturing LBOs use 'stairstep' covenant structures.",
        predicted_acceptance: 0.65,
        pros: [
          "Higher initial flexibility for borrower",
          "Clear deleveraging path satisfies credit committees",
          "Simpler structure (no equity cure mechanism)"
        ],
        cons: [
          "Year 1-2 leverage above median",
          "Aggressive step-downs may be difficult to achieve",
          "Less flexibility without cure rights"
        ]
      },
      {
        resolution_text: "Total Net Leverage Ratio: Not to exceed 4.75x (tested quarterly), flat throughout facility life. If ratio exceeds 4.5x for two consecutive quarters, mandatory prepayment of $25M or 50% of excess cash flow, whichever is greater.",
        rationale: "Most conservative option prioritizes lender protection. Below market median but includes flexibility via springing prepayment trigger rather than immediate covenant breach. Suitable if borrower has strong cash generation.",
        predicted_acceptance: 0.40,
        pros: [
          "Lowest credit risk",
          "Springing prepayment provides cushion",
          "Simple ongoing compliance"
        ],
        cons: [
          "Below market (p25: 4.6x)",
          "May restrict legitimate business investments",
          "Cash sweep mechanism adds complexity"
        ]
      }
    ],
    selected_resolution: null, // User will select during demo
    resolution_rationale: null,
    status: "pending",
    created_at: "2025-01-08T09:15:00Z",
    updated_at: "2025-01-12T14:22:00Z"
  },
  {
    negotiation_id: "neg_002",
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
    ai_proposed_resolutions: [
      {
        resolution_text: "Borrower may make Restricted Payments up to $12,500,000 in any fiscal year, provided that (a) Total Net Leverage Ratio <4.25x on pro forma basis, (b) no Default or Event of Default exists, and (c) minimum liquidity of $30,000,000 maintained.",
        rationale: "Compromise amount ($12.5M) between positions. Lower leverage threshold (4.25x vs 4.5x) addresses conservative lenders. Liquidity requirement adds safety layer. Market precedent: 65% of LBOs allow some dividend capacity with conditions.",
        predicted_acceptance: 0.80
      }
    ],
    status: "pending"
  },
  {
    negotiation_id: "neg_003",
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
    ai_proposed_resolutions: [
      {
        resolution_text: "Material Adverse Change means any event that has resulted in, or would reasonably be expected to result in, a material adverse effect on (a) the business, assets, liabilities, operations, or financial condition of the Borrower and Restricted Subsidiaries taken as a whole, or (b) the ability of the Borrower to perform its obligations under the Loan Documents. For avoidance of doubt, a decline of 15% or more in Consolidated EBITDA over any two consecutive fiscal quarters shall be deemed a Material Adverse Change unless caused solely by industry-wide factors affecting comparable companies.",
        rationale: "Hybrid approach combines qualitative definition with quantitative bright-line test. 15% EBITDA threshold (lower than Citi's 30%) provides clarity while industry-wide exception prevents unfair triggers. 82% of recent credit agreements include similar dual-test structure.",
        predicted_acceptance: 0.75
      }
    ],
    status: "discussing"
  }
];

export const COVENANT_BENCHMARKS = {
  'manufacturing_lbo': {
    leverage: {
      p10: 4.0,
      p25: 4.6,
      median: 5.1,
      p75: 5.6,
      p90: 6.2,
      sample_size: 147,
      last_updated: "2024-Q4"
    },
    interest_coverage: {
      p10: 2.5,
      p25: 2.9,
      median: 3.4,
      p75: 4.1,
      p90: 4.8,
      sample_size: 147
    },
    equity_cure_prevalence: 0.68, // 68% include cure rights
    typical_cure_limit: 2, // 2 cures per calculation period
    testing_frequency: "Quarterly"
  },
  'tech_growth': {
    leverage: {
      p25: 3.2,
      median: 4.0,
      p75: 4.8,
      sample_size: 203
    },
    interest_coverage: {
      p25: 3.5,
      median: 4.2,
      p75: 5.0,
      sample_size: 203
    }
  },
  'healthcare_services': {
    leverage: {
      p25: 4.8,
      median: 5.5,
      p75: 6.2,
      sample_size: 89
    },
    interest_coverage: {
      p25: 2.8,
      median: 3.3,
      p75: 4.0,
      sample_size: 89
    }
  },
  'industrial_distribution': {
    leverage: {
      p25: 4.3,
      median: 5.0,
      p75: 5.6,
      sample_size: 124
    }
  }
};

export const BORROWER_FINANCIALS = {
  company: "TechCorp Industries Inc.",
  fiscal_year_end: "December 31",
  historical_data: [
    {
      year: 2022,
      revenue: 720000000,
      ebitda: 108000000,
      total_debt: 280000000,
      interest_expense: 18200000,
      cash: 45000000,
      metrics: {
        leverage_ratio: 2.6,
        interest_coverage: 5.9,
        ebitda_margin: 0.15
      }
    },
    {
      year: 2023,
      revenue: 785000000,
      ebitda: 125000000,
      total_debt: 320000000,
      interest_expense: 22400000,
      cash: 38000000,
      metrics: {
        leverage_ratio: 2.6,
        interest_coverage: 5.6,
        ebitda_margin: 0.159
      }
    },
    {
      year: 2024,
      revenue: 850000000,
      ebitda: 140000000,
      total_debt: 350000000,
      interest_expense: 26250000,
      cash: 42000000,
      metrics: {
        leverage_ratio: 2.5,
        interest_coverage: 5.3,
        ebitda_margin: 0.165
      }
    }
  ],
  projections: [
    {
      year: 2025,
      revenue: 900000000,
      ebitda: 153000000,
      total_debt: 650000000, // Post-LBO
      interest_expense: 48750000,
      metrics: {
        leverage_ratio: 4.25,
        interest_coverage: 3.1
      }
    },
    {
      year: 2026,
      revenue: 945000000,
      ebitda: 165000000,
      total_debt: 620000000,
      interest_expense: 46500000,
      metrics: {
        leverage_ratio: 3.76,
        interest_coverage: 3.5
      }
    },
    {
      year: 2027,
      revenue: 992000000,
      ebitda: 178000000,
      total_debt: 590000000,
      interest_expense: 44250000,
      metrics: {
        leverage_ratio: 3.31,
        interest_coverage: 4.0
      }
    }
  ],
  covenant_compliance_forecast: {
    leverage_covenant: 5.0,
    interest_coverage_covenant: 3.0,
    compliance_probability: [
      { year: 2025, q1: 0.95, q2: 0.92, q3: 0.94, q4: 0.96 },
      { year: 2026, q1: 0.97, q2: 0.98, q3: 0.97, q4: 0.98 },
      { year: 2027, q1: 0.99, q2: 0.99, q3: 0.99, q4: 0.99 }
    ],
    risk_analysis: {
      breach_probability: 0.08,
      most_likely_breach_quarter: "2025-Q2",
      recommended_cushion: "0.5x on leverage, 0.5x on coverage",
      mitigation: "Consider equity cure rights or seasonal adjustments"
    }
  }
};

export const DEMO_DOCUMENT_METADATA = {
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
      section_name: "Article IV - Conditions Precedent",
      page_start: 106,
      page_end: 125,
      ai_confidence: 0.96,
      review_notes: []
    },
    {
      section_name: "Article V - Affirmative Covenants",
      page_start: 126,
      page_end: 148,
      ai_confidence: 0.94,
      review_notes: []
    },
    {
      section_name: "Article VI - Negative Covenants",
      page_start: 149,
      page_end: 182,
      ai_confidence: 0.93,
      review_notes: ["Verify basket calculations in 6.2"]
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
    },
    {
      section_name: "Article IX - The Administrative Agent",
      page_start: 219,
      page_end: 245,
      ai_confidence: 0.98,
      review_notes: []
    },
    {
      section_name: "Article X - Miscellaneous",
      page_start: 246,
      page_end: 275,
      ai_confidence: 0.97,
      review_notes: []
    },
    {
      section_name: "Schedules and Exhibits",
      page_start: 276,
      page_end: 287,
      ai_confidence: 0.95,
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

export const ACTIVITY_FEED = [
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
    description: "Proposed compromise: SOFR + 425 bps (was 400-450 bps)",
    icon: "ai-sparkle"
  },
  {
    id: "act_003",
    timestamp: "2025-01-12T11:30:00Z",
    user: "Michael Thompson (BofA)",
    action: "approved",
    target: "Article III - Representations",
    description: "Approved with no changes",
    icon: "check-circle"
  },
  {
    id: "act_004",
    timestamp: "2025-01-12T10:45:00Z",
    user: "System",
    action: "generated",
    target: "Facility Agreement v1",
    description: "Generated 287-page document in 43 seconds",
    icon: "document"
  },
  {
    id: "act_005",
    timestamp: "2025-01-12T09:15:00Z",
    user: "John Morrison (Global IB)",
    action: "uploaded",
    target: "Term Sheet",
    description: "Uploaded TechCorp LBO Term Sheet",
    icon: "upload"
  },
  {
    id: "act_006",
    timestamp: "2025-01-11T16:20:00Z",
    user: "David Park (Wells Fargo)",
    action: "joined",
    target: "Deal Syndicate",
    description: "Joined as syndicate member ($50M commitment)",
    icon: "user-plus"
  },
  {
    id: "act_007",
    timestamp: "2025-01-11T14:10:00Z",
    user: "Emily Rodriguez (Citibank)",
    action: "requested",
    target: "Financial Projections",
    description: "Requested additional covenant sensitivity analysis",
    icon: "chart-bar"
  },
  {
    id: "act_008",
    timestamp: "2025-01-10T11:00:00Z",
    user: "John Morrison (Global IB)",
    action: "created",
    target: "New Deal",
    description: "Created TechCorp LBO Financing deal",
    icon: "plus-circle"
  }
];

export const SAVINGS_CALCULATOR_DATA = {
  traditional_process: {
    timeline_weeks: 6,
    legal_fees: 850000,
    internal_costs: 325000,
    opportunity_cost: 1200000,
    total_cost: 2375000,
    breakdown: [
      { category: "External Legal Fees", amount: 850000, description: "Law firm fees at $500-1000/hour" },
      { category: "Internal Legal Team", amount: 325000, description: "Internal counsel time and resources" },
      { category: "Opportunity Cost", amount: 1200000, description: "Delayed funding and lost opportunities" }
    ]
  },
  syndisync_process: {
    timeline_days: 3,
    legal_fees: 150000, // Reduced review time
    internal_costs: 50000, // Minimal coordination
    opportunity_cost: 100000, // Fast turnaround
    total_cost: 300000,
    subscription_fee: 15000,
    total_with_fee: 315000,
    breakdown: [
      { category: "Legal Review", amount: 150000, description: "Focused on key provisions only" },
      { category: "Internal Coordination", amount: 50000, description: "Platform handles communication" },
      { category: "SyndiSync Subscription", amount: 15000, description: "Monthly platform fee" },
      { category: "Opportunity Cost", amount: 100000, description: "Rapid deployment" }
    ]
  },
  savings: {
    time_saved_weeks: 5.6,
    time_saved_percentage: 0.93,
    cost_saved: 2060000,
    cost_saved_percentage: 0.87,
    roi_percentage: 652
  }
};

export const DEAL_TIMELINE = [
  {
    milestone: "Term Sheet Uploaded",
    date: "2025-01-05",
    status: "completed",
    duration_days: 0
  },
  {
    milestone: "Document Generation",
    date: "2025-01-12",
    status: "completed",
    duration_days: 0.01 // 43 seconds
  },
  {
    milestone: "Syndicate Review",
    date: "2025-01-12 to 2025-01-14",
    status: "in_progress",
    duration_days: 2
  },
  {
    milestone: "Negotiation & Revisions",
    date: "2025-01-14 to 2025-01-16",
    status: "pending",
    duration_days: 2
  },
  {
    milestone: "Final Approvals",
    date: "2025-01-16",
    status: "pending",
    duration_days: 0.5
  },
  {
    milestone: "Execution",
    date: "2025-01-17",
    status: "pending",
    duration_days: 0.5
  }
];

// Statistics for impressive dashboard
export const DASHBOARD_STATS = {
  total_deals: 1,
  active_negotiations: 3,
  documents_generated: 1,
  time_saved_hours: 960, // 6 weeks - 3 days
  cost_saved_total: 2060000,
  avg_generation_time_seconds: 43,
  ai_confidence_avg: 0.96,
  user_satisfaction: 4.8
};

// For the AI to generate realistic document excerpts
export const SAMPLE_CLAUSES = {
  leverage_covenant: `Section 7.1 Total Net Leverage Ratio

The Borrower shall not permit the Total Net Leverage Ratio as of the last day of any fiscal quarter to exceed 5.0:1.0, provided that commencing with the fiscal quarter ending December 31, 2027, such ratio shall not exceed 4.75:1.0.

For purposes of this Section 7.1, "Total Net Leverage Ratio" means, as of any date of determination, the ratio of (a) Consolidated Total Debt as of such date minus Unrestricted Cash in excess of $30,000,000 to (b) Consolidated EBITDA for the most recently ended Test Period.`,

  interest_coverage: `Section 7.2 Interest Coverage Ratio

The Borrower shall maintain, as of the last day of each fiscal quarter, an Interest Coverage Ratio of not less than 3.0:1.0.

For purposes of this Section 7.2, "Interest Coverage Ratio" means, for any Test Period, the ratio of (a) Consolidated EBITDA for such Test Period to (b) Consolidated Interest Expense for such Test Period.`,

  equity_cure: `Section 7.3 Equity Cure Rights

Notwithstanding anything to the contrary contained in Section 7.1 or Section 7.2, in the event that the Borrower fails to comply with the requirements of such Section(s), until the expiration of the tenth (10th) day subsequent to the date the Compliance Certificate is required to be delivered, the Borrower shall have the right to issue Cure Amount Equity and apply the Net Cash Proceeds thereof to increase Consolidated EBITDA solely for the purposes of determining compliance with such Section(s) (any such equity issuance, an "Equity Cure").`
};

// Mock Claude API responses for demo
export const MOCK_AI_RESPONSES = {
  document_generation_status: [
    { step: "Analyzing term sheet", progress: 15, time: 1 },
    { step: "Retrieving relevant precedents", progress: 30, time: 3 },
    { step: "Generating Article I - Definitions", progress: 45, time: 8 },
    { step: "Generating Articles II-IV", progress: 60, time: 18 },
    { step: "Generating Covenants", progress: 75, time: 28 },
    { step: "Cross-referencing provisions", progress: 85, time: 35 },
    { step: "Formatting document", progress: 95, time: 40 },
    { step: "Complete", progress: 100, time: 43 }
  ],
  
  conflict_analysis: {
    detected_conflicts: 3,
    high_priority: 1,
    medium_priority: 2,
    estimated_resolution_time: "24-48 hours with AI assistance",
    without_ai: "5-7 days via email negotiation"
  }
};

// Export all for easy import
export default {
  DEMO_DEAL,
  DEMO_PARTIES,
  DEMO_TERM_SHEET,
  DEMO_NEGOTIATIONS,
  COVENANT_BENCHMARKS,
  BORROWER_FINANCIALS,
  DEMO_DOCUMENT_METADATA,
  ACTIVITY_FEED,
  SAVINGS_CALCULATOR_DATA,
  DEAL_TIMELINE,
  DASHBOARD_STATS,
  SAMPLE_CLAUSES,
  MOCK_AI_RESPONSES
};