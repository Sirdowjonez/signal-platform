const cron = require('node-cron');
const { getActiveSources } = require('./sources');
const Post = require('../models/Post');

let isRunning = false;
let lastRunAt = null;
let runCount = 0;

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function fetchRssFeed(source) {
  // Stub: replace with a real RSS parser (e.g. 'rss-parser' package)
  console.log(`[Pipeline] [RSS] Fetching: ${source.name} (${source.url})`);
  return [];
}

async function fetchApiSource(source) {
  const apiKey = source.apiKeyEnv ? process.env[source.apiKeyEnv] : null;
  if (!apiKey) {
    console.warn(`[Pipeline] [API] Skipping ${source.name} — missing env var ${source.apiKeyEnv}`);
    return [];
  }
  // Stub: replace with real fetch/axios call
  console.log(`[Pipeline] [API] Fetching: ${source.name}`);
  return [];
}

// ── Transform raw item → Post shape ──────────────────────────────────────────

function transformItem(raw, source) {
  return {
    title: raw.title || 'Untitled',
    slug: (raw.title || `post-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    summary: raw.contentSnippet || raw.description || '',
    content: raw.content || raw.contentSnippet || '',
    source: source.name,
    sourceUrl: raw.link || raw.url || source.url,
    category: source.category,
    tags: raw.categories || [],
    imageUrl: raw.enclosure?.url || null,
    author: raw.creator || raw.author || source.name,
    isPremium: false,
    publishedAt: raw.pubDate || raw.isoDate || new Date().toISOString(),
  };
}

// ── Core ingestion run ────────────────────────────────────────────────────────

async function runPipeline() {
  if (isRunning) {
    console.log('[Pipeline] Already running — skipping this cycle.');
    return;
  }

  isRunning = true;
  const startedAt = new Date();
  console.log(`[Pipeline] Starting ingestion run #${++runCount} at ${startedAt.toISOString()}`);

  const sources = getActiveSources();
  let ingested = 0;
  let errors = 0;

  for (const source of sources) {
    try {
      const rawItems =
        source.type === 'rss'
          ? await fetchRssFeed(source)
          : await fetchApiSource(source);

      for (const raw of rawItems) {
        try {
          const data = transformItem(raw, source);

          // Deduplicate by slug
          const existing = Post.findBySlug(data.slug);
          if (!existing) {
            Post.create(data);
            ingested++;
          }
        } catch (itemErr) {
          console.error(`[Pipeline] Failed to store item from ${source.name}:`, itemErr.message);
          errors++;
        }
      }
    } catch (sourceErr) {
      console.error(`[Pipeline] Failed to fetch ${source.name}:`, sourceErr.message);
      errors++;
    }
  }

  isRunning = false;
  lastRunAt = new Date();

  const elapsed = ((lastRunAt - startedAt) / 1000).toFixed(2);
  console.log(
    `[Pipeline] Run #${runCount} complete in ${elapsed}s — ` +
    `ingested: ${ingested}, errors: ${errors}, total posts: ${Post.count()}`
  );
}

// ── Scheduler (every 30 minutes) ─────────────────────────────────────────────

let scheduledTask = null;

function startScheduler() {
  if (scheduledTask) {
    console.log('[Pipeline] Scheduler already started.');
    return;
  }

  // Run immediately on startup, then every 30 minutes
  runPipeline();

  scheduledTask = cron.schedule('*/30 * * * *', () => {
    console.log('[Pipeline] Scheduled run triggered.');
    runPipeline();
  });

  console.log('[Pipeline] Scheduler started — runs every 30 minutes.');
}

function stopScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('[Pipeline] Scheduler stopped.');
  }
}

function getStatus() {
  return {
    isRunning,
    lastRunAt,
    runCount,
    schedulerActive: scheduledTask !== null,
  };
}

module.exports = { startScheduler, stopScheduler, runPipeline, getStatus };
