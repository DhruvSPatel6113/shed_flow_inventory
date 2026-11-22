# ShedFlow Inventory (React Native)

> Industrial multi-shed warehouse inventory & supply-chain management application built in standalone React Native with offline persistence.

[![React Native](https://img.shields.io/badge/React%20Native-0.76+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Zustand](https://img.shields.io/badge/State-Zustand-443e38?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-38bdf8?style=for-the-badge&logo=android&logoColor=white)](https://reactnative.dev/)

---

## 🏭 Real-World Problem Solved
In manufacturing facilities and industrial estates, stock isn't kept in one central room; it moves across physical **Sheds**:
- **Shed A**: Raw Materials Receiving & Staging
- **Shed B**: In-Process Assembly & Fabrications
- **Shed C**: Finished Goods Warehouse
- **Outbound**: Client Dispatches & Logistics

Spreadsheets fail when operators need to track raw material conversions, intra-facility handovers, and generate real-time dispatch slips. **ShedFlow Inventory** provides a dedicated, native mobile tool designed for warehouse operators.

---

## 📦 Core Architecture & Workflows

### 1. Inter-Shed Relocation Engine
- Operators can select any SKU and transfer specific quantities between sheds with zero latency.
- Validates available source shed capacity before executing transfers.

### 2. Outbound Dispatch Authorization
- Client orders are fulfilled directly from finished goods (Shed C).
- Auto-deducts inventory, records the purchasing organization, vehicle registration number, and timestamp.

### 3. Offline-First Resilience
- Warehouses frequently have cellular blackspots. Built using **Zustand** and local storage adapters (`@react-native-async-storage`) to maintain complete operational integrity offline.

---

## 🛠️ Tech Stack
- **Framework**: Standalone Native React Native
- **Navigation**: `@react-navigation/native` & `@react-navigation/bottom-tabs`
- **State Store**: `zustand`
- **Storage**: `@react-native-async-storage/async-storage`

---

## 🚀 Running Locally

```bash
git clone https://github.com/DhruvSPatel6113/shed_flow_inventory.git
cd shed_flow_inventory
npm install
npx react-native run-android
```
