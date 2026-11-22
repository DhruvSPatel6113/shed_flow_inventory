import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@shed_flow_inventory_v1';

export const useInventoryStore = create((set, get) => ({
  sheds: ['Shed A (Raw Materials)', 'Shed B (In-Process)', 'Shed C (Finished Goods)'],
  products: [
    { id: '1', sku: 'ST-501', name: 'Industrial Steel Girders', unit: 'Units', shedStock: { 'Shed A (Raw Materials)': 450, 'Shed B (In-Process)': 120, 'Shed C (Finished Goods)': 310 } },
    { id: '2', sku: 'AL-204', name: 'Aluminum Alloy Sheets', unit: 'Sheets', shedStock: { 'Shed A (Raw Materials)': 800, 'Shed B (In-Process)': 250, 'Shed C (Finished Goods)': 620 } },
    { id: '3', sku: 'COP-10', name: 'Copper Coils 10mm', unit: 'Rolls', shedStock: { 'Shed A (Raw Materials)': 200, 'Shed B (In-Process)': 50, 'Shed C (Finished Goods)': 140 } },
  ],
  dispatches: [
    { id: 'D-101', date: '2026-11-20', buyer: 'Metro Infra Ltd', sku: 'ST-501', qty: 50, vehicle: 'MH-04-AB-1234' },
    { id: 'D-102', date: '2026-11-21', buyer: 'Apex Fabworks', sku: 'AL-204', qty: 100, vehicle: 'MH-43-XY-8899' },
  ],

  transferStock: (productId, fromShed, toShed, qty) => {
    const { products } = get();
    const updated = products.map((p) => {
      if (p.id === productId) {
        const currentFrom = p.shedStock[fromShed] || 0;
        const currentTo = p.shedStock[toShed] || 0;
        if (currentFrom >= qty) {
          return {
            ...p,
            shedStock: {
              ...p.shedStock,
              [fromShed]: currentFrom - qty,
              [toShed]: currentTo + qty,
            },
          };
        }
      }
      return p;
    });
    set({ products: updated });
    get().save();
  },

  logDispatch: (buyer, sku, qty, vehicle) => {
    const { dispatches, products } = get();
    const targetProduct = products.find((p) => p.sku === sku);
    if (!targetProduct) return false;

    // Deduct from Finished Goods (Shed C)
    const finishedShed = 'Shed C (Finished Goods)';
    const currentFinished = targetProduct.shedStock[finishedShed] || 0;
    if (currentFinished < qty) return false;

    const updatedProducts = products.map((p) => {
      if (p.sku === sku) {
        return {
          ...p,
          shedStock: {
            ...p.shedStock,
            [finishedShed]: currentFinished - qty,
          },
        };
      }
      return p;
    });

    const newDispatch = {
      id: `D-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      buyer,
      sku,
      qty,
      vehicle,
    };

    set({
      products: updatedProducts,
      dispatches: [newDispatch, ...dispatches],
    });
    get().save();
    return true;
  },

  save: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ products: state.products, dispatches: state.dispatches }));
    } catch (e) {
      console.warn('Failed to save inventory', e);
    }
  },

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set({ products: data.products, dispatches: data.dispatches });
      }
    } catch (e) {
      console.warn('Failed to load inventory', e);
    }
  },
}));
