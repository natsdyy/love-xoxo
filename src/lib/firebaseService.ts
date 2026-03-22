import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

// Interface for inventory items
export interface InventoryItem {
  supplierName: string;
  service: string;
  duration: string;
  category: string;
  price: number;
  quantity: number;
  status: 'Received' | 'Pending' | 'Cancelled';
  createdBy?: string;
  createdAt?: any;
}

// Add new inventory item to Firestore
export const addInventoryItem = async (item: InventoryItem) => {
  try {
    const docRef = await addDoc(collection(db, 'inventory'), {
      ...item,
      createdAt: Timestamp.now(),
      createdDate: new Date().toLocaleDateString(),
      createdTime: new Date().toLocaleTimeString(),
    });
    console.log('Inventory item added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
};

// Get all inventory items
export const getInventoryItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'inventory'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return [];
  }
};

// Get inventory items by status
export const getInventoryByStatus = async (status: string) => {
  try {
    const q = query(collection(db, 'inventory'), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching inventory by status:', error);
    return [];
  }
};

// Get inventory items by service
export const getInventoryByService = async (service: string) => {
  try {
    const q = query(collection(db, 'inventory'), where('service', '==', service));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching inventory by service:', error);
    return [];
  }
};

// Update inventory item
export const updateInventoryItem = async (itemId: string, updates: Partial<InventoryItem>) => {
  try {
    const itemRef = doc(db, 'inventory', itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    console.log('Inventory item updated:', itemId);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

// Delete inventory item
export const deleteInventoryItem = async (itemId: string) => {
  try {
    await deleteDoc(doc(db, 'inventory', itemId));
    console.log('Inventory item deleted:', itemId);
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};

// Sales record interface
export interface SaleRecord {
  inventoryItemId: string;
  customerName: string;
  customerEmail?: string;
  quantity: number;
  totalPrice: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  saleDate?: any;
  soldBy?: string;
}

// Add sales record
export const addSaleRecord = async (sale: SaleRecord) => {
  try {
    const docRef = await addDoc(collection(db, 'sales'), {
      ...sale,
      saleDate: Timestamp.now(),
      saleDateFormatted: new Date().toLocaleDateString(),
      saleTime: new Date().toLocaleTimeString(),
    });
    console.log('Sale record added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding sale record:', error);
    throw error;
  }
};

// Get all sales records
export const getSalesRecords = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'sales'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching sales records:', error);
    return [];
  }
};

// Get sales by status
export const getSalesByStatus = async (status: string) => {
  try {
    const q = query(collection(db, 'sales'), where('paymentStatus', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching sales by status:', error);
    return [];
  }
};

// Refund record interface
export interface RefundRecord {
  saleRecordId: string;
  customerName: string;
  refundAmount: number;
  refundReason: string;
  refundDate?: any;
  processedBy?: string;
}

// Add refund record
export const addRefundRecord = async (refund: RefundRecord) => {
  try {
    const docRef = await addDoc(collection(db, 'refunds'), {
      ...refund,
      refundDate: Timestamp.now(),
      refundDateFormatted: new Date().toLocaleDateString(),
      refundTime: new Date().toLocaleTimeString(),
    });
    console.log('Refund record added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding refund record:', error);
    throw error;
  }
};

// Get all refunds
export const getRefunds = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'refunds'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching refunds:', error);
    return [];
  }
};
