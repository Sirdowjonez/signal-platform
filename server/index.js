const express = require('express');
const cors = require('cors');
const { startScheduler } = require('./pipeline/orchestrator');
const subscriptionsRouter = require('./routes/subscriptions');
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SIGNAL API', timestamp: new Date().toISOString() });
});

app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);
app.use('/api/subscribe', subscriptionsRouter);

app.use((err, req, res, next) => {
  console.error('[SIGNAL API Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[SIGNAL] API server running on port ${PORT}`);
  startScheduler();
});

module.exports = app;
