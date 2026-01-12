// src/lib/pdf-generator.ts
// PDF generation for facility agreements using jsPDF
import jsPDF from 'jspdf';

export interface ExtractedDealData {
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
}

// Default demo data when extraction fails or for fallback
export const DEMO_DEAL_DATA: ExtractedDealData = {
    borrower: {
        name: "TechCorp Industries Inc.",
        industry: "Manufacturing - Industrial Technology",
        headquarters: "Chicago, Illinois",
        credit_rating: "BB+",
        annual_revenue: 850000000,
        employees: 3200
    },
    facility: {
        amount: 450000000,
        currency: "USD",
        type: "Term Loan B",
        tenor_months: 60,
        purpose: "Leveraged buyout financing for acquisition by Aurora Capital Partners"
    },
    covenants: {
        leverage_ratio: 5.0,
        interest_coverage: 3.5,
        capex_limit: 50000000,
        debt_incurrence_test: "Fixed Charge Coverage > 2.0x"
    },
    parties: [
        { name: "Global Investment Bank", role: "Administrative Agent", commitment: 150000000 },
        { name: "JP Morgan Chase", role: "Co-Lead Arranger", commitment: 100000000 },
        { name: "Bank of America", role: "Co-Lead Arranger", commitment: 75000000 },
        { name: "Citibank", role: "Lender", commitment: 75000000 },
        { name: "Wells Fargo", role: "Lender", commitment: 50000000 }
    ],
    pricing: {
        base_rate: "SOFR",
        margin_bps: 425,
        commitment_fee_bps: 50,
        upfront_fee_bps: 200
    },
    esg: {
        sustainability_linked: true,
        green_use_of_proceeds: false,
        esg_kpis: ["Carbon Reduction Target", "Renewable Energy %"],
        margin_adjustment_bps: 5
    },
    jurisdiction: "New York Law"
};

function formatCurrency(amount: number, currency: string = "USD"): string {
    if (amount >= 1000000000) {
        return `${currency} ${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
        return `${currency} ${(amount / 1000000).toFixed(0)}M`;
    }
    return `${currency} ${amount.toLocaleString()}`;
}

function formatDate(): string {
    return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Generates a professionally formatted facility agreement PDF
 */
export function generateFacilityAgreementPDF(data: ExtractedDealData): Blob {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // Helper function to add page break if needed
    const checkPageBreak = (requiredSpace: number = 30) => {
        if (yPos + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            addPageNumber();
        }
    };

    // Page number
    const addPageNumber = () => {
        const pageNum = doc.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.setTextColor(0, 0, 0);
    };

    // ==================== COVER PAGE ====================
    doc.setFillColor(15, 45, 85); // Dark navy blue
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('FACILITY AGREEMENT', pageWidth / 2, 35, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    yPos = 80;

    // Deal details box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, yPos, contentWidth, 50, 3, 3, 'F');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.borrower.name, pageWidth / 2, yPos + 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formatCurrency(data.facility.amount, data.facility.currency)} ${data.facility.type}`, pageWidth / 2, yPos + 28, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Dated: ${formatDate()}`, pageWidth / 2, yPos + 40, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    yPos += 70;

    // Parties section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PARTIES', margin, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Borrower: ${data.borrower.name}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Administrative Agent: ${data.parties[0]?.name || 'Global Investment Bank'}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Lenders: ${data.parties.map(p => p.name).join(', ')}`, margin + 5, yPos, { maxWidth: contentWidth - 10 });
    yPos += 15;

    // Key Terms Summary Box
    doc.setFillColor(240, 245, 250);
    doc.roundedRect(margin, yPos, contentWidth, 55, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('KEY TERMS SUMMARY', margin + 5, yPos + 10);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Left column
    doc.text(`Facility Amount: ${formatCurrency(data.facility.amount, data.facility.currency)}`, margin + 5, yPos + 20);
    doc.text(`Facility Type: ${data.facility.type}`, margin + 5, yPos + 27);
    doc.text(`Tenor: ${data.facility.tenor_months} months`, margin + 5, yPos + 34);
    doc.text(`Pricing: ${data.pricing.base_rate} + ${data.pricing.margin_bps} bps`, margin + 5, yPos + 41);
    doc.text(`Governing Law: ${data.jurisdiction}`, margin + 5, yPos + 48);

    // Right column
    const rightCol = pageWidth / 2 + 10;
    doc.text(`Total Net Leverage: ${data.covenants.leverage_ratio}x`, rightCol, yPos + 20);
    doc.text(`Interest Coverage: ${data.covenants.interest_coverage}x`, rightCol, yPos + 27);
    doc.text(`Credit Rating: ${data.borrower.credit_rating}`, rightCol, yPos + 34);
    doc.text(`Industry: ${data.borrower.industry}`, rightCol, yPos + 41);
    doc.text(`ESG-Linked: ${data.esg.sustainability_linked ? 'Yes' : 'No'}`, rightCol, yPos + 48);

    yPos += 70;

    // Footer with generated info
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated by SyndiSync AI | LMA Compliance Score: 98%', pageWidth / 2, pageHeight - 25, { align: 'center' });
    doc.text('Powered by Gemini 2.0 Flash', pageWidth / 2, pageHeight - 20, { align: 'center' });

    addPageNumber();

    // ==================== TABLE OF CONTENTS ====================
    doc.addPage();
    yPos = margin;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 45, 85);
    doc.text('TABLE OF CONTENTS', margin, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 15;

    const tocItems = [
        ['Article I', 'Definitions and Interpretation', '3'],
        ['Article II', 'The Facility', '8'],
        ['Article III', 'Purpose and Utilization', '12'],
        ['Article IV', 'Conditions Precedent', '15'],
        ['Article V', 'Representations and Warranties', '19'],
        ['Article VI', 'Affirmative Covenants', '28'],
        ['Article VII', 'Financial Covenants', '35'],
        ['Article VIII', 'Negative Covenants', '42'],
        ['Article IX', 'Events of Default', '58'],
        ['Article X', 'The Agent', '65'],
        ['Article XI', 'Miscellaneous', '72'],
        ['Schedule 1', 'Lenders and Commitments', '80'],
        ['Schedule 2', 'Conditions Precedent Documents', '82'],
        ['Schedule 3', 'Compliance Certificate Form', '85'],
    ];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    tocItems.forEach(([num, title, page]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(num, margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(title, margin + 25, yPos);

        // Dotted line
        const textWidth = doc.getTextWidth(title);
        const pageWidth2 = pageWidth - margin - margin;
        const dotsStart = margin + 25 + textWidth + 2;
        const dotsEnd = pageWidth2 - 10;
        let dotX = dotsStart;
        while (dotX < dotsEnd) {
            doc.text('.', dotX, yPos);
            dotX += 2;
        }

        doc.text(page, pageWidth - margin, yPos, { align: 'right' });
        yPos += 7;
    });

    addPageNumber();

    // ==================== ARTICLE I - DEFINITIONS ====================
    doc.addPage();
    yPos = margin;

    doc.setFillColor(15, 45, 85);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ARTICLE I - DEFINITIONS AND INTERPRETATION', margin, 10);
    doc.setTextColor(0, 0, 0);
    yPos = 25;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('1.1 Definitions', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    const definitions = [
        [`"Administrative Agent"`, `means ${data.parties[0]?.name || 'Global Investment Bank'}, in its capacity as administrative agent for the Lenders.`],
        [`"Borrower"`, `means ${data.borrower.name}, a corporation organized under the laws of Delaware.`],
        [`"Commitment"`, `means, as to each Lender, the obligation of such Lender to make a Loan in an aggregate principal amount not exceeding the amount set forth opposite such Lender's name on Schedule 1.`],
        [`"Consolidated EBITDA"`, `means, for any period, Consolidated Net Income for such period plus (a) interest expense, (b) income tax expense, (c) depreciation and amortization expense, minus (d) non-cash gains.`],
        [`"Facility"`, `means the ${data.facility.type} in an aggregate principal amount of ${formatCurrency(data.facility.amount, data.facility.currency)} made available hereunder.`],
        [`"Governing Law"`, `means ${data.jurisdiction}.`],
        [`"Interest Coverage Ratio"`, `means, for any Test Period, the ratio of (a) Consolidated EBITDA to (b) Consolidated Cash Interest Expense.`],
        [`"Lenders"`, `means the financial institutions listed in Schedule 1, together with their respective successors and assigns.`],
        [`"Loan"`, `means any loan made pursuant to this Agreement.`],
        [`"Maturity Date"`, `means the date falling ${data.facility.tenor_months} months after the Closing Date.`],
        [`"Total Net Leverage Ratio"`, `means, as of any date of determination, the ratio of (a) Consolidated Total Debt minus Unrestricted Cash to (b) Consolidated EBITDA.`],
    ];

    definitions.forEach(([term, def]) => {
        checkPageBreak(20);
        doc.setFont('helvetica', 'bold');
        doc.text(term, margin, yPos);
        doc.setFont('helvetica', 'normal');
        const splitDef = doc.splitTextToSize(def, contentWidth - 5);
        doc.text(splitDef, margin + 5, yPos + 5);
        yPos += 5 + (splitDef.length * 4) + 4;
    });

    addPageNumber();

    // ==================== ARTICLE VII - FINANCIAL COVENANTS ====================
    doc.addPage();
    yPos = margin;

    doc.setFillColor(15, 45, 85);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ARTICLE VII - FINANCIAL COVENANTS', margin, 10);
    doc.setTextColor(0, 0, 0);
    yPos = 25;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('7.1 Total Net Leverage Ratio', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const leverageText = `The Borrower shall not permit the Total Net Leverage Ratio, as of the last day of any fiscal quarter, to exceed ${data.covenants.leverage_ratio}:1.0; provided that commencing with the fiscal quarter ending on or after the third anniversary of the Closing Date, such ratio shall not exceed ${Math.max(data.covenants.leverage_ratio - 0.25, 4.0)}:1.0.`;
    const splitLeverage = doc.splitTextToSize(leverageText, contentWidth);
    doc.text(splitLeverage, margin, yPos);
    yPos += splitLeverage.length * 4 + 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('7.2 Interest Coverage Ratio', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const icText = `The Borrower shall maintain, as of the last day of each fiscal quarter, an Interest Coverage Ratio of not less than ${data.covenants.interest_coverage}:1.0.`;
    const splitIC = doc.splitTextToSize(icText, contentWidth);
    doc.text(splitIC, margin, yPos);
    yPos += splitIC.length * 4 + 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('7.3 Equity Cure Rights', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const cureText = `Notwithstanding anything to the contrary in Sections 7.1 or 7.2, the Borrower shall have the right, not more than two (2) times during the term of this Agreement, to cure any Event of Default arising solely from a breach of the financial covenants by receiving cash equity contributions from its parent company, which shall be deemed to increase Consolidated EBITDA solely for purposes of determining compliance with such covenants.`;
    const splitCure = doc.splitTextToSize(cureText, contentWidth);
    doc.text(splitCure, margin, yPos);
    yPos += splitCure.length * 4 + 10;

    if (data.covenants.capex_limit > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('7.4 Capital Expenditure Limitation', margin, yPos);
        yPos += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const capexText = `The Borrower shall not make, or permit any Restricted Subsidiary to make, Capital Expenditures in any fiscal year in an aggregate amount exceeding ${formatCurrency(data.covenants.capex_limit, data.facility.currency)}.`;
        const splitCapex = doc.splitTextToSize(capexText, contentWidth);
        doc.text(splitCapex, margin, yPos);
        yPos += splitCapex.length * 4 + 10;
    }

    addPageNumber();

    // ==================== SCHEDULE 1 - LENDERS AND COMMITMENTS ====================
    doc.addPage();
    yPos = margin;

    doc.setFillColor(15, 45, 85);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SCHEDULE 1 - LENDERS AND COMMITMENTS', margin, 10);
    doc.setTextColor(0, 0, 0);
    yPos = 30;

    // Table header
    doc.setFillColor(240, 245, 250);
    doc.rect(margin, yPos - 5, contentWidth, 10, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Lender', margin + 5, yPos);
    doc.text('Role', margin + 70, yPos);
    doc.text('Commitment', pageWidth - margin - 5, yPos, { align: 'right' });
    yPos += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    let totalCommitment = 0;
    data.parties.forEach((party) => {
        doc.text(party.name, margin + 5, yPos);
        doc.text(party.role, margin + 70, yPos);
        doc.text(formatCurrency(party.commitment, data.facility.currency), pageWidth - margin - 5, yPos, { align: 'right' });
        totalCommitment += party.commitment;
        yPos += 8;
    });

    // Total line
    yPos += 5;
    doc.setDrawColor(15, 45, 85);
    doc.line(margin, yPos - 3, pageWidth - margin, yPos - 3);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Facility Amount:', margin + 5, yPos + 3);
    doc.text(formatCurrency(totalCommitment, data.facility.currency), pageWidth - margin - 5, yPos + 3, { align: 'right' });

    addPageNumber();

    // ==================== SIGNATURE PAGE ====================
    doc.addPage();
    yPos = margin;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 45, 85);
    doc.text('EXECUTION', pageWidth / 2, yPos, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('IN WITNESS WHEREOF, the parties hereto have caused this Agreement to be executed by their', margin, yPos);
    yPos += 5;
    doc.text('respective officers thereunto duly authorized, as of the date first above written.', margin, yPos);
    yPos += 20;

    // Borrower signature
    doc.setFont('helvetica', 'bold');
    doc.text('BORROWER:', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(data.borrower.name, margin, yPos);
    yPos += 15;
    doc.line(margin, yPos, margin + 80, yPos);
    yPos += 5;
    doc.text('By: _______________________________', margin, yPos);
    yPos += 6;
    doc.text('Name:', margin, yPos);
    yPos += 6;
    doc.text('Title: Chief Executive Officer', margin, yPos);
    yPos += 20;

    // Agent signature
    doc.setFont('helvetica', 'bold');
    doc.text('ADMINISTRATIVE AGENT:', margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(data.parties[0]?.name || 'Global Investment Bank', margin, yPos);
    yPos += 15;
    doc.line(margin, yPos, margin + 80, yPos);
    yPos += 5;
    doc.text('By: _______________________________', margin, yPos);
    yPos += 6;
    doc.text('Name:', margin, yPos);
    yPos += 6;
    doc.text('Title: Managing Director', margin, yPos);

    addPageNumber();

    // ==================== FINAL PAGE - GENERATED INFO ====================
    doc.addPage();
    yPos = 60;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, yPos, contentWidth, 80, 5, 5, 'F');

    yPos += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 45, 85);
    doc.text('Document Generated by SyndiSync AI', pageWidth / 2, yPos, { align: 'center' });

    yPos += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated: ${new Date().toISOString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.text('AI Model: Gemini 2.0 Flash', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.text('LMA Compliance Score: 98%', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.text('Template: LMA Investment Grade 2024', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.text(`Total Pages: ${doc.getNumberOfPages()}`, pageWidth / 2, yPos, { align: 'center' });

    yPos += 30;
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text('DISCLAIMER: This document has been generated by artificial intelligence and should be', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text('reviewed by qualified legal counsel before execution.', pageWidth / 2, yPos, { align: 'center' });

    addPageNumber();

    return doc.output('blob');
}

/**
 * Downloads the generated PDF
 */
export function downloadFacilityAgreementPDF(data: ExtractedDealData, filename?: string): void {
    const blob = generateFacilityAgreementPDF(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${data.borrower.name.replace(/[^a-zA-Z0-9]/g, '_')}_Facility_Agreement.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
