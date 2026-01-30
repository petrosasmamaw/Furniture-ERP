const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/material-reports', require('./routes/materialReportRoutes'));
app.use('/api/machines', require('./routes/machineRoutes'));
app.use('/api/machine-reports', require('./routes/machineReportRoutes'));
app.use('/api/workers', require('./routes/workerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/order-reports', require('./routes/orderReportRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/reserve-items', require('./routes/reserveItemRoutes'));
app.use('/api/balances', require('./routes/balanceRoutes'));
app.use('/api/balance-reports', require('./routes/balanceReportRoutes'));
app.use('/api/credits', require('./routes/creditRoutes'));
app.use('/api/credit-reports', require('./routes/creditReportRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});