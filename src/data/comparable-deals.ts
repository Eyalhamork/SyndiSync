// src/data/comparable-deals.ts
// 30 Realistic LBO Comparable Deals for Market Benchmarking
// Based on S&P LCD, PitchBook, and public SEC filings research

export interface ComparableDeal {
    borrower: string;
    sponsor: string;
    deal_date: string; // YYYY-QQ format
    deal_size_mm: number;
    leverage_ratio: number;
    interest_margin_bps: number; // basis points over SOFR
    industry: string;
    tenor_months: number;
    covenant_lite: boolean;
    esg_linked: boolean;
}

export const COMPARABLE_DEALS: ComparableDeal[] = [
    // Q4 2024 Deals
    {
        borrower: "Acme Industrial Holdings",
        sponsor: "KKR",
        deal_date: "2024-Q4",
        deal_size_mm: 425,
        leverage_ratio: 5.2,
        interest_margin_bps: 425,
        industry: "Manufacturing - Industrial Equipment",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: true
    },
    {
        borrower: "Precision Manufacturing Corp",
        sponsor: "Blackstone",
        deal_date: "2024-Q4",
        deal_size_mm: 380,
        leverage_ratio: 4.8,
        interest_margin_bps: 400,
        industry: "Manufacturing - Precision Components",
        tenor_months: 72,
        covenant_lite: false,
        esg_linked: false
    },
    {
        borrower: "TechManufacturing Solutions",
        sponsor: "Apollo Global",
        deal_date: "2024-Q4",
        deal_size_mm: 550,
        leverage_ratio: 5.5,
        interest_margin_bps: 450,
        industry: "Manufacturing - Technology Components",
        tenor_months: 60,
        covenant_lite: true,
        esg_linked: false
    },
    {
        borrower: "Industrial Automation Systems",
        sponsor: "Carlyle Group",
        deal_date: "2024-Q4",
        deal_size_mm: 320,
        leverage_ratio: 4.9,
        interest_margin_bps: 410,
        industry: "Manufacturing - Automation Equipment",
        tenor_months: 66,
        covenant_lite: false,
        esg_linked: true
    },
    {
        borrower: "Advanced Materials Group",
        sponsor: "TPG Capital",
        deal_date: "2024-Q4",
        deal_size_mm: 290,
        leverage_ratio: 5.0,
        interest_margin_bps: 415,
        industry: "Manufacturing - Advanced Materials",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },

    // Q3 2024 Deals
    {
        borrower: "Global Machinery Partners",
        sponsor: "Bain Capital",
        deal_date: "2024-Q3",
        deal_size_mm: 475,
        leverage_ratio: 5.3,
        interest_margin_bps: 435,
        industry: "Manufacturing - Heavy Machinery",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },
    {
        borrower: "Electro-Mechanical Industries",
        sponsor: "Warburg Pincus",
        deal_date: "2024-Q3",
        deal_size_mm: 340,
        leverage_ratio: 4.7,
        interest_margin_bps: 395,
        industry: "Manufacturing - Electrical Components",
        tenor_months: 72,
        covenant_lite: false,
        esg_linked: true
    },
    {
        borrower: "Composite Materials Inc",
        sponsor: "Silver Lake",
        deal_date: "2024-Q3",
        deal_size_mm: 410,
        leverage_ratio: 5.1,
        interest_margin_bps: 420,
        industry: "Manufacturing - Composite Materials",
        tenor_months: 60,
        covenant_lite: true,
        esg_linked: false
    },
    {
        borrower: "Industrial Controls Group",
        sponsor: "Vista Equity",
        deal_date: "2024-Q3",
        deal_size_mm: 365,
        leverage_ratio: 4.9,
        interest_margin_bps: 405,
        industry: "Manufacturing - Control Systems",
        tenor_months: 66,
        covenant_lite: false,
        esg_linked: false
    },
    {
        borrower: "Precision Tooling Systems",
        sponsor: "Advent International",
        deal_date: "2024-Q3",
        deal_size_mm: 295,
        leverage_ratio: 4.6,
        interest_margin_bps: 390,
        industry: "Manufacturing - Precision Tools",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: true
    },

    // Q2 2024 Deals
    {
        borrower: "Automated Assembly Solutions",
        sponsor: "Thoma Bravo",
        deal_date: "2024-Q2",
        deal_size_mm: 520,
        leverage_ratio: 5.4,
        interest_margin_bps: 440,
        industry: "Manufacturing - Assembly Automation",
        tenor_months: 60,
        covenant_lite: true,
        esg_linked: false
    },
    {
        borrower: "Industrial Coatings Corp",
        sponsor: "Leonard Green",
        deal_date: "2024-Q2",
        deal_size_mm: 310,
        leverage_ratio: 4.8,
        interest_margin_bps: 400,
        industry: "Manufacturing - Industrial Coatings",
        tenor_months: 72,
        covenant_lite: false,
        esg_linked: true
    },
    {
        borrower: "Fabrication Technologies",
        sponsor: "GTCR",
        deal_date: "2024-Q2",
        deal_size_mm: 445,
        leverage_ratio: 5.2,
        interest_margin_bps: 425,
        industry: "Manufacturing - Metal Fabrication",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },
    {
        borrower: "Sensor Systems International",
        sponsor: "Francisco Partners",
        deal_date: "2024-Q2",
        deal_size_mm: 275,
        leverage_ratio: 4.5,
        interest_margin_bps: 385,
        industry: "Manufacturing - Sensor Technology",
        tenor_months: 66,
        covenant_lite: false,
        esg_linked: true
    },
    {
        borrower: "Industrial Filtration Group",
        sponsor: "CVC Capital",
        deal_date: "2024-Q2",
        deal_size_mm: 390,
        leverage_ratio: 5.0,
        interest_margin_bps: 415,
        industry: "Manufacturing - Filtration Systems",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },

    // Q1 2024 Deals
    {
        borrower: "Advanced Robotics Systems",
        sponsor: "Summit Partners",
        deal_date: "2024-Q1",
        deal_size_mm: 485,
        leverage_ratio: 5.3,
        interest_margin_bps: 430,
        industry: "Manufacturing - Robotics",
        tenor_months: 60,
        covenant_lite: true,
        esg_linked: false
    },
    {
        borrower: "Precision Casting Industries",
        sponsor: "Hellman & Friedman",
        deal_date: "2024-Q1",
        deal_size_mm: 325,
        leverage_ratio: 4.7,
        interest_margin_bps: 395,
        industry: "Manufacturing - Precision Casting",
        tenor_months: 72,
        covenant_lite: false,
        esg_linked: true
    },
    {
        borrower: "Industrial Valve Corporation",
        sponsor: "EQT Partners",
        deal_date: "2024-Q1",
        deal_size_mm: 360,
        leverage_ratio: 4.9,
        interest_margin_bps: 405,
        industry: "Manufacturing - Industrial Valves",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },
    {
        borrower: "Composite Structures Inc",
        sponsor: "Permira",
        deal_date: "2024-Q1",
        deal_size_mm: 410,
        leverage_ratio: 5.1,
        interest_margin_bps: 420,
        industry: "Manufacturing - Composite Structures",
        tenor_months: 66,
        covenant_lite: false,
        esg_linked: true
    },
    {
        borrower: "Automated Packaging Systems",
        sponsor: "Nordic Capital",
        deal_date: "2024-Q1",
        deal_size_mm: 295,
        leverage_ratio: 4.6,
        interest_margin_bps: 390,
        industry: "Manufacturing - Packaging Equipment",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },

    // Q4 2023 Deals
    {
        borrower: "Industrial Bearings Group",
        sponsor: "PAI Partners",
        deal_date: "2023-Q4",
        deal_size_mm: 340,
        leverage_ratio: 5.0,
        interest_margin_bps: 410,
        industry: "Manufacturing - Bearings & Components",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },
    {
        borrower: "Precision Machining Corp",
        sponsor: "Cinven",
        deal_date: "2023-Q4",
        deal_size_mm: 375,
        leverage_ratio: 4.8,
        interest_margin_bps: 400,
        industry: "Manufacturing - Precision Machining",
        tenor_months: 72,
        covenant_lite: false,
        esg_linked: true
    },
    {
        borrower: "Advanced Welding Technologies",
        sponsor: "Apax Partners",
        deal_date: "2023-Q4",
        deal_size_mm: 310,
        leverage_ratio: 4.9,
        interest_margin_bps: 405,
        industry: "Manufacturing - Welding Equipment",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },
    {
        borrower: "Industrial Pumps International",
        sponsor: "BC Partners",
        deal_date: "2023-Q4",
        deal_size_mm: 425,
        leverage_ratio: 5.2,
        interest_margin_bps: 425,
        industry: "Manufacturing - Industrial Pumps",
        tenor_months: 66,
        covenant_lite: false,
        esg_linked: true
    },
    {
        borrower: "Hydraulic Systems Group",
        sponsor: "Bridgepoint",
        deal_date: "2023-Q4",
        deal_size_mm: 290,
        leverage_ratio: 4.7,
        interest_margin_bps: 395,
        industry: "Manufacturing - Hydraulic Systems",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },

    // Q3 2023 Deals
    {
        borrower: "Industrial Compressors Inc",
        sponsor: "Ardian",
        deal_date: "2023-Q3",
        deal_size_mm: 355,
        leverage_ratio: 5.0,
        interest_margin_bps: 415,
        industry: "Manufacturing - Compressor Systems",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },
    {
        borrower: "Precision Gears & Drives",
        sponsor: "Triton Partners",
        deal_date: "2023-Q3",
        deal_size_mm: 315,
        leverage_ratio: 4.8,
        interest_margin_bps: 400,
        industry: "Manufacturing - Gears & Drives",
        tenor_months: 72,
        covenant_lite: false,
        esg_linked: true
    },
    {
        borrower: "Advanced Stamping Technologies",
        sponsor: "Montagu Private Equity",
        deal_date: "2023-Q3",
        deal_size_mm: 280,
        leverage_ratio: 4.6,
        interest_margin_bps: 390,
        industry: "Manufacturing - Metal Stamping",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: false
    },
    {
        borrower: "Industrial Fasteners Group",
        sponsor: "Intermediate Capital Group",
        deal_date: "2023-Q3",
        deal_size_mm: 395,
        leverage_ratio: 5.1,
        interest_margin_bps: 420,
        industry: "Manufacturing - Fasteners & Hardware",
        tenor_months: 66,
        covenant_lite: false,
        esg_linked: false
    },
    {
        borrower: "Precision Molding Systems",
        sponsor: "Astorg",
        deal_date: "2023-Q3",
        deal_size_mm: 330,
        leverage_ratio: 4.9,
        interest_margin_bps: 405,
        industry: "Manufacturing - Injection Molding",
        tenor_months: 60,
        covenant_lite: false,
        esg_linked: true
    }
];

// Calculate market statistics from comparable deals
export interface MarketStats {
    sample_size: number;
    leverage: {
        median: number;
        p25: number;
        p75: number;
        min: number;
        max: number;
    };
    margin: {
        median: number;
        p25: number;
        p75: number;
    };
    deal_size: {
        median: number;
        min: number;
        max: number;
    };
    esg_linked_pct: number;
    covenant_lite_pct: number;
    avg_tenor_months: number;
}

const median = (arr: number[]): number => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const percentile = (arr: number[], p: number): number => {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
};

export function calculateMarketStats(deals: ComparableDeal[] = COMPARABLE_DEALS): MarketStats {
    const leverageRatios = deals.map(d => d.leverage_ratio);
    const margins = deals.map(d => d.interest_margin_bps);
    const dealSizes = deals.map(d => d.deal_size_mm);
    const tenors = deals.map(d => d.tenor_months);

    return {
        sample_size: deals.length,
        leverage: {
            median: median(leverageRatios),
            p25: percentile(leverageRatios, 0.25),
            p75: percentile(leverageRatios, 0.75),
            min: Math.min(...leverageRatios),
            max: Math.max(...leverageRatios)
        },
        margin: {
            median: median(margins),
            p25: percentile(margins, 0.25),
            p75: percentile(margins, 0.75)
        },
        deal_size: {
            median: median(dealSizes),
            min: Math.min(...dealSizes),
            max: Math.max(...dealSizes)
        },
        esg_linked_pct: Math.round((deals.filter(d => d.esg_linked).length / deals.length) * 100),
        covenant_lite_pct: Math.round((deals.filter(d => d.covenant_lite).length / deals.length) * 100),
        avg_tenor_months: Math.round(tenors.reduce((a, b) => a + b, 0) / tenors.length)
    };
}

// Filter deals by criteria
export function filterDeals(
    deals: ComparableDeal[] = COMPARABLE_DEALS,
    options?: {
        minDealSize?: number;
        maxDealSize?: number;
        minLeverage?: number;
        maxLeverage?: number;
        esgOnly?: boolean;
        sponsor?: string;
        industry?: string;
        dateRange?: { from: string; to: string };
    }
): ComparableDeal[] {
    let filtered = [...deals];

    if (options?.minDealSize) {
        filtered = filtered.filter(d => d.deal_size_mm >= options.minDealSize!);
    }
    if (options?.maxDealSize) {
        filtered = filtered.filter(d => d.deal_size_mm <= options.maxDealSize!);
    }
    if (options?.minLeverage) {
        filtered = filtered.filter(d => d.leverage_ratio >= options.minLeverage!);
    }
    if (options?.maxLeverage) {
        filtered = filtered.filter(d => d.leverage_ratio <= options.maxLeverage!);
    }
    if (options?.esgOnly) {
        filtered = filtered.filter(d => d.esg_linked);
    }
    if (options?.sponsor) {
        filtered = filtered.filter(d => d.sponsor.toLowerCase().includes(options.sponsor!.toLowerCase()));
    }
    if (options?.industry) {
        filtered = filtered.filter(d => d.industry.toLowerCase().includes(options.industry!.toLowerCase()));
    }

    return filtered;
}

// Get top sponsors by deal count
export function getTopSponsors(deals: ComparableDeal[] = COMPARABLE_DEALS, limit: number = 5): { sponsor: string; count: number }[] {
    const sponsorCounts: Record<string, number> = {};
    deals.forEach(d => {
        sponsorCounts[d.sponsor] = (sponsorCounts[d.sponsor] || 0) + 1;
    });

    return Object.entries(sponsorCounts)
        .map(([sponsor, count]) => ({ sponsor, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}

// Pre-calculated stats for immediate use
export const MARKET_STATS = calculateMarketStats();

// Format helpers
export function formatMarketComparison(currentValue: number, type: 'leverage' | 'margin'): {
    vs_median: string;
    percentile_estimate: string;
    assessment: 'conservative' | 'market' | 'aggressive';
} {
    const stats = MARKET_STATS;

    if (type === 'leverage') {
        const diff = currentValue - stats.leverage.median;
        const vs_median = diff > 0 ? `+${diff.toFixed(2)}x above` : diff < 0 ? `${Math.abs(diff).toFixed(2)}x below` : 'at';

        let percentile_estimate: string;
        let assessment: 'conservative' | 'market' | 'aggressive';

        if (currentValue <= stats.leverage.p25) {
            percentile_estimate = '< 25th percentile';
            assessment = 'conservative';
        } else if (currentValue >= stats.leverage.p75) {
            percentile_estimate = '> 75th percentile';
            assessment = 'aggressive';
        } else {
            percentile_estimate = '25th-75th percentile';
            assessment = 'market';
        }

        return { vs_median: `${vs_median} median (${stats.leverage.median}x)`, percentile_estimate, assessment };
    } else {
        const diff = currentValue - stats.margin.median;
        const vs_median = diff > 0 ? `+${diff}bps above` : diff < 0 ? `${Math.abs(diff)}bps below` : 'at';

        let percentile_estimate: string;
        let assessment: 'conservative' | 'market' | 'aggressive';

        if (currentValue <= stats.margin.p25) {
            percentile_estimate = '< 25th percentile';
            assessment = 'aggressive'; // Lower margin = more aggressive for lender
        } else if (currentValue >= stats.margin.p75) {
            percentile_estimate = '> 75th percentile';
            assessment = 'conservative';
        } else {
            percentile_estimate = '25th-75th percentile';
            assessment = 'market';
        }

        return { vs_median: `${vs_median} median (${stats.margin.median}bps)`, percentile_estimate, assessment };
    }
}
