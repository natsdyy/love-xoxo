import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, Timestamp, onSnapshot, orderBy } from 'firebase/firestore';

// Service categories and items
export const SERVICE_CATEGORIES = {
  entertainment: ['netflix', 'disney', 'hbo max', 'viu', 'prime video', 'vivaone', 'vivamax', 'loklok basic', 'loklok standard', 'youtube', 'crunchyroll', 'iwanttfc', 'spotify'],
  educational: ['grammarly', 'quizlet', 'quillbot', 'scribd', 'studocu', 'chatgpt', 'ms365', 'gemini ai'],
  editing: ['canva', 'capcut', 'picsart'],
  'other services': ['telegram premium', 'domain making'],
};

export const DURATIONS = ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months', '7 months', '8 months', '9 months', '10 months', '11 months', '1 year', 'lifetime'];

export const STOCK_CATEGORIES = ['solo profile', 'shared', 'solo account', 'invite', 'individual', 'famhead', 'edu', 'chichiro', 'haku', 'howl', 'other'];

export interface Stock {
  id?: string;
  service: string;
  serviceCategory: string;
  duration: string;
  email: string;
  password: string;
  category: string;
  quantity: number;
  price: number;
  devices?: string[];
  slots?: Array<{ slot: string; pin: string }>;
  notes?: string;
  status: 'available' | 'reserved' | 'sold' | 'refunded';
  createdBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Add new stock
export const addStock = async (stock: Omit<Stock, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'stocks'), {
      ...stock,
      status: 'available',
      createdAt: Timestamp.now(),
      createdDate: new Date().toLocaleDateString(),
      createdTime: new Date().toLocaleTimeString(),
    });
    console.log('Stock added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding stock:', error);
    throw error;
  }
};

// Get all stocks
export const getAllStocks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'stocks'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Stock[];
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
};

// Get stocks by service category
export const getStocksByCategory = async (serviceCategory: string) => {
  try {
    const q = query(collection(db, 'stocks'), where('serviceCategory', '==', serviceCategory));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Stock[];
  } catch (error) {
    console.error('Error fetching stocks by category:', error);
    return [];
  }
};

// Get stocks by service
export const getStocksByService = async (service: string) => {
  try {
    const q = query(collection(db, 'stocks'), where('service', '==', service));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Stock[];
  } catch (error) {
    console.error('Error fetching stocks by service:', error);
    return [];
  }
};

// Get stocks by status
export const getStocksByStatus = async (status: 'available' | 'reserved' | 'sold' | 'refunded') => {
  try {
    const q = query(collection(db, 'stocks'), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Stock[];
  } catch (error) {
    console.error('Error fetching stocks by status:', error);
    return [];
  }
};

// Update stock
export const updateStock = async (stockId: string, updates: Partial<Stock>) => {
  try {
    const stockRef = doc(db, 'stocks', stockId);
    await updateDoc(stockRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    console.log('Stock updated:', stockId);
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

// Update all stocks with same email and password (shared quantity logic)
export const updateRelatedStocks = async (email: string, password: string, updates: Partial<Stock>) => {
  try {
    const q = query(collection(db, 'stocks'), where('email', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    
    const updatePromises = querySnapshot.docs.map(doc => {
      const stockRef = doc.id;
      return updateStock(stockRef, updates);
    });
    
    await Promise.all(updatePromises);
    console.log(`Updated ${updatePromises.length} related stocks for ${email}`);
  } catch (error) {
    console.error('Error updating related stocks:', error);
    throw error;
  }
};

// Delete stock
export const deleteStock = async (stockId: string) => {
  try {
    await deleteDoc(doc(db, 'stocks', stockId));
    console.log('Stock deleted:', stockId);
  } catch (error) {
    console.error('Error deleting stock:', error);
    throw error;
  }
};

// Real-time listener for all stocks
export const subscribeToStocks = (callback: (stocks: Stock[]) => void) => {
  const q = query(collection(db, 'stocks'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const stocks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Stock[];
    callback(stocks);
  });
  return unsubscribe;
};

// Real-time listener for stocks by category
export const subscribeToStocksByCategory = (serviceCategory: string, callback: (stocks: Stock[]) => void) => {
  const q = query(
    collection(db, 'stocks'),
    where('serviceCategory', '==', serviceCategory),
    orderBy('createdAt', 'desc')
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const stocks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Stock[];
    callback(stocks);
  });
  return unsubscribe;
};

// Real-time listener for stocks by status
export const subscribeToStocksByStatus = (status: 'available' | 'reserved' | 'sold' | 'refunded', callback: (stocks: Stock[]) => void) => {
  const q = query(
    collection(db, 'stocks'),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const stocks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Stock[];
    callback(stocks);
  });
  return unsubscribe;
};

// Calculate available stock count
export const getAvailableStockCount = async () => {
  try {
    const stocks = await getStocksByStatus('available');
    return stocks.length;
  } catch (error) {
    console.error('Error calculating available stock:', error);
    return 0;
  }
};

// Get low stock items (quantity < 5)
export const getLowStockItems = async () => {
  try {
    const stocks = await getAllStocks();
    return stocks.filter(stock => stock.quantity < 5);
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    return [];
  }
};
