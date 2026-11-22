import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useInventoryStore } from '../store/inventoryStore';
import { InventoryOptimizationAI } from '../ai/OptimizationAI';

export default function AIOptimizerScreen({ navigation }) {
  const { products, dispatches, transferStock } = useInventoryStore();
  const recommendations = InventoryOptimizationAI.generateOptimizationRecommendations(products, dispatches);

  const handleApply = (rec) => {
    if (!rec.recommendedTransfer) {
      Alert.alert('Optimization Note', rec.reason);
      return;
    }
    const { productId, fromShed, toShed, qty } = rec.recommendedTransfer;
    transferStock(productId, fromShed, toShed, qty);
    Alert.alert('AI Optimization Executed', `Automated transfer executed: Moved ${qty} units from ${fromShed} to ${toShed}.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>OPERATIONS RESEARCH & ML OPTIMIZATION</Text>
      <Text style={styles.title}>Predictive Shed Optimizer</Text>
      <Text style={styles.subtitle}>
        Algorithmic demand forecasting, Economic Order Quantity (EOQ), and inter-shed supply-chain rebalancing recommendations.
      </Text>

      {/* Demand & Depletion Forecast Cards */}
      <Text style={styles.sectionHeader}>SKU RUNWAY & DEPLETION FORECASTS</Text>
      {products.map((p) => {
        const velocity = InventoryOptimizationAI.calculateDailyVelocity(dispatches, p.sku);
        const finishedStock = p.shedStock['Shed C (Finished Goods)'] || 0;
        const forecast = InventoryOptimizationAI.forecastDepletion(finishedStock, velocity);
        const eoq = InventoryOptimizationAI.calculateEOQ(velocity * 365);

        return (
          <View key={p.id} style={styles.skuCard}>
            <View style={styles.skuTop}>
              <View>
                <Text style={styles.skuText}>{p.sku}</Text>
                <Text style={styles.skuName}>{p.name}</Text>
              </View>
              <View style={[styles.urgencyBadge, { backgroundColor: forecast.urgencyScore === 'CRITICAL' ? '#991b1b' : '#065f46' }]}>
                <Text style={styles.urgencyText}>{forecast.urgencyScore}</Text>
              </View>
            </View>

            <View style={styles.forecastGrid}>
              <View style={styles.gridBox}>
                <Text style={styles.gridLabel}>Burn Velocity</Text>
                <Text style={styles.gridVal}>{velocity.toFixed(1)} {p.unit}/day</Text>
              </View>
              <View style={styles.gridBox}>
                <Text style={styles.gridLabel}>Stockout In</Text>
                <Text style={[styles.gridVal, { color: forecast.isCriticalStock ? '#f87171' : '#38bdf8' }]}>
                  {forecast.daysRemaining} Days
                </Text>
              </View>
              <View style={styles.gridBox}>
                <Text style={styles.gridLabel}>Optimal EOQ</Text>
                <Text style={styles.gridVal}>{eoq} Units</Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* Prescriptive Recommendations */}
      <Text style={[styles.sectionHeader, { marginTop: 24 }]}>PRESCRIPTIVE BOTTLENECK INTERVENTIONS</Text>
      {recommendations.length === 0 ? (
        <View style={styles.balancedBox}>
          <Text style={styles.balancedText}>✅ All warehouse sheds are operating at optimal equilibrium.</Text>
        </View>
      ) : (
        recommendations.map((rec) => (
          <View key={rec.id} style={[styles.recCard, { borderColor: rec.severity === 'HIGH' ? '#f59e0b' : '#0284c7' }]}>
            <View style={styles.recHeader}>
              <Text style={styles.recTag}>{rec.type}</Text>
              <Text style={[styles.severityText, { color: rec.severity === 'HIGH' ? '#f59e0b' : '#38bdf8' }]}>
                {rec.severity} PRIORITY
              </Text>
            </View>
            <Text style={styles.recAction}>{rec.action}</Text>
            <Text style={styles.recReason}>{rec.reason}</Text>

            {rec.recommendedTransfer && (
              <TouchableOpacity style={styles.applyBtn} onPress={() => handleApply(rec)}>
                <Text style={styles.applyBtnText}>⚡ Auto-Execute Rebalancing Transfer</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 20 },
  eyebrow: { color: '#38bdf8', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  title: { color: '#f8fafc', fontSize: 26, fontWeight: '900', marginBottom: 6 },
  subtitle: { color: '#94a3b8', fontSize: 13, lineHeight: 20, marginBottom: 20 },
  sectionHeader: { color: '#64748b', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12 },
  skuCard: {
    backgroundColor: '#131b2e',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12,
  },
  skuTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  skuText: { color: '#38bdf8', fontSize: 12, fontWeight: '800' },
  skuName: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },
  urgencyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  urgencyText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
  forecastGrid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#090d16', borderRadius: 10, padding: 12 },
  gridBox: { alignItems: 'center' },
  gridLabel: { color: '#64748b', fontSize: 10, fontWeight: '700', marginBottom: 4 },
  gridVal: { color: '#f1f5f9', fontSize: 13, fontWeight: '700' },
  balancedBox: { backgroundColor: '#131b2e', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1e293b' },
  balancedText: { color: '#4ade80', fontSize: 13, fontWeight: '600' },
  recCard: {
    backgroundColor: '#131b2e',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  recHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  recTag: { color: '#94a3b8', fontSize: 11, fontWeight: '800' },
  severityText: { fontSize: 10, fontWeight: '800' },
  recAction: { color: '#f8fafc', fontSize: 15, fontWeight: '800', marginBottom: 6 },
  recReason: { color: '#cbd5e1', fontSize: 13, lineHeight: 18, marginBottom: 12 },
  applyBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});
