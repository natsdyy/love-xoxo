import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, Timestamp, onSnapshot, orderBy } from 'firebase/firestore';

// Sales/Sold Stocks
export interface Sale {
  id?: string;
  stockId: string;
  service: string;
  serviceCategory: string;
  email: string;
  buyerName: string;
  quantity: number;
  price: number;
  discount?: number;
  totalPrice: number;
  adminName: string;
  status: 'pending' | 'approved' | 'refunded';
  receipt?: string[]; // URLs to uploaded images
  notes?: string;
  createdAt?: any;
  approvedAt?: any;
  refundedAt?: any;
}

export interface PendingStock {
  id?: string;
  stockId: string;
  buyerName: string;
  quantity: number;
  status: 'reserved' | 'pending_approval';
  createdAt?: any;
}

export interface Refund {
  id?: string;
  saleId: string;
  stockId: string;
  service: string;
  buyerName: string;
  reason: string;
  refundAmount: number;
  status: 'pending' | 'completed';
  createdAt?: any;
  completedAt?: any;
}

export interface Capital {
  id?: string;
  service: string;
  category: string;
  duration: string;
  price: number;
  date: string;
}

export interface PriceItem {
  id?: string;
  service: string;
  serviceCategory: string;
  duration: string;
  category: string;
  price: number;
  date?: any;
}

export interface Discount {
  id?: string;
  service: string;
  serviceCategory: string;
  duration: string;
  category: string;
  originalPrice: number;
  discountPercentage: number;
  discountedPrice: number;
  date?: any;
}

export interface SupplierOrder {
  id?: string;
  supplierName: string;
  service: string;
  duration: string;
  category: string;
  price: number;
  quantity: number;
  status: 'Pending' | 'Received' | 'Cancelled' | 'PENDING' | 'COMPLETED' | 'DROPPED';
  createdAt?: any;
  completedAt?: any;
}

export interface MonitoringSlot {
  buyer: string;
  pin: string;
}

export interface MonitoringEntry {
  id?: string;
  service: string;
  email: string;
  password: string;
  slots: MonitoringSlot[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Replacement {
  id?: string;
  saleId: string;
  service: string;
  oldEmail: string;
  newEmail: string;
  buyerName: string;
  reason: string;
  processedBy: string;
  status: 'processing' | 'completed' | 'cancelled' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  createdAt?: any;
}

// ==================== SALES ====================
export const addSale = async (sale: Omit<Sale, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'sales'), {
      ...sale,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  }
};

export const getAllSales = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'sales'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Sale[];
  } catch (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
};

export const getSalesByAdmin = async (adminName: string) => {
  try {
    const q = query(collection(db, 'sales'), where('adminName', '==', adminName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Sale[];
  } catch (error) {
    console.error('Error fetching sales by admin:', error);
    return [];
  }
};

export const updateSale = async (saleId: string, updates: Partial<Sale>) => {
  try {
    const saleRef = doc(db, 'sales', saleId);
    await updateDoc(saleRef, updates);
    console.log('Sale updated:', saleId);
  } catch (error) {
    console.error('Error updating sale:', error);
    throw error;
  }
};

export const deleteSale = async (saleId: string) => {
  try {
    await deleteDoc(doc(db, 'sales', saleId));
    console.log('Sale deleted:', saleId);
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw error;
  }
};

export const clearAllSales = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'sales'));
    const batchDelete = querySnapshot.docs.map(d => deleteDoc(doc(db, 'sales', d.id)));
    await Promise.all(batchDelete);
    console.log('All sales cleared');
  } catch (error) {
    console.error('Error clearing sales:', error);
    throw error;
  }
};

export const subscribeToSales = (callback: (sales: Sale[]) => void) => {
  const q = query(collection(db, 'sales'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const sales = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Sale[];
    callback(sales);
  });
  return unsubscribe;
};

// ==================== PENDING ====================
export const addPending = async (pending: Omit<PendingStock, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'pending'), {
      ...pending,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding pending:', error);
    throw error;
  }
};

export const getAllPending = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pending'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PendingStock[];
  } catch (error) {
    console.error('Error fetching pending:', error);
    return [];
  }
};

export const subscribeToPending = (callback: (pending: PendingStock[]) => void) => {
  const q = query(collection(db, 'pending'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const pending = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PendingStock[];
    callback(pending);
  });
  return unsubscribe;
};

export const updatePending = async (id: string, updates: Partial<PendingStock>) => {
  try {
    const ref = doc(db, 'pending', id);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error('Error updating pending:', error);
    throw error;
  }
};

export const deletePending = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'pending', id));
  } catch (error) {
    console.error('Error deleting pending:', error);
    throw error;
  }
};

// ==================== REFUNDS ====================
export const addRefund = async (refund: Omit<Refund, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'refunds'), {
      ...refund,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding refund:', error);
    throw error;
  }
};

export const getAllRefunds = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'refunds'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Refund[];
  } catch (error) {
    console.error('Error fetching refunds:', error);
    return [];
  }
};

export const subscribeToRefunds = (callback: (refunds: Refund[]) => void) => {
  const q = query(collection(db, 'refunds'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const refunds = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Refund[];
    callback(refunds);
  });
  return unsubscribe;
};

export const updateRefund = async (id: string, updates: Partial<Refund>) => {
  try {
    const ref = doc(db, 'refunds', id);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error('Error updating refund:', error);
    throw error;
  }
};

export const deleteRefund = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'refunds', id));
  } catch (error) {
    console.error('Error deleting refund:', error);
    throw error;
  }
};

// ==================== CAPITAL ====================
export const addCapital = async (capital: Omit<Capital, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'capital'), {
      ...capital,
      date: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding capital:', error);
    throw error;
  }
};

export const getCapitalByService = async (service: string) => {
  try {
    const q = query(collection(db, 'capital'), where('service', '==', service));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Capital[];
  } catch (error) {
    console.error('Error fetching capital:', error);
    return [];
  }
};

export const subscribeToCapital = (callback: (capital: Capital[]) => void) => {
  const q = query(collection(db, 'capital'), orderBy('date', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const capital = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Capital[];
    callback(capital);
  });
  return unsubscribe;
};

export const updateCapital = async (id: string, updates: Partial<Capital>) => {
  try {
    const ref = doc(db, 'capital', id);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error('Error updating capital:', error);
    throw error;
  }
};

export const deleteCapital = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'capital', id));
  } catch (error) {
    console.error('Error deleting capital:', error);
    throw error;
  }
};

// ==================== PRICING ====================
export const addPrice = async (price: Omit<PriceItem, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'prices'), {
      ...price,
      date: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding price:', error);
    throw error;
  }
};

export const getPriceByService = async (service: string) => {
  try {
    const q = query(collection(db, 'prices'), where('service', '==', service));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PriceItem[];
  } catch (error) {
    console.error('Error fetching prices:', error);
    return [];
  }
};

export const subscribeToPrices = (callback: (prices: PriceItem[]) => void) => {
  const q = query(collection(db, 'prices'), orderBy('date', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const prices = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PriceItem[];
    callback(prices);
  });
  return unsubscribe;
};

export const updatePrice = async (id: string, updates: Partial<PriceItem>) => {
  try {
    const ref = doc(db, 'prices', id);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error('Error updating price:', error);
    throw error;
  }
};

export const deletePrice = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'prices', id));
  } catch (error) {
    console.error('Error deleting price:', error);
    throw error;
  }
};

// ==================== DISCOUNTS ====================
export const addDiscount = async (discount: Omit<Discount, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'discounts'), {
      ...discount,
      date: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding discount:', error);
    throw error;
  }
};

export const getAllDiscounts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'discounts'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Discount[];
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return [];
  }
};

export const subscribeToDiscounts = (callback: (discounts: Discount[]) => void) => {
  const q = query(collection(db, 'discounts'), orderBy('date', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const discounts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Discount[];
    callback(discounts);
  });
  return unsubscribe;
};

export const updateDiscount = async (id: string, updates: Partial<Discount>) => {
  try {
    const ref = doc(db, 'discounts', id);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error('Error updating discount:', error);
    throw error;
  }
};

export const deleteDiscount = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'discounts', id));
  } catch (error) {
    console.error('Error deleting discount:', error);
    throw error;
  }
};

// ==================== ORDERS ====================
export const addOrder = async (order: Omit<SupplierOrder, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SupplierOrder[];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const subscribeToOrders = (callback: (orders: SupplierOrder[]) => void) => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SupplierOrder[];
    callback(orders);
  });
  return unsubscribe;
};

export const updateOrder = async (id: string, updates: Partial<SupplierOrder>) => {
  try {
    const ref = doc(db, 'orders', id);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'orders', id));
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// ==================== MONITORING ====================
export const addMonitoring = async (entry: Omit<MonitoringEntry, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'monitoring'), {
      ...entry,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding monitoring entry:', error);
    throw error;
  }
};

export const getMonitoring = async (): Promise<MonitoringEntry[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'monitoring'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MonitoringEntry[];
  } catch (error) {
    console.error('Error fetching monitoring entries:', error);
    return [];
  }
};

export const subscribeToMonitoring = (callback: (entries: MonitoringEntry[]) => void) => {
  const q = query(collection(db, 'monitoring'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const entries = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MonitoringEntry[];
    callback(entries);
  });
  return unsubscribe;
};

export const updateMonitoring = async (id: string, updates: Partial<MonitoringEntry>) => {
  try {
    const ref = doc(db, 'monitoring', id);
    await updateDoc(ref, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating monitoring entry:', error);
    throw error;
  }
};

export const deleteMonitoring = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'monitoring', id));
  } catch (error) {
    console.error('Error deleting monitoring entry:', error);
    throw error;
  }
};

// ==================== REPLACEMENTS ====================
export const addReplacement = async (replacement: Omit<Replacement, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'replacements'), {
      ...replacement,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding replacement:', error);
    throw error;
  }
};

export const getAllReplacements = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'replacements'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Replacement[];
  } catch (error) {
    console.error('Error fetching replacements:', error);
    return [];
  }
};

export const subscribeToReplacements = (callback: (replacements: Replacement[]) => void) => {
  const q = query(collection(db, 'replacements'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const replacements = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Replacement[];
    callback(replacements);
  });
  return unsubscribe;
};

export const updateReplacement = async (id: string, updates: Partial<Replacement>) => {
  try {
    const ref = doc(db, 'replacements', id);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error('Error updating replacement:', error);
    throw error;
  }
};

export const deleteReplacement = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'replacements', id));
  } catch (error) {
    console.error('Error deleting replacement:', error);
    throw error;
  }
};
