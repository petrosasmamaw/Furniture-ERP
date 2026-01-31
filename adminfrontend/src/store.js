import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './slice/itemsSlice';
import materialReportsReducer from './slice/materialReportsSlice';
import machinesReducer from './slice/machinesSlice';
import machineReportsReducer from './slice/machineReportsSlice';
import workersReducer from './slice/workersSlice';
import ordersReducer from './slice/ordersSlice';
import orderReportsReducer from './slice/orderReportsSlice';
import purchasesReducer from './slice/purchasesSlice';
import reserveItemsReducer from './slice/reserveItemsSlice';
import balancesReducer from './slice/balancesSlice';
import balanceReportsReducer from './slice/balanceReportsSlice';
import creditsReducer from './slice/creditsSlice';
import creditReportsReducer from './slice/creditReportsSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    materialReports: materialReportsReducer,
    machines: machinesReducer,
    machineReports: machineReportsReducer,
    workers: workersReducer,
    orders: ordersReducer,
    orderReports: orderReportsReducer,
    purchases: purchasesReducer,
    reserveItems: reserveItemsReducer,
    balances: balancesReducer,
    balanceReports: balanceReportsReducer,
    credits: creditsReducer,
    creditReports: creditReportsReducer,
  },
});

export default store;