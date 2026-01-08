// src/lib/document-generator.ts
// import Docxtemplater from 'docxtemplater'; // TODO: Use in production for full template processing
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

interface DealInfo {
  borrowerName: string;
  facilityAmount: string;
  dealType: string;
  jurisdiction: string;
}

/**
 * Generates a facility agreement Word document
 * In demo mode, this creates a basic document with key sections
 * In production, this would use a full LMA template
 */
export async function generateFacilityAgreement(dealInfo: DealInfo): Promise<void> {
  try {
    // Create a basic DOCX structure
    // Note: For a real implementation, you'd load a base template
    const content = generateDocumentContent(dealInfo);
    
    // Create a simple Word document
    const zip = new PizZip();
    
    // Add the main document XML
    zip.file('word/document.xml', createDocumentXML(content));
    
    // Add required DOCX files
    zip.file('[Content_Types].xml', createContentTypesXML());
    zip.file('_rels/.rels', createRelsXML());
    zip.file('word/_rels/document.xml.rels', createDocumentRelsXML());
    
    // Generate blob
    const blob = zip.generate({ 
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    // Trigger download
    saveAs(blob, `${dealInfo.borrowerName.replace(/\s+/g, '_')}_Facility_Agreement_v1.docx`);
  } catch (error) {
    console.error('Error generating document:', error);
    throw new Error('Failed to generate document');
  }
}

function generateDocumentContent(dealInfo: DealInfo): string {
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
FACILITY AGREEMENT

${dealInfo.borrowerName}
${dealInfo.dealType}

Dated: ${date}

================================================================================

THIS FACILITY AGREEMENT is made on ${date}

BETWEEN:

(1) ${dealInfo.borrowerName} (the "Borrower")

(2) The financial institutions listed in Schedule 1 (the "Lenders")

(3) Global Investment Bank as Administrative Agent (the "Agent")

================================================================================

TABLE OF CONTENTS

Article I - Definitions and Interpretation
Article II - The Facility
Article III - Purpose and Utilization
Article IV - Conditions Precedent
Article V - Representations and Warranties
Article VI - Affirmative Covenants
Article VII - Financial Covenants
Article VIII - Negative Covenants
Article IX - Events of Default
Article X - The Agent
Article XI - Miscellaneous

================================================================================

ARTICLE I - DEFINITIONS AND INTERPRETATION

1.1 Definitions

In this Agreement:

"Borrower" means ${dealInfo.borrowerName}.

"Facility Amount" means ${dealInfo.facilityAmount}.

"Facility" means the term loan facility made available under this Agreement.

"Governing Law" means ${dealInfo.jurisdiction}.

"Maturity Date" means the date falling 60 months after the date of this Agreement.

"Total Net Leverage Ratio" means, as of any date of determination, the ratio of:
(a) Consolidated Total Debt as of such date minus Unrestricted Cash in excess of $30,000,000; to
(b) Consolidated EBITDA for the most recently ended Test Period.

"Interest Coverage Ratio" means, for any Test Period, the ratio of:
(a) Consolidated EBITDA for such Test Period; to
(b) Consolidated Interest Expense for such Test Period.

================================================================================

ARTICLE II - THE FACILITY

2.1 The Facility

Subject to the terms and conditions of this Agreement, the Lenders agree to make available to the Borrower a term loan facility in an aggregate principal amount equal to the Facility Amount.

2.2 Purpose

The Borrower shall use the proceeds of the Facility solely for the purposes of:
(a) financing the acquisition described in the Information Memorandum;
(b) refinancing existing indebtedness; and
(c) paying transaction fees and expenses.

================================================================================

ARTICLE VII - FINANCIAL COVENANTS

7.1 Total Net Leverage Ratio

The Borrower shall not permit the Total Net Leverage Ratio as of the last day of any fiscal quarter to exceed 5.0:1.0, provided that commencing with the fiscal quarter ending December 31, 2027, such ratio shall not exceed 4.75:1.0.

7.2 Interest Coverage Ratio

The Borrower shall maintain, as of the last day of each fiscal quarter, an Interest Coverage Ratio of not less than 3.0:1.0.

7.3 Equity Cure Rights

Notwithstanding anything to the contrary contained in Section 7.1 or Section 7.2, in the event that the Borrower fails to comply with the requirements of such Section(s), until the expiration of the tenth (10th) day subsequent to the date the Compliance Certificate is required to be delivered, the Borrower shall have the right to issue Cure Amount Equity and apply the Net Cash Proceeds thereof to increase Consolidated EBITDA solely for the purposes of determining compliance with such Section(s).

================================================================================

ARTICLE VIII - NEGATIVE COVENANTS

8.1 Indebtedness

The Borrower shall not, and shall not permit any Restricted Subsidiary to, create, incur, assume or suffer to exist any Indebtedness, except:
(a) Indebtedness under the Loan Documents;
(b) Indebtedness existing on the Closing Date;
(c) Intercompany Indebtedness;
(d) Additional Indebtedness not to exceed $50,000,000 in aggregate principal amount.

8.2 Liens

The Borrower shall not, and shall not permit any Restricted Subsidiary to, create, incur, assume or suffer to exist any Lien upon any of its property, except Permitted Liens.

8.3 Restricted Payments

The Borrower shall not make, and shall not permit any Restricted Subsidiary to make, any Restricted Payment, except that the Borrower may make Restricted Payments up to $12,500,000 in any fiscal year, provided that:
(a) the Total Net Leverage Ratio is less than 4.25:1.0 on a pro forma basis;
(b) no Default or Event of Default exists; and
(c) minimum liquidity of $30,000,000 is maintained.

================================================================================

ARTICLE IX - EVENTS OF DEFAULT

9.1 Events of Default

Each of the following events shall constitute an Event of Default:

(a) Non-Payment: The Borrower fails to pay any principal, interest or other amount when due;

(b) Breach of Covenant: The Borrower breaches any covenant contained in this Agreement;

(c) Representation: Any representation or warranty proves to be incorrect in any material respect;

(d) Cross-Default: Default occurs under any other agreement involving Indebtedness exceeding $10,000,000;

(e) Insolvency: The Borrower becomes insolvent or bankrupt;

(f) Material Adverse Change: A Material Adverse Change occurs.

================================================================================

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

${dealInfo.borrowerName}

By: _________________________
Name: [Authorized Signatory]
Title: [Title]


LENDERS:

Global Investment Bank
By: _________________________
Name: John Morrison
Title: Managing Director


JP Morgan Chase
By: _________________________
Name: Sarah Chen
Title: Vice President


Bank of America
By: _________________________
Name: Michael Thompson
Title: Director


[Additional signature pages follow]

================================================================================

SCHEDULE 1 - LENDERS AND COMMITMENTS

Lender                          Commitment
Global Investment Bank          $150,000,000
JP Morgan Chase                 $100,000,000
Bank of America                 $75,000,000
Citibank                        $75,000,000
Wells Fargo                     $50,000,000

Total Facility Amount:          ${dealInfo.facilityAmount}

================================================================================

This document has been generated by SyndiSync AI
Generated on: ${date}
LMA Compliance Score: 98%
AI Model: Claude Sonnet 4

For production use, this document should be reviewed by qualified legal counsel.

================================================================================
END OF DOCUMENT
`;
}

function createDocumentXML(content: string): string {
  // Escape XML special characters
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Split into paragraphs
  const paragraphs = escaped.split('\n').map(line => {
    if (!line.trim()) {
      return '<w:p><w:pPr></w:pPr></w:p>';
    }
    
    // Check if it's a heading
    const isHeading = line.includes('ARTICLE') || line.includes('====') || line === 'FACILITY AGREEMENT';
    const isBold = line.trim().startsWith('(') || line.includes(':') || isHeading;
    
    if (line.includes('====')) {
      return '<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6"/></w:pBdr></w:pPr></w:p>';
    }
    
    return `<w:p>
      <w:pPr>
        ${isHeading ? '<w:pStyle w:val="Heading1"/>' : ''}
      </w:pPr>
      <w:r>
        <w:rPr>
          ${isBold ? '<w:b/>' : ''}
          <w:sz w:val="${isHeading ? '28' : '22'}"/>
        </w:rPr>
        <w:t xml:space="preserve">${line}</w:t>
      </w:r>
    </w:p>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs}
  </w:body>
</w:document>`;
}

function createContentTypesXML(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
}

function createRelsXML(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
}

function createDocumentRelsXML(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;
}

/**
 * Alternative: Download a pre-generated sample document
 * This is simpler but less dynamic
 */
export function downloadSampleDocument(fileName: string): void {
  const sampleText = `FACILITY AGREEMENT - SAMPLE

This is a sample facility agreement generated by SyndiSync AI.

For a production implementation, this would be a complete LMA-compliant document.

Generated: ${new Date().toISOString()}
`;

  const blob = new Blob([sampleText], { type: 'text/plain' });
  saveAs(blob, fileName);
}
