import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns'; // 🔹 add this
import connectDB from './config/database.js';

dotenv.config();

// 🔹 Force Node to use public DNS (fix MongoDB SRV query issues)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// Connect to database
connectDB(); // 🔹 must be AFTER dns.setServers

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import itemRoutes from './routes/itemRoutes.js';
import materialReportRoutes from './routes/materialReportRoutes.js';
import machineRoutes from './routes/machineRoutes.js';
import machineReportRoutes from './routes/machineReportRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import orderReportRoutes from './routes/orderReportRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import reserveItemRoutes from './routes/reserveItemRoutes.js';
import balanceRoutes from './routes/balanceRoutes.js';
import balanceReportRoutes from './routes/balanceReportRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import creditReportRoutes from './routes/creditReportRoutes.js';

app.use('/api/items', itemRoutes);
app.use('/api/material-reports', materialReportRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/machine-reports', machineReportRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-reports', orderReportRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/reserve-items', reserveItemRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/balance-reports', balanceReportRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/credit-reports', creditReportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
