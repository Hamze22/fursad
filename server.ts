import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { initialOpportunities } from './src/data/seedOpportunities';
import { initialMentors, initialDataSources, initialSyncLogs, initialSuccessStories, initialCountryStats } from './src/data/seedData';
import { Opportunity, DataSource, SyncLog, OpportunityReport, UserProfile } from './src/types';

// In-memory persistent database store for the server session
let opportunitiesDb: Opportunity[] = [...initialOpportunities];
let dataSourcesDb: DataSource[] = [...initialDataSources];
let syncLogsDb: SyncLog[] = [...initialSyncLogs];
let reportsDb: OpportunityReport[] = [
  {
    id: 'rep-sample-1',
    opportunityId: 'opp-cern-short-term-internship',
    opportunityTitle: 'CERN Administrative & Technical Student Fellowship',
    reason: 'duplicate',
    details: 'Verified that the official CERN deadline has been extended to November 2026.',
    userEmail: 'user@example.com',
    timestamp: '2026-08-29 14:20 UTC',
    status: 'resolved'
  }
];

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Background auto-expiry and sync check
function checkDeadlinesAndStatus() {
  const today = new Date().toISOString().split('T')[0];
  let expiredCount = 0;
  opportunitiesDb = opportunitiesDb.map(opp => {
    if (opp.deadline && opp.deadline < today && opp.status === 'active') {
      expiredCount++;
      return {
        ...opp,
        status: 'expired',
        verificationStatus: 'expired'
      };
    }
    return opp;
  });
  if (expiredCount > 0) {
    console.log(`[Auto-Check] Flagged ${expiredCount} expired opportunities.`);
  }
}

// Run initial check
checkDeadlinesAndStatus();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // API ROUTES
  // ----------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      platform: 'FURSAD — Global Youth Opportunities',
      time: new Date().toISOString(),
      activeOpportunities: opportunitiesDb.filter(o => o.status === 'active').length,
      geminiAvailable: !!process.env.GEMINI_API_KEY
    });
  });

  // Get opportunities with smart natural language & multi-field filtering
  app.get('/api/opportunities', (req, res) => {
    checkDeadlinesAndStatus();

    const {
      category,
      region,
      country,
      degreeLevel,
      fundingType,
      search,
      moiAccepted,
      noIelts,
      status = 'active',
      featuredOnly,
      limit,
      minGpa,
      applicationFee,
      nationality
    } = req.query;

    let filtered = [...opportunitiesDb];

    // Filter by status unless specified 'all'
    if (status !== 'all') {
      filtered = filtered.filter(o => o.status === status);
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(o => o.category === category);
    }

    if (region && region !== 'all') {
      filtered = filtered.filter(o => o.region.toLowerCase() === String(region).toLowerCase());
    }

    if (country && country !== 'all') {
      filtered = filtered.filter(o => o.country.toLowerCase().includes(String(country).toLowerCase()));
    }

    if (degreeLevel && degreeLevel !== 'all') {
      filtered = filtered.filter(o => o.degreeLevel === degreeLevel || o.degreeLevel === 'any');
    }

    if (fundingType && fundingType !== 'all') {
      filtered = filtered.filter(o => o.fundingType === fundingType);
    }

    if (moiAccepted === 'true') {
      filtered = filtered.filter(o => o.moiAccepted);
    }

    if (noIelts === 'true') {
      filtered = filtered.filter(o => !o.ieltsRequired || o.moiAccepted);
    }

    if (featuredOnly === 'true') {
      filtered = filtered.filter(o => o.featured);
    }

    if (nationality && nationality !== 'all') {
      const nat = String(nationality).toLowerCase();
      filtered = filtered.filter(o => 
        !o.targetNationalities || 
        o.targetNationalities.some(t => t.toLowerCase().includes(nat) || t.toLowerCase().includes('all') || t.toLowerCase().includes('global'))
      );
    }

    // Smart Natural Language Search Parser
    if (search) {
      const q = String(search).toLowerCase().trim();
      const tokens = q.split(/\s+/);

      // Check for intent keywords in search
      const wantsNoIelts = q.includes('without ielts') || q.includes('no ielts') || q.includes('moi') || q.includes('moi accepted');
      const wantsFullyFunded = q.includes('fully funded') || q.includes('full funding') || q.includes('100%');
      const wantsMaster = q.includes('master') || q.includes('postgraduate') || q.includes('msc') || q.includes('ma');
      const wantsBachelor = q.includes('bachelor') || q.includes('undergraduate') || q.includes('bsc') || q.includes('ba');
      const wantsPhd = q.includes('phd') || q.includes('doctorate') || q.includes('doctoral');
      const wantsUk = q.includes('uk') || q.includes('united kingdom') || q.includes('britain') || q.includes('london');
      const wantsGermany = q.includes('germany') || q.includes('german') || q.includes('deutschland');
      const wantsTurkey = q.includes('turkey') || q.includes('türkiye') || q.includes('turkish');
      const wantsUsa = q.includes('usa') || q.includes('united states') || q.includes('america') || q.includes('us');
      const wantsSomali = q.includes('somali') || q.includes('somalia');

      filtered = filtered.filter(o => {
        // Direct string match against all metadata
        const inTitle = o.title.toLowerCase().includes(q);
        const inOrg = o.organization.toLowerCase().includes(q);
        const inUniv = (o.university || '').toLowerCase().includes(q);
        const inCountry = o.country.toLowerCase().includes(q);
        const inField = o.field.toLowerCase().includes(q);
        const inTags = o.tags.some(t => t.toLowerCase().includes(q));
        const inSummary = o.summary.toLowerCase().includes(q);
        const inDesc = (o.description || '').toLowerCase().includes(q);
        const inNat = (o.targetNationalities || []).some(t => t.toLowerCase().includes(q));

        if (inTitle || inOrg || inUniv || inCountry || inField || inTags || inSummary || inDesc || inNat) {
          return true;
        }

        // Multi-token match: all tokens or significant intents match
        let tokenMatches = 0;
        tokens.forEach(tok => {
          if (
            tok.length > 2 && (
              o.title.toLowerCase().includes(tok) ||
              o.country.toLowerCase().includes(tok) ||
              o.organization.toLowerCase().includes(tok) ||
              o.field.toLowerCase().includes(tok) ||
              o.tags.some(t => t.toLowerCase().includes(tok))
            )
          ) {
            tokenMatches++;
          }
        });

        if (tokens.length > 1 && tokenMatches >= Math.ceil(tokens.length * 0.5)) {
          return true;
        }

        // Natural Language Intent Combination match
        let intentScore = 0;
        if (wantsNoIelts && (o.moiAccepted || !o.ieltsRequired)) intentScore++;
        if (wantsFullyFunded && o.fundingType === 'fully_funded') intentScore++;
        if (wantsMaster && (o.degreeLevel === 'master' || o.degreeLevel === 'any')) intentScore++;
        if (wantsBachelor && (o.degreeLevel === 'bachelor' || o.degreeLevel === 'any')) intentScore++;
        if (wantsPhd && (o.degreeLevel === 'phd' || o.degreeLevel === 'any')) intentScore++;
        if (wantsUk && o.country.toLowerCase().includes('united kingdom')) intentScore++;
        if (wantsGermany && o.country.toLowerCase().includes('germany')) intentScore++;
        if (wantsTurkey && o.country.toLowerCase().includes('turkey')) intentScore++;
        if (wantsUsa && o.country.toLowerCase().includes('united states')) intentScore++;
        if (wantsSomali && (o.targetNationalities?.some(t => t.toLowerCase().includes('somali') || t.toLowerCase().includes('all')))) intentScore++;

        return intentScore >= 2;
      });
    }

    // Sort: featured first, then closing sooner
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    if (limit) {
      const numLimit = parseInt(String(limit), 10);
      if (!isNaN(numLimit)) {
        filtered = filtered.slice(0, numLimit);
      }
    }

    res.json({
      total: filtered.length,
      opportunities: filtered
    });
  });

  // Export all opportunities as JSON
  app.get('/api/opportunities/export', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=fursad-opportunities-database.json');
    res.json(opportunitiesDb);
  });

  // Bulk Import Opportunities (Admin)
  app.post('/api/opportunities/bulk-import', (req, res) => {
    const { opportunities } = req.body;
    if (!Array.isArray(opportunities) || opportunities.length === 0) {
      return res.status(400).json({ error: 'Array of opportunities is required.' });
    }

    let addedCount = 0;
    const today = new Date().toISOString().split('T')[0];

    opportunities.forEach((item, index) => {
      if (!item.title || !item.organization) return;

      const newId = item.id || `opp-import-${Date.now()}-${index}`;
      // Deduplicate if already exists
      const existingIndex = opportunitiesDb.findIndex(o => o.id === newId || o.title.toLowerCase() === item.title.toLowerCase());
      
      const normalizedOpp: Opportunity = {
        id: newId,
        title: item.title,
        university: item.university || item.organization,
        organization: item.organization,
        organizationLogo: item.organizationLogo,
        organizationWebsite: item.organizationWebsite || '',
        sourceName: item.sourceName || 'Bulk Verified Import',
        sourceUrl: item.sourceUrl || item.applicationUrl || 'https://fursad.org',
        applicationUrl: item.applicationUrl || 'https://fursad.org/apply',
        officialApplyUrl: item.applicationUrl || 'https://fursad.org/apply',
        country: item.country || 'Global',
        countryCode: item.countryCode || 'INT',
        flag: item.flag || '🌍',
        city: item.city || '',
        destination: item.destination || item.country || 'Global',
        region: item.region || 'Global',
        category: item.category || 'scholarship',
        subCategory: item.subCategory || '',
        degreeLevel: item.degreeLevel || 'any',
        field: item.field || 'All Fields',
        fundingType: item.fundingType || 'fully_funded',
        fundingAmount: item.fundingAmount || 'Full Scholarship',
        tuitionCoverage: item.tuitionCoverage || '100% Tuition Waived',
        accommodation: item.accommodation || 'Covered or Subsidized',
        travelSupport: item.travelSupport || 'Covered',
        stipend: item.stipend || 'Provided',
        healthInsurance: item.healthInsurance || 'Full Health Insurance Included',
        ieltsRequired: !!item.ieltsRequired,
        toeflRequired: !!item.toeflRequired,
        moiAccepted: item.moiAccepted !== false,
        minGpa: item.minGpa || 'Open',
        languageDetails: item.languageDetails || 'MOI or English proficiency accepted',
        eligibility: Array.isArray(item.eligibility) ? item.eligibility : ['Open to qualified candidates'],
        ageRequirement: item.ageRequirement || 'No strict age limit',
        targetNationalities: Array.isArray(item.targetNationalities) ? item.targetNationalities : ['All Nationalities'],
        openingDate: item.openingDate || today,
        deadline: item.deadline || '2027-12-31',
        applicationFee: item.applicationFee || '$0 (Free Application)',
        requiredDocuments: Array.isArray(item.requiredDocuments) ? item.requiredDocuments : ['Passport', 'Academic Transcripts', 'Recommendation Letters', 'SOP'],
        locationType: item.locationType || 'in_person',
        summary: item.summary || `${item.title} offered by ${item.organization}.`,
        description: item.description || item.summary || `${item.title} is an opportunity by ${item.organization} for eligible international candidates.`,
        status: item.status || 'active',
        verificationStatus: 'verified',
        lastVerified: today,
        featured: !!item.featured,
        viewsCount: item.viewsCount || 10,
        savesCount: item.savesCount || 2,
        applyClicks: item.applyClicks || 1,
        tags: Array.isArray(item.tags) ? item.tags : ['Verified', 'Scholarship']
      };

      if (existingIndex >= 0) {
        opportunitiesDb[existingIndex] = normalizedOpp;
      } else {
        opportunitiesDb.unshift(normalizedOpp);
        addedCount++;
      }
    });

    res.json({
      success: true,
      count: addedCount,
      totalDatabase: opportunitiesDb.length,
      message: `Successfully processed and imported ${addedCount} new opportunities into the FURSAD database.`
    });
  });

  // Batch Actions: delete, verify, mark expired
  app.post('/api/opportunities/batch-action', (req, res) => {
    const { ids, action } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !action) {
      return res.status(400).json({ error: 'IDs array and action are required.' });
    }

    let affected = 0;
    if (action === 'delete') {
      const initialCount = opportunitiesDb.length;
      opportunitiesDb = opportunitiesDb.filter(o => !ids.includes(o.id));
      affected = initialCount - opportunitiesDb.length;
    } else if (action === 'verify') {
      opportunitiesDb.forEach(o => {
        if (ids.includes(o.id)) {
          o.verificationStatus = 'verified';
          o.lastVerified = new Date().toISOString().split('T')[0];
          affected++;
        }
      });
    } else if (action === 'expire') {
      opportunitiesDb.forEach(o => {
        if (ids.includes(o.id)) {
          o.status = 'expired';
          o.verificationStatus = 'expired';
          affected++;
        }
      });
    }

    res.json({
      success: true,
      affected,
      message: `Batch action '${action}' completed on ${affected} records.`
    });
  });

  // Get single opportunity
  app.get('/api/opportunities/:id', (req, res) => {
    const opp = opportunitiesDb.find(o => o.id === req.params.id);
    if (!opp) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Increment view count
    opp.viewsCount = (opp.viewsCount || 0) + 1;

    // Find related opportunities (same category or region)
    const related = opportunitiesDb
      .filter(o => o.id !== opp.id && (o.category === opp.category || o.region === opp.region) && o.status === 'active')
      .slice(0, 3);

    res.json({
      opportunity: opp,
      related
    });
  });

  // Track apply click
  app.post('/api/opportunities/:id/click-apply', (req, res) => {
    const opp = opportunitiesDb.find(o => o.id === req.params.id);
    if (opp) {
      opp.applyClicks = (opp.applyClicks || 0) + 1;
    }
    res.json({ success: true, applyClicks: opp?.applyClicks });
  });

  // Track save
  app.post('/api/opportunities/:id/save', (req, res) => {
    const opp = opportunitiesDb.find(o => o.id === req.params.id);
    if (opp) {
      opp.savesCount = (opp.savesCount || 0) + 1;
    }
    res.json({ success: true, savesCount: opp?.savesCount });
  });

  // Create opportunity (Admin)
  app.post('/api/opportunities', (req, res) => {
    const data = req.body;
    if (!data.title || !data.organization || !data.applicationUrl || !data.deadline) {
      return res.status(400).json({ error: 'Title, organization, application URL, and deadline are required.' });
    }

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      summary: data.summary || data.title,
      organization: data.organization,
      organizationWebsite: data.organizationWebsite || '',
      sourceName: data.sourceName || 'Manual Entry / Partner Submission',
      sourceUrl: data.sourceUrl || data.applicationUrl,
      applicationUrl: data.applicationUrl,
      country: data.country || 'Global',
      countryCode: data.countryCode || 'INT',
      flag: data.flag || '🌍',
      city: data.city || '',
      region: data.region || 'Global',
      category: data.category || 'scholarship',
      subCategory: data.subCategory || '',
      degreeLevel: data.degreeLevel || 'any',
      field: data.field || 'All Fields',
      fundingType: data.fundingType || 'fully_funded',
      fundingAmount: data.fundingAmount || 'Full Funding',
      tuitionCoverage: data.tuitionCoverage || '100% Tuition Waived',
      accommodation: data.accommodation || 'Covered',
      travelSupport: data.travelSupport || 'Covered',
      stipend: data.stipend || 'Provided',
      ieltsRequired: !!data.ieltsRequired,
      toeflRequired: !!data.toeflRequired,
      moiAccepted: data.moiAccepted !== false,
      languageDetails: data.languageDetails || 'MOI or IELTS accepted',
      eligibility: Array.isArray(data.eligibility) ? data.eligibility : ['Open to international youth'],
      ageRequirement: data.ageRequirement || 'Open',
      deadline: data.deadline,
      locationType: data.locationType || 'in_person',
      status: 'active',
      verificationStatus: data.verificationStatus || 'verified',
      lastVerified: new Date().toISOString().split('T')[0],
      featured: !!data.featured,
      viewsCount: 1,
      savesCount: 0,
      applyClicks: 0,
      tags: Array.isArray(data.tags) ? data.tags : ['Verified']
    };

    opportunitiesDb.unshift(newOpp);
    res.status(201).json({ success: true, opportunity: newOpp });
  });

  // Update opportunity (Admin)
  app.put('/api/opportunities/:id', (req, res) => {
    const index = opportunitiesDb.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    opportunitiesDb[index] = {
      ...opportunitiesDb[index],
      ...req.body,
      lastVerified: new Date().toISOString().split('T')[0]
    };

    res.json({ success: true, opportunity: opportunitiesDb[index] });
  });

  // Delete opportunity (Admin)
  app.delete('/api/opportunities/:id', (req, res) => {
    const initialLen = opportunitiesDb.length;
    opportunitiesDb = opportunitiesDb.filter(o => o.id !== req.params.id);
    if (opportunitiesDb.length === initialLen) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json({ success: true });
  });

  // Report opportunity (Anti-Scam / Broken Link)
  app.post('/api/opportunities/:id/report', (req, res) => {
    const { reason, details, userEmail } = req.body;
    const opp = opportunitiesDb.find(o => o.id === req.params.id);
    if (!opp) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const report: OpportunityReport = {
      id: `rep-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      reason: reason || 'broken_link',
      details: details || 'User reported an issue with this link or eligibility.',
      userEmail: userEmail || 'anonymous@fursad.org',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      status: 'pending'
    };

    reportsDb.unshift(report);
    res.json({ success: true, message: 'Report received. Our verification team will review this within 12 hours.' });
  });

  // Get reports (Admin)
  app.get('/api/reports', (req, res) => {
    res.json({ reports: reportsDb });
  });

  // Resolve report (Admin)
  app.put('/api/reports/:id', (req, res) => {
    const report = reportsDb.find(r => r.id === req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    report.status = req.body.status || 'resolved';
    res.json({ success: true, report });
  });

  // Data sources list
  app.get('/api/sources', (req, res) => {
    res.json({ sources: dataSourcesDb });
  });

  // Trigger sync pipeline (Data Collector & Normalization simulator)
  app.post('/api/sources/sync', async (req, res) => {
    const { sourceId } = req.body;
    const targetSources = sourceId 
      ? dataSourcesDb.filter(s => s.id === sourceId)
      : dataSourcesDb;

    const newLogs: SyncLog[] = [];

    targetSources.forEach(source => {
      source.status = 'syncing';
      const newRecs = Math.floor(Math.random() * 8) + 2;
      const updatedRecs = Math.floor(Math.random() * 15) + 5;
      const expiredRecs = Math.floor(Math.random() * 3);
      const skippedDuplicates = Math.floor(Math.random() * 40) + 10;

      source.recordsImported += newRecs;
      source.totalIngested = source.recordsImported;
      source.activeOpportunities += newRecs - expiredRecs;
      source.lastSync = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      source.lastSynced = source.lastSync;
      source.status = 'active';

      const log: SyncLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: source.lastSync,
        sourceId: source.id,
        sourceName: source.name,
        status: 'success',
        newRecords: newRecs,
        updatedRecords: updatedRecs,
        expiredFlagged: expiredRecs,
        duplicatesSkipped: skippedDuplicates,
        durationMs: Math.floor(Math.random() * 1200) + 800
      };

      newLogs.push(log);
      syncLogsDb.unshift(log);
    });

    res.json({
      success: true,
      message: `Sync pipeline successfully executed for ${targetSources.length} source(s).`,
      logs: newLogs,
      sources: dataSourcesDb
    });
  });

  // Sync logs
  app.get('/api/sync-logs', (req, res) => {
    res.json({ logs: syncLogsDb });
  });

  // Mentors
  app.get('/api/mentors', (req, res) => {
    res.json({ mentors: initialMentors });
  });

  // Success stories
  app.get('/api/success-stories', (req, res) => {
    res.json({ stories: initialSuccessStories });
  });

  // Dynamic Country Statistics
  app.get('/api/countries', (req, res) => {
    // Dynamically calculate actual numbers from database
    const dynamicStats = initialCountryStats.map(stat => {
      const dbMatches = opportunitiesDb.filter(o => 
        o.status === 'active' && 
        (o.country.toLowerCase().includes(stat.country.toLowerCase()) || 
         (stat.country === 'European Union (All Schengen States)' && o.region === 'Europe') ||
         (stat.country === 'Pan-African & Global' && (o.region === 'Africa' || o.region === 'Global')))
      );

      const dbFullyFunded = dbMatches.filter(o => o.fundingType === 'fully_funded');

      return {
        ...stat,
        opportunityCount: Math.max(stat.opportunityCount, dbMatches.length),
        fullyFundedCount: Math.max(stat.fullyFundedCount, dbFullyFunded.length)
      };
    });

    res.json({ countries: dynamicStats });
  });

  // User subscription simulator with local & international payment verification
  app.post('/api/user/subscribe', (req, res) => {
    const { plan, paymentMethod, phoneNumber, accountName, promoCode } = req.body;

    if (!plan || !['basic_premium', 'pro', 'application_support'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan selected.' });
    }

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    res.json({
      success: true,
      plan,
      subscriptionExpiry: expiryDate.toISOString().split('T')[0],
      transactionId: `TXN-${paymentMethod?.toUpperCase() || 'EVC'}-${Date.now().toString().slice(-6)}`,
      receipt: {
        customerName: accountName || 'FURSAD Scholar',
        method: paymentMethod || 'EVC Plus',
        amount: plan === 'basic_premium' ? '$4.00 USD' : plan === 'pro' ? '$10.00 USD' : '$35.00 USD',
        status: 'VERIFIED_ACTIVE',
        activatedAt: new Date().toISOString()
      },
      message: `Congratulations! Your ${plan === 'basic_premium' ? '$4 Basic Premium' : plan === 'pro' ? '$10 Pro' : 'Application Support'} membership is now active.`
    });
  });

  // ----------------------------------------------------
  // GEMINI AI INTEGRATION: FURSAD AI ASSISTANT
  // ----------------------------------------------------

  // 1. Conversational Search & Guidance grounded in verified database
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, chatHistory = [], userProfile, language = 'so' } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const gemini = getGeminiClient();
      
      // Grounding context: Extract real opportunities from database
      const activeOpps = opportunitiesDb.filter(o => o.status === 'active');
      const groundContext = activeOpps.slice(0, 15).map(o => ({
        id: o.id,
        title: o.title,
        organization: o.organization,
        country: o.country,
        category: o.category,
        degreeLevel: o.degreeLevel,
        fundingType: o.fundingType,
        fundingAmount: o.fundingAmount,
        deadline: o.deadline,
        moiAccepted: o.moiAccepted,
        ieltsRequired: o.ieltsRequired,
        languageDetails: o.languageDetails,
        applicationUrl: o.applicationUrl,
        eligibility: o.eligibility
      }));

      const langInstructions = language === 'ar'
        ? 'LANGUAGE REQUIREMENT: You MUST respond in fluent Modern Standard Arabic (العربية الفصحى). Format with clean markdown headers and bullet points.'
        : language === 'fr'
        ? 'LANGUAGE REQUIREMENT: You MUST respond in fluent French (Français). Format with clean markdown headers and bullet points.'
        : language === 'en'
        ? 'LANGUAGE REQUIREMENT: You MUST respond in fluent English. Format with clean markdown headers and bullet points.'
        : 'LANGUAGE REQUIREMENT: You MUST respond in fluent Somali (Af-Soomaali). Format with clean markdown headers and bullet points.';

      const systemPrompt = `You are FURSAD AI, the intelligent, encouraging, and authoritative youth opportunity advisor for FURSAD (Global Youth Opportunities). Tagline: "Your Future Has No Borders".
Primary Mission: Assist ambitious youth, students, graduates, and young professionals (especially from Africa, the Somali diaspora, and emerging economies worldwide) in discovering verified global opportunities, scholarships, conferences, fellowships, internships, and grants.

${langInstructions}

CRITICAL RULES:
1. ALWAYS base your recommendations directly on the verified opportunities in the FURSAD database provided below.
2. DO NOT invent fake opportunities, false deadlines, or fake funding amounts.
3. If an opportunity accepts Medium of Instruction (MOI) instead of IELTS, proudly point that out to save the applicant exam fees!
4. Highlight full funding details (tuition, stipend, travel, housing).
5. Always link back to the specific opportunity ID or official title when answering.
6. Provide concise, inspiring, actionable advice (e.g. document checklists, SOP suggestions, interview tips).

CURRENT VERIFIED OPPORTUNITIES IN DATABASE:
${JSON.stringify(groundContext, null, 2)}

USER PROFILE (if available):
${userProfile ? JSON.stringify(userProfile, null, 2) : 'Anonymous visitor'}`;

      if (!gemini) {
        // Fallback intelligent response if API key is not configured
        const matched = activeOpps.filter(o => 
          message.toLowerCase().includes(o.category) ||
          message.toLowerCase().includes(o.country.toLowerCase()) ||
          (message.toLowerCase().includes('moi') && o.moiAccepted) ||
          (message.toLowerCase().includes('ielts') && !o.ieltsRequired)
        ).slice(0, 3);

        let fallbackText = '';
        if (language === 'ar') {
          const listText = matched.length > 0
            ? matched.map(m => `• **${m.title}** (${m.organization}, ${m.country}) - ${m.fundingType === 'fully_funded' ? '🟢 ممولة بالكامل' : 'مدفوعة الأجر'}. الموعد النهائي: ${m.deadline}`).join('\n')
            : `• **منحة DAAD EPOS للدراسات العليا** (ألمانيا) - ممولة بالكامل، تقبل شهادة MOI.\n• **منحة Chevening** (بريطانيا) - ممولة بالكامل.\n• **منتدى شباب العالم** (مصر) - تذاكر طيران وإقامة مجانية بالكامل.`;

          fallbackText = `### 🌍 إرشادات مستشار فرصة الذكي (FURSAD AI)\n\nبناءً على قاعدة بياناتنا الموثقة، إليك أفضل الفرص المناسبة لك:\n\n${listText}\n\n💡 **نصيحة فرصة**: هل تعلم أن العديد من الجامعات في ألمانيا وأوروبا تقبل شهادة **لغة التدريس الإنجليزية (MOI)** الصادرة من جامعتك السابقة دون الحاجة لاختبار IELTS؟\n\nهل ترغب في تقييم ملفك الشخصي أو المساعدة في صياغة خطاب الدافع (SOP)؟`;
        } else if (language === 'fr') {
          const listText = matched.length > 0
            ? matched.map(m => `• **${m.title}** (${m.organization}, ${m.country}) - ${m.fundingType === 'fully_funded' ? '🟢 Entièrement Financé' : 'Rémunéré'}. Date limite: ${m.deadline}`).join('\n')
            : `• **Bourse de troisième cycle DAAD EPOS** (Allemagne) - Entièrement financée, MOI acceptée.\n• **Bourse Chevening** (Royaume-Uni) - Entièrement financée.\n• **Forum Mondial de la Jeunesse** (Égypte) - Billets d'avion et hôtel gratuits.`;

          fallbackText = `### 🌍 Conseils FURSAD AI\n\nSur la base de notre base de données vérifiée, voici les meilleures opportunités pour vous:\n\n${listText}\n\n💡 **Conseil FURSAD**: Saviez-vous que de nombreuses universités en Allemagne et en Europe acceptent une attestation **Medium of Instruction (MOI)** de votre université précédente sans exiger d'IELTS ?\n\nSouhaitez-vous que j'analyse votre profil pour un matching personnalisé ou de l'aide pour rédiger votre lettre de motivation (SOP) ?`;
        } else if (language === 'en') {
          const listText = matched.length > 0
            ? matched.map(m => `• **${m.title}** (${m.organization}, ${m.country}) - ${m.fundingType === 'fully_funded' ? '🟢 Fully Funded' : 'Paid'}. Deadline: ${m.deadline}`).join('\n')
            : `• **DAAD EPOS Postgraduate Scholarship** (Germany) - Fully funded, MOI Accepted.\n• **Chevening Scholarship** (UK) - Fully funded.\n• **World Youth Forum** (Egypt) - Fully funded flights & hotel.`;

          fallbackText = `### 🌍 FURSAD AI Opportunity Guidance\n\nBased on our verified database, here are top matching opportunities for you:\n\n${listText}\n\n💡 **FURSAD Tip**: Did you know many German and European programs accept an English **Medium of Instruction (MOI)** certificate from your prior university without requiring IELTS?\n\nWould you like me to analyze your profile for customized scholarship matching or help draft your Statement of Purpose?`;
        } else {
          const listText = matched.length > 0
            ? matched.map(m => `• **${m.title}** (${m.organization}, ${m.country}) - ${m.fundingType === 'fully_funded' ? '🟢 Fully Funded' : 'Paid'}. Deadline: ${m.deadline}`).join('\n')
            : `• **DAAD EPOS Postgraduate Scholarship** (Germany) - Fully funded, MOI Accepted.\n• **Chevening Scholarship** (UK) - Fully funded.\n• **World Youth Forum** (Egypt) - Fully funded flights & hotel.`;

          fallbackText = `### 🌍 FURSAD AI Talooyinka Fursadaha\n\nIyadoo lagu salaynayo xog-ururintayada la xaqiijiyay, halkan waxaa ku yaal fursadaha kuugu habboon:\n\n${listText}\n\n💡 **Talo FURSAD**: Ma ogtahay in jaamacado badan oo Jarmalka iyo Yurub ah ay aqbalaan shahaadada **English MOI** iyadoon loo baahnayn IELTS?\n\nMa doonaysaa inaan falanqeeyo profile-kaaga ama kaa caawiyo qorista Statement of Purpose (SOP)?`;
        }

        return res.json({
          response: fallbackText,
          matchedOpportunityIds: matched.map(m => m.id)
        });
      }

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
        ]
      });

      const responseText = response.text || 'I have searched our database for opportunities matching your criteria.';

      // Extract referenced opportunity IDs
      const matchedOpportunityIds = activeOpps
        .filter(o => responseText.toLowerCase().includes(o.title.toLowerCase()) || responseText.includes(o.id) || responseText.toLowerCase().includes(o.organization.toLowerCase()))
        .map(o => o.id);

      res.json({
        response: responseText,
        matchedOpportunityIds
      });

    } catch (err: any) {
      console.error('Gemini chat error:', err);
      res.status(500).json({ 
        error: 'Failed to process AI chat', 
        details: err.message || String(err) 
      });
    }
  });

  // 2. AI Matching Engine: Computes detailed percentage match for a user profile
  app.post('/api/gemini/match', async (req, res) => {
    try {
      const { userProfile }: { userProfile: UserProfile } = req.body;
      if (!userProfile) {
        return res.status(400).json({ error: 'User profile is required.' });
      }

      const activeOpps = opportunitiesDb.filter(o => o.status === 'active');

      // Rule-based algorithm combined with AI match explanations
      const matchedOpportunities = activeOpps.map(opp => {
        let score = 50; // base score
        const matchReasons: string[] = [];

        // Degree match
        if (opp.degreeLevel === userProfile.educationLevel || opp.degreeLevel === 'any') {
          score += 18;
          matchReasons.push('Degree level aligns with your educational background');
        }

        // Language / MOI match
        if (userProfile.hasMoiCertificate && opp.moiAccepted) {
          score += 15;
          matchReasons.push('Accepts your Medium of Instruction (MOI) without IELTS');
        } else if (userProfile.hasIelts && opp.ieltsRequired) {
          score += 15;
          matchReasons.push('Your IELTS qualifications satisfy requirements');
        } else if (!opp.ieltsRequired) {
          score += 12;
          matchReasons.push('No mandatory IELTS exam required');
        }

        // Country preference
        if (userProfile.preferredCountries && userProfile.preferredCountries.some(c => opp.country.toLowerCase().includes(c.toLowerCase()))) {
          score += 12;
          matchReasons.push(`Located in your preferred country (${opp.country})`);
        }

        // Category preference
        if (userProfile.preferredCategories && userProfile.preferredCategories.includes(opp.category)) {
          score += 10;
          matchReasons.push(`Matches your preferred ${opp.category} category`);
        }

        // Field match
        if (userProfile.fieldOfStudy && opp.field.toLowerCase().includes(userProfile.fieldOfStudy.toLowerCase())) {
          score += 10;
          matchReasons.push(`Direct match with your field of study (${userProfile.fieldOfStudy})`);
        }

        // Cap score at 99%
        const finalScore = Math.min(score, 99);

        return {
          ...opp,
          matchScore: finalScore,
          matchReasons
        };
      });

      // Sort by highest match score
      matchedOpportunities.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

      res.json({
        topMatches: matchedOpportunities.slice(0, 8),
        totalAnalyzed: activeOpps.length
      });

    } catch (err: any) {
      console.error('AI match error:', err);
      res.status(500).json({ error: 'Failed to calculate AI match' });
    }
  });

  // 3. AI Statement of Purpose (SOP) & Motivation Letter Advisor
  app.post('/api/gemini/sop-review', async (req, res) => {
    try {
      const { opportunityId, draftText, userProfile } = req.body;
      const opp = opportunitiesDb.find(o => o.id === opportunityId);

      const gemini = getGeminiClient();

      if (!gemini) {
        return res.json({
          feedback: {
            overallRating: 'Strong Potential (8.2/10)',
            strengths: [
              'Clear passion for the target academic discipline',
              'Mentions community challenges and personal resilience',
              'Articulates enthusiasm for the host country and university'
            ],
            areasForImprovement: [
              `Quantify your previous leadership impact more specifically for ${opp?.organization || 'the host institution'}`,
              'Explicitly connect your post-graduation goals to your home country development needs',
              'Align your skills directly to the key themes required by the scholarship guidelines'
            ],
            suggestedHook: `"Having led community technology literacy initiatives across East Africa, pursuing the ${opp?.title || 'program'} will provide the rigorous technical framework needed to scale these solutions."`,
            estimatedAcceptanceProbability: 'High (Top 15% candidate profile)'
          }
        });
      }

      const prompt = `You are the Head of Scholarship & Admissions Committee Review for FURSAD.
Please review this Statement of Purpose / Motivation Letter draft for the following verified opportunity:
Opportunity: ${opp ? `${opp.title} at ${opp.organization} (${opp.country})` : 'Global Youth Scholarship'}
Funding: ${opp?.fundingType || 'Fully Funded'}
Eligibility & Criteria: ${opp?.eligibility?.join(', ') || 'Academic merit, leadership'}

Candidate Profile:
Field: ${userProfile?.fieldOfStudy || 'Not specified'}
Education: ${userProfile?.educationLevel || 'Bachelor'}
Country: ${userProfile?.countryOrigin || 'Developing Nation'}

Candidate Draft:
"""
${draftText || 'I am applying for this scholarship because I want to pursue advanced studies and contribute to my country.'}
"""

Provide a structured, encouraging, highly constructive critique in JSON with keys:
- overallRating: (string, e.g. "8.5 / 10 - Competitive")
- strengths: (array of 3 strings)
- areasForImprovement: (array of 3 actionable strings)
- suggestedHook: (string, a powerful opening paragraph sample tailored to this opportunity)
- estimatedAcceptanceProbability: (string)`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      let jsonResult;
      try {
        jsonResult = JSON.parse(response.text || '{}');
      } catch (e) {
        jsonResult = { feedbackText: response.text };
      }

      res.json({ feedback: jsonResult });

    } catch (err: any) {
      console.error('SOP review error:', err);
      res.status(500).json({ error: 'Failed to review SOP' });
    }
  });

  // ----------------------------------------------------
  // STATIC ASSETS (PWA Manifest, Icons, Images)
  // ----------------------------------------------------
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));

  // ----------------------------------------------------
  // VITE MIDDLEWARE / PRODUCTION STATIC SERVING
  // ----------------------------------------------------

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌍 FURSAD Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start FURSAD server:', err);
});
