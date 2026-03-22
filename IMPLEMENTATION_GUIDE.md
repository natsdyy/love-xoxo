# Dynamic Stock Management System Implementation Guide

## Overview
This document explains how to make all pages connected to Firestore for real-time stock management.

## Architecture

### Collections Structure
```
Firestore Collections:
├── stocks           (All inventory items)
├── sales            (Sold transactions)
├── pending          (Reserved/pending items)
├── refunds          (Refunded items)
├── capital          (Cost per service)
├── prices           (Selling prices)
├── discounts        (Discount rates)
├── orders           (Supplier orders)
├── users            (Login records)
├── admin            (Admin data)
└── owner            (Owner data)
```

## Stock Object Structure
```typescript
Stock {
  id: string;
  service: string;         // "netflix", "grammarly", etc
  serviceCategory: string; // "entertainment", "educational", etc
  duration: string;        // "1 month", "3 months", "1 year", etc
  email: string;           // Account email
  password: string;        // Account password
  category: string;        // "solo profile", "shared", etc
  quantity: number;        // Available quantity
  price: number;           // Selling price
  devices?: string[];      // Device info
  slots?: [{ slot: string; pin: string }]; // Slot/PIN details
  notes?: string;          // Additional notes
  status: 'available' | 'reserved' | 'sold' | 'refunded';
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

## Page Implementation Guide

### 1. NEW STOCKS (Owner Only)
**Location:** `/src/owner/pages/NewStocks.tsx`

**Implementation:**
```typescript
import { addStock, SERVICE_CATEGORIES, DURATIONS, STOCK_CATEGORIES } from '../../lib/stockService';

// Form submission
const handleAddStock = async (formData) => {
  await addStock({
    service: formData.service,
    serviceCategory: formData.serviceCategory,
    duration: formData.duration,
    email: formData.email,
    password: formData.password,
    category: formData.category,
    quantity: formData.quantity,
    price: formData.price,
    devices: formData.devices,
    slots: formData.slots,
    notes: formData.notes,
    createdBy: currentUsername,
  });
};
```

### 2. LIST STOCKS (Owner/Admin)
**Location:** `/src/owner/pages/ListStocks.tsx` & `/src/admin/pages/StockPanel.tsx`

**Implementation:**
```typescript
import { subscribeToStocks } from '../../lib/stockService';
import { useEffect, useState } from 'react';

useEffect(() => {
  // Real-time subscription
  const unsubscribe = subscribeToStocks((stocks) => {
    setStocks(stocks);
  });
  
  return unsubscribe; // Cleanup
}, []);
```

### 3. STOCK PANEL (Admin/Owner)
**Location:** `/src/admin/pages/StockPanel.tsx` & `/src/owner/pages/StockPanel.tsx`

**Features:**
- Dropdown to select stock email (grouped by category)
- Show stock details
- Mark as SOLD or RESERVED
- Record buyer info
- Update stock quantity

**Implementation:**
```typescript
const handleSoldStock = async (stockId, saleData) => {
  // Add sale record
  await addSale({
    stockId,
    service: stock.service,
    email: stock.email,
    buyerName: saleData.buyerName,
    quantity: saleData.quantity,
    price: stock.price * saleData.quantity,
    adminName: currentUsername,
    status: 'pending',
  });
  
  // Update stock quantity
  await updateStock(stockId, {
    quantity: stock.quantity - saleData.quantity,
    status: stock.quantity - saleData.quantity === 0 ? 'sold' : 'available',
  });
};
```

### 4. ON SALE / SOLD
**Location:** `/src/owner/pages/OnSale.tsx` & `/src/owner/pages/Sold.tsx`

**Implementation:**
```typescript
// OnSale page - show available stocks
useEffect(() => {
  const unsubscribe = subscribeToStocksByStatus('available', setStocks);
  return unsubscribe;
}, []);

// Sold page - show sold stocks
useEffect(() => {
  const unsubscribe = subscribeToSales((sales) => {
    setApprovedSales(sales.filter(s => s.status === 'approved'));
  });
  return unsubscribe;
}, []);
```

### 5. PENDING & REFUND
**Location:** `/src/owner/pages/Pending.tsx` & `/src/owner/pages/Refund.tsx`

**Implementation:**
```typescript
// Pending - show reserved stocks waiting for approval
useEffect(() => {
  const unsubscribe = subscribeToePending(setPendingStocks);
  return unsubscribe;
}, []);

// Refund - show refunded transactions
useEffect(() => {
  const unsubscribe = subscribeToRefunds(setRefunds);
  return unsubscribe;
}, []);
```

### 6. ORDERS (Owner Only)
**Location:** `/src/owner/pages/Orders.tsx`

**Implementation:**
```typescript
import { addSupplierOrder, subscribeToSupplierOrders } from '../../lib/transactionService';

// Add new supplier order
const handleAddOrder = async (orderData) => {
  await addSupplierOrder({
    supplierUsername: orderData.supplier,
    services: orderData.services,
    duration: orderData.duration,
    category: orderData.category,
    price: orderData.price,
    quantity: orderData.quantity,
    status: 'pending',
  });
};

// Real-time updates
useEffect(() => {
  const unsubscribe = subscribeToSupplierOrders(setOrders);
  return unsubscribe;
}, []);
```

### 7. CAPITAL (Owner Only)
**Location:** `/src/owner/pages/Capital.tsx`

**Implementation:**
```typescript
import { addCapital, getCapitalByService } from '../../lib/transactionService';

// Add capital for a service
const handleAddCapital = async (capitalData) => {
  await addCapital({
    service: capitalData.service,
    serviceCategory: capitalData.serviceCategory,
    category: capitalData.category,
    price: capitalData.price,
  });
};
```

### 8. PRICE (Owner Only)
**Location:** `/src/owner/pages/Price.tsx`

**Implementation:**
```typescript
import { addPrice, getPriceByService } from '../../lib/transactionService';

const handleAddPrice = async (priceData) => {
  await addPrice({
    service: priceData.service,
    serviceCategory: priceData.serviceCategory,
    duration: priceData.duration,
    category: priceData.category,
    price: priceData.price,
  });
};
```

### 9. REPLACEMENT (Owner/Admin)
**Location:** `/src/owner/pages/Replacements.tsx` & `/src/admin/pages/Replacements.tsx`

**Implementation:**
```typescript
// Show sold stocks that might need replacement
useEffect(() => {
  const unsubscribe = subscribeToSales((sales) => {
    setEligibleForReplacement(
      sales.filter(s => s.status === 'approved' && isWithinReplacementPeriod(s))
    );
  });
  return unsubscribe;
}, []);
```

## Real-Time Synchronization Flow

```
New Stock Added (NewStocks.tsx)
    ↓
Firestore stocks collection updated
    ↓
All listeners (ListStocks, StockPanel, OnSale, etc) receive update
    ↓
Components re-render with new data
```

## Best Practices

### 1. Always Use Real-Time Listeners
```typescript
// Good - auto-updates when data changes
useEffect(() => {
  const unsub = subscribeToStocks(setStocks);
  return unsub; // Important: cleanup on unmount
}, []);

// Avoid - only gets data once
useEffect(() => {
  getAllStocks().then(setStocks);
}, []);
```

### 2. Handle Loading & Empty States
```typescript
if (loading) return <LoadingSpinner />;
if (stocks.length === 0) return <EmptyState />;
return <StockList stocks={stocks} />;
```

### 3. Cleanup Listeners
```typescript
useEffect(() => {
  const unsubscribe = subscribeToStocks(setStocks);
  
  return () => unsubscribe(); // Always cleanup
}, []);
```

### 4. Group Stocks by Category
```typescript
const stocksByCategory = {
  entertainment: stocks.filter(s => s.serviceCategory === 'entertainment'),
  educational: stocks.filter(s => s.serviceCategory === 'educational'),
  editing: stocks.filter(s => s.serviceCategory === 'editing'),
  'other services': stocks.filter(s => s.serviceCategory === 'other services'),
};
```

## Firestore Rules Update

Update your Firestore Rules in Firebase Console:
1. Go to Firebase Console → lovexoxo → Firestore → Rules
2. Copy content from `FIRESTORE_RULES.txt`
3. Publish the rules

## Testing Flow

1. **Owner adds new stock** in NewStocks
2. **Stock appears in** ListStocks, OnSale, StockPanel (within milliseconds)
3. **Admin marks as SOLD** in StockPanel
4. **Sale appears in** Sold, Approval, Inventory
5. **Stock quantity updates** in all pages
6. **Owner approves** → appears in final Sold records

## Next Steps

1. ✅ Create stockService.ts (done)
2. ✅ Create transactionService.ts (done)
3. ✅ Update Firestore Rules (done)
4. 📋 Update NewStocks to use addStock()
5. 📋 Update ListStocks to use subscribeToStocks()
6. 📋 Update StockPanel to use updateStock()
7. 📋 Update Other pages similarly

---

All pages will automatically sync in real-time through Firestore listeners!
