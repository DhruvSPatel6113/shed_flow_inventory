import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useInventoryStore } from '../store/inventoryStore';

export default function DashboardScreen() {
  const { sheds, products, dispatches, load } = useInventoryStore();

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>INDUSTRIAL WAREHOUSE MATRIX</Text>
      <Text style={styles.title}>Shed Operations Dashboard</Text>
      <Text style={styles.subtitle}>
        Real-time multi-location stock tracking across manufacturing, assembly, and dispatch sheds.
      </Text>

      {/* Shed Cards */}
      {sheds.map((shedName, idx) => {
        const totalUnitsInShed = products.reduce((acc, p) => acc + (p.shedStock[shedName] || 0), 0);
        return (
          <View key={shedName} style={styles.shedCard}>
            <View style={styles.shedHeader}>
              <Text style={styles.shedIcon}>{idx === 0 ? '🏭' : idx === 1 ? '⚙️' : '📦'}</Text>
              <View style={styles.shedTitleBox}>
                <Text style={styles.shedName}>{shedName}</Text>
                <Text style={styles.shedTotal}>{totalUnitsInShed.toLocaleString()} Units Total</Text>
              </View>
            </View>

            <View style={styles.breakdownBox}>
              {products.map((p) => (
                <View key={p.id} style={styles.productRow}>
                  <Text style={styles.pName}>{p.name}</Text>
                  <Text style={styles.pQty}>{(p.shedStock[shedName] || 0)} {p.unit}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      {/* Quick Metrics */}
      <View style={styles.dispatchesCard}>
        <Text style={styles.dispatchHeader}>LATEST DISPATCH ACTIVITY</Text>
        {dispatches.slice(0, 3).map((d) => (
          <View key={d.id} style={styles.dispatchRow}>
            <View>
              <Text style={styles.buyerText}>{d.buyer}</Text>
              <Text style={styles.dateText}>{d.date} • {d.vehicle}</Text>
            </View>
            <Text style={styles.qtyText}>-{d.qty} {d.sku}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 20 },
  eyebrow: { color: '#38bdf8', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  title: { color: '#f8fafc', fontSize: 26, fontWeight: '900', marginBottom: 6 },
  subtitle: { color: '#94a3b8', fontSize: 13, lineHeight: 20, marginBottom: 20 },
  shedCard: {
    backgroundColor: '#131b2e',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  shedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  shedIcon: { fontSize: 28, marginRight: 12 },
  shedTitleBox: { flex: 1 },
  shedName: { color: '#f1f5f9', fontSize: 16, fontWeight: '800' },
  shedTotal: { color: '#38bdf8', fontSize: 13, fontWeight: '600' },
  breakdownBox: { backgroundColor: '#090d16', borderRadius: 10, padding: 12, gap: 8 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pName: { color: '#94a3b8', fontSize: 13 },
  pQty: { color: '#4ade80', fontSize: 13, fontWeight: '700' },
  dispatchesCard: {
    backgroundColor: '#131b2e',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginTop: 8,
  },
  dispatchHeader: { color: '#64748b', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  dispatchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  buyerText: { color: '#f1f5f9', fontSize: 14, fontWeight: '600' },
  dateText: { color: '#64748b', fontSize: 11, marginTop: 2 },
  qtyText: { color: '#f87171', fontSize: 14, fontWeight: '700' },
});
