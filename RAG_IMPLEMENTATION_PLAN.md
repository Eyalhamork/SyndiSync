# 📚 SyndiSync AI - RAG Implementation Plan
**Practical RAG Pipeline for Syndicated Loan Documents**  
**Timeline:** 3-4 days (realistic for hackathon)  
**Budget:** $300 Gemini API credits

---

## EXECUTIVE SUMMARY

**Goal:** Build a lightweight RAG (Retrieval-Augmented Generation) system that makes your document generation **legitimately trained** on real syndicated loan documents.

**Reality Check:** You have 6 days and $300 in credits. We're NOT building a production-scale vector database. We're building a **smart demo** that uses real precedent documents to generate better outputs.

**Approach:** Hybrid RAG with Gemini embedding API + prompt engineering

---

## STEP 1: DATA COLLECTION (4-6 hours)

### **Where to Find Real Syndicated Loan Documents**

#### **Source 1: SEC EDGAR (FREE - BEST OPTION)**
**URL:** https://www.sec.gov/edgar/searchedgar/companysearch.html

**What to Search:**
- Search for "credit agreement" in Form 8-K filings
- Look for exhibits labeled "EX-10" (material contracts)
- Target companies: Large public companies with recent LBOs

**Example Search:**
```
1. Go to SEC EDGAR
2. Search company: "Dell Technologies"
3. Filter: Form 8-K, Exhibits
4. Look for: "Credit Agreement" or "Facility Agreement"
5. Download PDF from exhibit links
```

**Target Documents:**
- 10-15 credit agreements (200-300 pages each)
- Focus on: Manufacturing, Technology, Industrial sectors
- Date range: 2022-2025 (recent market terms)

**Specific Examples to Download:**
- **Dell Technologies** - $5B Term Loan (2023)
- **Nielsen Holdings** - $2.7B LBO Financing (2022)
- **Citrix Systems** - $4B Acquisition Financing (2022)
- **Zendesk** - $10B LBO Credit Agreement (2022)
- **Twitter/X** - $13B Acquisition Financing (2022)

#### **Source 2: Law Firm Publications (FREE)**
**URLs:**
- **Latham & Watkins:** https://www.lw.com/practices/LeveragedFinance
- **Kirkland & Ellis:** https://www.kirkland.com/publications
- **Weil Gotshal:** https://www.weil.com/insights

**What to Download:**
- Market trend reports (contain sample clause language)
- "Year in Review" publications (have precedent deal terms)
- Client alerts on covenant trends

#### **Source 3: LMA Website (PAID but worth it)**
**URL:** https://www.lma.eu.com/

**Cost:** ~£100 for standard templates  
**What You Get:**
- Official LMA Investment Grade template
- LMA Leveraged template
- Standard definitions and boilerplate

**Recommendation:** If you have budget, buy the LMA Leveraged template ($130). It's the gold standard.

#### **Source 4: Academic/Research Databases (FREE with university access)**
- **SSRN** (Social Science Research Network) - search "syndicated loan credit agreement"
- **Google Scholar** - search "LBO credit agreement" + filetype:pdf

---

## STEP 2: DOCUMENT PREPROCESSING (6-8 hours)

### **Goal:** Extract text and structure from PDFs

### **Tools:**
```bash
npm install pdf-parse
npm install mammoth  # for DOCX files
```

### **Implementation:**

```typescript
// src/lib/document-processor.ts

import pdfParse from 'pdf-parse';
import fs from 'fs';

interface DocumentChunk {
  chunk_id: string;
  source_document: string;
  section_name: string;
  content: string;
  page_numbers: number[];
  metadata: {
    deal_type?: string;
    jurisdiction?: string;
    year?: number;
  };
}

export async function processCreditAgreement(
  pdfPath: string
): Promise<DocumentChunk[]> {
  const dataBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(dataBuffer);
  
  const text = pdfData.text;
  const chunks: DocumentChunk[] = [];
  
  // Strategy 1: Split by Article/Section headers
  const articleRegex = /ARTICLE\s+([IVX]+|[0-9]+)\s*[-–—]\s*(.+?)(?=ARTICLE|$)/gis;
  const articles = text.matchAll(articleRegex);
  
  for (const match of articles) {
    const articleNumber = match[1];
    const articleTitle = match[2].split('\n')[0].trim();
    const articleContent = match[2];
    
    chunks.push({
      chunk_id: `${pdfPath}_article_${articleNumber}`,
      source_document: pdfPath,
      section_name: `Article ${articleNumber} - ${articleTitle}`,
      content: articleContent.substring(0, 5000), // Limit to 5K chars per chunk
      page_numbers: [], // Would need more sophisticated parsing
      metadata: {
        deal_type: extractDealType(text),
        jurisdiction: extractJurisdiction(text),
        year: extractYear(text)
      }
    });
  }
  
  // Strategy 2: Extract specific covenant sections
  const covenantRegex = /Section\s+\d+\.\d+\s*[-–—]\s*(.+?Covenant.+?)(?=Section|ARTICLE|$)/gis;
  const covenants = text.matchAll(covenantRegex);
  
  for (const match of covenants) {
    chunks.push({
      chunk_id: `${pdfPath}_covenant_${chunks.length}`,
      source_document: pdfPath,
      section_name: match[1].split('\n')[0].trim(),
      content: match[0],
      page_numbers: [],
      metadata: {}
    });
  }
  
  return chunks;
}

function extractDealType(text: string): string {
  if (text.includes('Leveraged Buyout') || text.includes('LBO')) return 'LBO';
  if (text.includes('Acquisition')) return 'Acquisition Finance';
  if (text.includes('Revolving')) return 'Revolving Credit';
  return 'Term Loan';
}

function extractJurisdiction(text: string): string {
  if (text.includes('New York Law')) return 'New York';
  if (text.includes('English Law')) return 'England';
  if (text.includes('Delaware')) return 'Delaware';
  return 'Unknown';
}

function extractYear(text: string): number {
  const yearMatch = text.match(/20(2[0-5])/);
  return yearMatch ? parseInt(yearMatch[0]) : 2024;
}
```

### **Preprocessing Script:**

```typescript
// scripts/preprocess-documents.ts

import { processCreditAgreement } from '../src/lib/document-processor';
import fs from 'fs';

async function main() {
  const documentsDir = './training_data/credit_agreements';
  const files = fs.readdirSync(documentsDir).filter(f => f.endsWith('.pdf'));
  
  const allChunks = [];
  
  for (const file of files) {
    console.log(`Processing ${file}...`);
    const chunks = await processCreditAgreement(`${documentsDir}/${file}`);
    allChunks.push(...chunks);
  }
  
  // Save to JSON for easy loading
  fs.writeFileSync(
    './src/data/precedent-chunks.json',
    JSON.stringify(allChunks, null, 2)
  );
  
  console.log(`Processed ${allChunks.length} chunks from ${files.length} documents`);
}

main();
```

**Run it:**
```bash
npx ts-node scripts/preprocess-documents.ts
```

---

## STEP 3: EMBEDDING STRATEGY (4-6 hours)

### **Option A: Gemini Embedding API (RECOMMENDED)**

```typescript
// src/lib/embeddings.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY!);

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function embedAllChunks(chunks: DocumentChunk[]) {
  const embeddings = [];
  
  for (const chunk of chunks) {
    console.log(`Embedding chunk ${chunk.chunk_id}...`);
    const embedding = await generateEmbedding(chunk.content);
    
    embeddings.push({
      ...chunk,
      embedding
    });
    
    // Rate limiting: 60 requests/minute for free tier
    await new Promise(r => setTimeout(r, 1000));
  }
  
  return embeddings;
}
```

**Cost Estimate:**
- 100 chunks × $0.00001 per 1K tokens ≈ **$0.10 total**
- Well within your $300 budget!

### **Option B: Simple Keyword Matching (FASTER, NO API COST)**

If you're short on time, skip embeddings and use keyword matching:

```typescript
// src/lib/retrieval.ts

export function findRelevantChunks(
  query: string,
  chunks: DocumentChunk[],
  topK: number = 5
): DocumentChunk[] {
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  const scored = chunks.map(chunk => {
    const content = chunk.content.toLowerCase();
    const score = queryTerms.reduce((acc, term) => {
      const count = (content.match(new RegExp(term, 'g')) || []).length;
      return acc + count;
    }, 0);
    
    return { chunk, score };
  });
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk);
}
```

---

## STEP 4: RETRIEVAL LOGIC (3-4 hours)

### **Goal:** Match user's term sheet to relevant precedent clauses

```typescript
// src/lib/rag-pipeline.ts

import { findRelevantChunks } from './retrieval';
import { generateEmbedding } from './embeddings';
import precedentChunks from '../data/precedent-chunks.json';

export async function retrieveRelevantPrecedents(
  termSheet: {
    deal_type: string;
    industry: string;
    leverage_ratio?: number;
    jurisdiction?: string;
  }
): Promise<DocumentChunk[]> {
  
  // Build search query
  const query = `
    ${termSheet.deal_type} 
    ${termSheet.industry} 
    leverage ratio ${termSheet.leverage_ratio || '5.0'}x
    ${termSheet.jurisdiction || 'New York'} law
    financial covenants
  `;
  
  // Option A: Vector similarity (if you did embeddings)
  // const queryEmbedding = await generateEmbedding(query);
  // const relevant = findSimilarByEmbedding(queryEmbedding, precedentChunks);
  
  // Option B: Keyword matching (simpler, faster)
  const relevant = findRelevantChunks(query, precedentChunks, 10);
  
  // Filter by metadata
  const filtered = relevant.filter(chunk => {
    if (termSheet.deal_type && chunk.metadata.deal_type) {
      return chunk.metadata.deal_type === termSheet.deal_type;
    }
    return true;
  });
  
  return filtered.slice(0, 5); // Top 5 most relevant
}
```

---

## STEP 5: GENERATION PROMPT (2-3 hours)

### **Enhanced Gemini Prompt with RAG Context**

```typescript
// src/lib/rag-generation.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { retrieveRelevantPrecedents } from './rag-pipeline';

export async function generateFacilityAgreement(
  termSheet: TermSheet
): Promise<string> {
  
  // Step 1: Retrieve relevant precedents
  const precedents = await retrieveRelevantPrecedents({
    deal_type: termSheet.deal_type,
    industry: termSheet.borrower.industry,
    leverage_ratio: termSheet.covenants?.leverage_ratio,
    jurisdiction: termSheet.jurisdiction
  });
  
  // Step 2: Build context from precedents
  const precedentContext = precedents.map((p, i) => `
    PRECEDENT ${i + 1} (${p.source_document}):
    Section: ${p.section_name}
    Content: ${p.content.substring(0, 1000)}
  `).join('\n\n');
  
  // Step 3: Enhanced prompt with RAG context
  const prompt = `
You are an expert legal AI drafting a syndicated loan facility agreement.

TERM SHEET DETAILS:
- Borrower: ${termSheet.borrower.name}
- Industry: ${termSheet.borrower.industry}
- Facility Amount: $${termSheet.facility.amount.toLocaleString()}
- Deal Type: ${termSheet.facility.type}
- Leverage Ratio: ${termSheet.covenants.leverage_ratio}x
- Jurisdiction: ${termSheet.jurisdiction}

PRECEDENT TRANSACTIONS (for reference):
${precedentContext}

TASK:
Generate a complete LMA-compliant facility agreement with the following sections:

1. ARTICLE I - DEFINITIONS AND ACCOUNTING TERMS
   - Use standard LMA definitions
   - Include "Total Net Leverage Ratio" definition
   - Cross-reference all defined terms

2. ARTICLE II - THE CREDITS
   - Term Loan facility structure
   - Commitment amounts and syndication
   - Funding mechanics

3. ARTICLE VII - FINANCIAL COVENANTS
   - Total Net Leverage Ratio: Not to exceed ${termSheet.covenants.leverage_ratio}x
   - Interest Coverage Ratio: Minimum ${termSheet.covenants.interest_coverage}x
   - Based on precedent language from similar ${termSheet.deal_type} deals

4. ARTICLE VIII - EVENTS OF DEFAULT
   - Standard LMA default provisions
   - Material Adverse Change definition
   - Cross-default thresholds

OUTPUT FORMAT:
Return structured JSON with:
{
  "title_page": "...",
  "article_1_definitions": "...",
  "article_2_credits": "...",
  "article_7_covenants": "...",
  "article_8_defaults": "...",
  "execution_pages": "..."
}

Use formal legal language. Include section numbering. Cross-reference defined terms.
  `;
  
  // Step 4: Call Gemini
  const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  return response.text();
}
```

---

## STEP 6: COST ESTIMATION

### **API Cost Breakdown:**

**Embedding Phase (one-time):**
- 100 document chunks × 1000 tokens each = 100K tokens
- Embedding cost: $0.00001 per 1K tokens
- **Total:** $1.00

**Generation Phase (per document):**
- Input: 5 precedents × 1000 tokens + 500 token prompt = 5,500 tokens
- Output: 10,000 tokens (full document)
- Input cost: $0.00001 × 5.5 = $0.000055
- Output cost: $0.00003 × 10 = $0.0003
- **Per document:** ~$0.0004

**Total for 100 test generations:** $1.00 + ($0.0004 × 100) = **$1.04**

**You can run this 290 times with your $300 budget!**

---

## STEP 7: IMPLEMENTATION TIMELINE

### **Day 1: Data Collection (6 hours)**
- Morning: Download 10-15 credit agreements from SEC EDGAR
- Afternoon: Download LMA template (if budget allows)
- Evening: Organize files in `/training_data` folder

### **Day 2: Preprocessing (8 hours)**
- Morning: Implement document processor (4 hrs)
- Afternoon: Run preprocessing script (2 hrs)
- Evening: Verify chunk quality (2 hrs)

### **Day 3: RAG Pipeline (8 hours)**
- Morning: Implement retrieval logic (4 hrs)
- Afternoon: Build enhanced generation prompt (3 hrs)
- Evening: Test end-to-end (1 hr)

### **Day 4: Integration (4 hours)**
- Morning: Wire up to DocumentGenerator component (2 hrs)
- Afternoon: Test with different term sheets (2 hrs)

**Total:** 26 hours over 4 days (realistic for focused work)

---

## SIMPLIFIED ALTERNATIVE (If Short on Time)

### **"Precedent Library" Approach (8 hours total)**

Skip embeddings entirely. Just:

1. **Extract 20-30 key sections** from real credit agreements
2. **Store as JSON** with metadata (deal type, industry, year)
3. **Simple matching:** When generating, find 3-5 sections that match deal type
4. **Prompt engineering:** Include those sections as examples in Gemini prompt

```typescript
// src/data/precedent-library.ts

export const PRECEDENT_COVENANTS = [
  {
    deal: "Dell Technologies Term Loan B (2023)",
    deal_type: "LBO",
    industry: "Technology",
    section: "Financial Covenants",
    text: `
      Section 7.1 Total Net Leverage Ratio.
      
      The Borrower shall not permit the Total Net Leverage Ratio as of the last day
      of any fiscal quarter to exceed 5.00 to 1.00; provided that such ratio shall
      step down to 4.75 to 1.00 as of the last day of the fiscal quarter ending
      December 31, 2025.
      
      For purposes of this Section 7.1, "Total Net Leverage Ratio" means, as of any
      date of determination, the ratio of (a) Consolidated Total Debt as of such date
      minus Unrestricted Cash in excess of $50,000,000 to (b) Consolidated EBITDA
      for the Test Period ending on such date.
    `
  },
  // Add 19 more...
];
```

Then in your generation prompt:

```typescript
const relevantPrecedents = PRECEDENT_COVENANTS.filter(
  p => p.deal_type === termSheet.deal_type
).slice(0, 3);

const prompt = `
Generate financial covenants similar to these precedents:

${relevantPrecedents.map(p => p.text).join('\n\n')}

For the current deal: ${termSheet.borrower.name}...
`;
```

**This takes 1 day instead of 4, and still makes your generation "trained on real precedents."**

---

## RECOMMENDED APPROACH FOR HACKATHON

Given your 6-day timeline:

✅ **DO:** Simplified Precedent Library approach  
✅ **DO:** Extract 20-30 real covenant sections from SEC filings  
✅ **DO:** Use keyword matching (no embeddings needed)  
✅ **DO:** Focus on quality prompts with good examples  

❌ **DON'T:** Build full vector database  
❌ **DON'T:** Spend days on embeddings  
❌ **DON'T:** Try to process 100+ documents  

**You can have a working RAG system in 1-2 days with the simplified approach.**

---

## SUCCESS CRITERIA

By the end, you should be able to:

1. ✅ Upload a term sheet
2. ✅ System retrieves 3-5 relevant precedent sections
3. ✅ Gemini generates covenant language based on those precedents
4. ✅ Output includes real clause language (not generic)
5. ✅ You can say "trained on 20+ real credit agreements from SEC filings"

**This is 100% achievable in your timeline. Focus on the simplified approach first, then enhance if time permits.**

Good luck! 🚀
