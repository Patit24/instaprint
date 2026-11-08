import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleCreateOrder, handleVerifyPayment } from './server/razorpay.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// =============================================================================
// RAZORPAY STANDARD WEB CHECKOUT ENDPOINTS
// =============================================================================

// STEP 1: Create Order
app.post('/api/create-order', handleCreateOrder);

// STEP 3: Verify Signature
app.post('/api/verify-payment', handleVerifyPayment);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'INSTAPRINT Studio Baranagar',
    gateway: 'Razorpay Standard Checkout',
    configured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  });
});

// Serve static frontend build in production
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`INSTAPRINT Studio – Razorpay Backend API Server`);
  console.log(`Ready on http://localhost:${PORT}`);
  console.log(`Endpoints: POST /api/create-order, POST /api/verify-payment`);
  console.log(`=======================================================`);
});
