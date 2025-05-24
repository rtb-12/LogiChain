require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const billingRoutes = require('./routes/billing');
const attestRoutes = require('./routes/attestations');
const githubWebhook = require('./webhooks/githubWebhook');

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/attestations', attestRoutes);
app.use('/webhooks/github', githubWebhook);


app.get('/', (req, res) => {
  res.send({ status: 'LogiChain backend is running' });
});


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});
