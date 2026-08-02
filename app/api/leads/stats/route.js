import { NextResponse } from 'next/server';
import { getSheetRows } from '@/lib/googleSheets';
import { requireFullAccess } from '@/lib/apiAuth';
import { withErrorHandling } from '@/lib/withErrorHandling';

const LEADS_SHEET_ID = process.env.GOOGLE_LEADS_SHEET_ID;

// Each entry: [key used in response fields, sheet tab name, trend series key]
const LEAD_TABLES = [
  { key: 'fat', sheet: 'FAT Contouring', trendKey: 'fatContouring', label: 'FAT Contouring' },
  { key: 'body', sheet: 'Body Fillers', trendKey: 'bodyFillers', label: 'Body Fillers' },
  { key: 'hydra', sheet: 'Hydra', trendKey: 'hydra', label: 'Hydra' },
  { key: 'lipBlushing', sheet: 'Lip Blushing & Fillers', trendKey: 'lipBlushingFillers', label: 'Lip Blushing & Fillers' },
  { key: 'endolift', sheet: 'Endolift', trendKey: 'endolift', label: 'Endolift' },
  { key: 'elderWomens', sheet: 'Elder Womens', trendKey: 'elderWomens', label: 'Elder Womens' },
];

export const GET = withErrorHandling(async () => {
  const session = await requireFullAccess();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!LEADS_SHEET_ID) {
    return NextResponse.json(
      { error: 'GOOGLE_LEADS_SHEET_ID is not configured. Add it to your environment variables.' },
      { status: 500 }
    );
  }

  const results = await Promise.all(
    LEAD_TABLES.map((t) => getSheetRows(t.sheet, { spreadsheetId: LEADS_SHEET_ID }))
  );
  const rowsByTable = LEAD_TABLES.map((t, i) => ({ ...t, rows: results[i].rows }));

  const allRows = rowsByTable.flatMap((t) => t.rows);
  const todayKey = toDateKey(new Date());

  const totals = {};
  rowsByTable.forEach((t) => {
    totals[t.key] = t.rows.length;
  });

  const todayLeads = rowsByTable.reduce(
    (sum, t) => sum + t.rows.filter((r) => toDateKey(parseDate(r.created_time)) === todayKey).length,
    0
  );

  // Leads by city (combined, case-insensitive grouping, top 10) — the geographic-origin chart.
  const cityMap = new Map();
  allRows.forEach((r) => {
    const raw = (r.city || '').trim();
    if (!raw) return;
    const key = raw.toLowerCase();
    if (!cityMap.has(key)) cityMap.set(key, { city: raw, count: 0 });
    cityMap.get(key).count++;
  });
  const byCity = Array.from(cityMap.values()).sort((a, b) => b.count - a.count).slice(0, 10);

  // Leads by platform (combined)
  const platformMap = new Map();
  allRows.forEach((r) => {
    const raw = (r.platform || '').trim() || 'Unspecified';
    platformMap.set(raw, (platformMap.get(raw) || 0) + 1);
  });
  const byPlatform = Array.from(platformMap.entries())
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count);

  // Leads by form type (combined) — for a breakdown chart
  const byForm = rowsByTable.map((t) => ({ form: t.label, count: t.rows.length }));

  // 14-day trend, each table as a separate series
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d;
  });
  const trend = days.map((d) => {
    const key = toDateKey(d);
    const point = { date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) };
    rowsByTable.forEach((t) => {
      point[t.trendKey] = t.rows.filter((r) => toDateKey(parseDate(r.created_time)) === key).length;
    });
    return point;
  });

  return NextResponse.json({
    totalFat: totals.fat,
    totalBody: totals.body,
    totalHydra: totals.hydra,
    totalLipBlushing: totals.lipBlushing,
    totalEndolift: totals.endolift,
    totalElderWomens: totals.elderWomens,
    totalLeads: allRows.length,
    todayLeads,
    byCity,
    byPlatform,
    byForm,
    trend,
  });
});

function toDateKey(d) {
  if (!d) return '';
  return d.toISOString().slice(0, 10);
}

function parseDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d) ? null : d;
}
