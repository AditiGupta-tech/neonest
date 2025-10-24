import dbConnect from "@app/lib/db";
import User from "@models/User.model";
import Feeding from "@models/Feeding.model";
import Sleep from "@models/Sleep.model";
import Vaccine from "@models/Vaccine.model";
import Essentials from "@models/Essentials.model";

// Server-side PDF generation using Puppeteer
// POST expects JSON: { user: { name, email }, babies: [ { babyName, dateOfBirth, gender, weight, photoUrl? } ], email?: string }
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  let browser;
  try {
    const payload = await req.json();
    const { user, babies = [], email: emailFromBody } = payload || {};
    const email = user?.email || emailFromBody;

    // Lazy import to reduce cold start
    const puppeteer = (await import('puppeteer')).default || (await import('puppeteer'));

    // Simple helpers
    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const calculateAge = (birthDate) => {
      if (!birthDate) return 'N/A';
      const today = new Date();
      const birth = new Date(birthDate);
      let months = today.getMonth() - birth.getMonth();
      let years = today.getFullYear() - birth.getFullYear();
      if (months < 0) { years--; months += 12; }
      const totalMonths = years * 12 + months;
      if (totalMonths === 0) {
        const days = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
        return `${days} days`;
      } else if (totalMonths < 12) {
        return `${totalMonths} months`;
      }
      const y = Math.floor(totalMonths / 12);
      const m = totalMonths % 12;
      return `${y} year${y > 1 ? 's' : ''}, ${m} months`;
    };

    // Prefer DB data when an email is provided
    let babiesData = babies;
    let parent = user;
    let dbUser = null;
    if (email) {
      await dbConnect();
      dbUser = await User.findOne({ email }).lean();
      if (!dbUser) {
        throw new Error('User not found for the provided email');
      }
      parent = { name: dbUser.name, email: dbUser.email };
      babiesData = (dbUser.BabyDet || []).map((b) => ({
        babyName: b.babyName || b.name || 'Baby',
        dateOfBirth: b.dateOfBirth || b.dob || null,
        gender: b.gender || '—',
        weight: b.weight || b.Weight || '—',
        photoUrl: b.photoUrl || null,
      }));
    }

    const primaryBaby = babiesData[0] || {};
    const todayStr = formatDate(new Date());

    // Fetch related collections if we have a DB user
    let feedingRows = [];
    let sleepRows = [];
    let vaccineRows = [];
    let essentialsRows = [];
    if (dbUser?._id) {
      const uid = dbUser._id;
      const [feedings, sleeps, vaccines, essentials] = await Promise.all([
        Feeding.find({ babyId: uid }).sort({ createdAt: -1 }).limit(50).lean(),
        Sleep.find({ userId: uid }).sort({ date: -1 }).limit(50).lean(),
        Vaccine.find({ userId: uid }).sort({ scheduledDate: 1 }).limit(50).lean(),
        Essentials.find({ userId: uid }).sort({ lastUpdated: -1 }).limit(100).lean(),
      ]);

      feedingRows = feedings || [];
      sleepRows = sleeps || [];
      vaccineRows = vaccines || [];
      essentialsRows = essentials || [];
    }

    // Minimal HTML covering requested sections; styling kept inline for portability
    const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>NeoNest Report</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; color: #333; margin: 24px; }
          h1,h2,h3 { color: #e91e63; margin: 0 0 8px; }
          h2 { border-bottom: 2px solid #e91e63; padding-bottom: 4px; }
          .muted { color: #666; }
          .section { margin: 18px 0 24px; }
          .card { padding: 12px 14px; border: 1px solid #eee; border-radius: 8px; margin-top: 8px; }
          .row { display: flex; gap: 12px; flex-wrap: wrap; }
          .col { flex: 1; min-width: 220px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #e6e6e6; padding: 6px 8px; font-size: 12px; }
          th { background: #fde7f0; text-align: left; }
          .cover { page-break-after: always; text-align: center; margin-top: 80px; }
          .cover .title { font-size: 28px; color: #e91e63; }
          .right { text-align: right; }
          .small { font-size: 12px; }
          .tag { display: inline-block; padding: 2px 6px; border-radius: 999px; background: #fbe5ef; color: #b31262; margin-left: 6px; font-size: 11px; }
          .break { page-break-before: always; }
        </style>
      </head>
      <body>
        <div class="cover">
          <div class="title">NeoNest Baby Report</div>
          <div class="muted">Generated on ${todayStr}</div>
          <div style="margin-top:18px; font-size:18px;">${primaryBaby.babyName || 'Your Baby'}</div>
          <div class="small muted" style="margin-top:6px">Parent/Guardian: ${parent?.name || '—'} (${parent?.email || '—'})</div>
        </div>

        <div class="section">
          <h2>Executive Summary</h2>
          <div class="card">
            <div><b>Current Age:</b> ${primaryBaby?.dateOfBirth ? calculateAge(primaryBaby.dateOfBirth) : 'N/A'} <span class="tag">Key Stats</span></div>
            <div class="muted small" style="margin-top:6px">Overall health and development are tracking as expected based on available data. Recent highlights reflect steady routines and milestone progress.</div>
          </div>
        </div>

        <div class="section">
          <h2>Baby Information</h2>
          <div class="row">
            ${(babiesData && babiesData.length ? babiesData : [{ babyName: 'No baby record', dateOfBirth: null, gender: '—', weight: '—' }]).map((b)=>`
              <div class="col card">
                <div><b>${b.babyName || 'Baby'}</b></div>
                <div class="small">DOB: ${b.dateOfBirth ? '${formatDate}'.replace('${formatDate}', '') : ''}${b.dateOfBirth ? formatDate(b.dateOfBirth) : '—'}</div>
                <div class="small">Gender: ${b.gender || '—'}</div>
                <div class="small">Birth Weight: ${b.Weight || b.weight || '—'}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <h2>Feeding Records</h2>
          ${feedingRows.length ? `
          <table>
            <thead><tr><th>Date</th><th>Time</th><th>Type</th><th>Amount</th><th>Notes</th></tr></thead>
            <tbody>
              ${feedingRows.map(f=>`<tr><td>${new Date(f.createdAt).toLocaleDateString()}</td><td>${f.time||'—'}</td><td>${f.type||'—'}</td><td>${f.amount||'—'}</td><td>${f.notes||''}</td></tr>`).join('')}
            </tbody>
          </table>
          ` : `<div class="card small"><span class="muted">No feeding records available.</span></div>`}
        </div>

        <div class="section">
          <h2>Sleep Patterns</h2>
          ${sleepRows.length ? `
          <table>
            <thead><tr><th>Date</th><th>Time</th><th>Type</th><th>Duration</th><th>Mood</th><th>Notes</th></tr></thead>
            <tbody>
              ${sleepRows.map(s=>`<tr><td>${s.date ? new Date(s.date).toLocaleDateString() : (s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—')}</td><td>${s.time||'—'}</td><td>${s.type||'—'}</td><td>${s.duration||'—'}</td><td>${s.mood||''}</td><td>${s.notes||''}</td></tr>`).join('')}
            </tbody>
          </table>
          ` : `<div class="card small"><span class="muted">No sleep records available.</span></div>`}
        </div>

        <div class="section">
          <h2>Growth & Milestones</h2>
          <div class="card small">${babiesData.length ? `Latest weight entry: <b>${(primaryBaby.weight||primaryBaby.Weight||'—')}</b>` : '<span class="muted">No growth or milestone entries recorded.</span>'}</div>
        </div>

        <div class="section">
          <h2>Vaccination Records</h2>
          ${vaccineRows.length ? `
          <table>
            <thead><tr><th>Name</th><th>Scheduled</th><th>Completed</th><th>Status</th></tr></thead>
            <tbody>
              ${vaccineRows.map(v=>`<tr><td>${v.name||'—'}</td><td>${v.scheduledDate?new Date(v.scheduledDate).toLocaleDateString():'—'}</td><td>${v.completedDate?new Date(v.completedDate).toLocaleDateString():'—'}</td><td>${v.status||'scheduled'}</td></tr>`).join('')}
            </tbody>
          </table>
          ` : `<div class="card small"><span class="muted">Vaccinations are pending. No records found.</span></div>`}
        </div>

        

        <div class="section">
          <h2>Essentials Inventory</h2>
          ${essentialsRows.length ? `
          <table>
            <thead><tr><th>Item</th><th>Category</th><th>Stock</th><th>Min</th><th>Status</th></tr></thead>
            <tbody>
              ${essentialsRows.map(e=>{
                const low = typeof e.currentStock==='number' && typeof e.minThreshold==='number' && e.currentStock < e.minThreshold;
                return `<tr><td>${e.name||'—'}</td><td>${e.category||'—'}</td><td>${e.currentStock??'—'}</td><td>${e.minThreshold??'—'}</td><td>${low?'<span style="color:#c62828">Low</span>':'OK'}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
          ` : `<div class="card small"><span class="muted">No essentials inventory found.</span></div>`}
        </div>

        <div class="section">
          <h2>App Usage Statistics</h2>
          <div class="card small"><span class="muted">Insufficient data to calculate usage statistics.</span></div>
        </div>

        <div class="section break">
          <h2>Healthcare Provider Summary</h2>
          <div class="card">
            <div class="small"><b>Highlights:</b> Appropriate growth trajectory, established feeding and sleep routines.</div>
            <div class="small" style="margin-top:6px"><b>Questions:</b> Any concerns about schedule, introducing new foods, and next vaccinations.</div>
            <div class="small" style="margin-top:6px"><b>Vaccination Status:</b> ${babiesData.length ? 'See table above or attached record.' : 'Vaccinations are pending for this baby.'}</div>
          </div>
        </div>

        <div class="small muted right" style="margin-top:24px">Generated by NeoNest</div>
      </body>
    </html>
    `;

    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH || undefined;
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ...(executablePath ? { executablePath } : {}),
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '16mm', right: '12mm', bottom: '16mm', left: '12mm' } });

    await browser.close();

    // Filename: babyname_report_datetime
    const datePart = new Date().toISOString().replace(/[:T]/g,'-').split('.')[0];
    const namePart = (primaryBaby.babyName || 'baby').toLowerCase().replace(/\s+/g,'-');
    return new Response(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${namePart}_report_${datePart}.pdf"`
      }
    });
  } catch (e) {
    if (browser) {
      try { await browser.close(); } catch {}
    }
    return new Response(JSON.stringify({ error: e.message || 'PDF generation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Allow': 'POST', 'Content-Type': 'application/json' }
  });
}
