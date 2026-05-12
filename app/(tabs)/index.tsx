import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  bg: "#0d0f1a",
  surface: "#141728",
  surface2: "#1a1f35",
  card: "#1e2440",
  cardBorder: "rgba(255,255,255,0.07)",
  green: "#00e5a0",
  greenDark: "#00b880",
  greenBg: "rgba(0,229,160,0.1)",
  pink: "#ff4d8d",
  pinkBg: "rgba(255,77,141,0.1)",
  purple: "#8b5cf6",
  purpleBg: "rgba(139,92,246,0.12)",
  blue: "#3b82f6",
  orange: "#f59e0b",
  yellow: "#eab308",
  red: "#ef4444",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  textFaint: "#475569",
  white: "#ffffff",
};

const CATEGORY_ICONS: Record<
  string,
  { emoji: string; color: string; bg: string }
> = {
  Supermercado: { emoji: "🛒", color: COLORS.pink, bg: COLORS.pinkBg },
  Almuerzo: { emoji: "🍽️", color: COLORS.orange, bg: "rgba(245,158,11,0.12)" },
  Transporte: { emoji: "🚌", color: COLORS.blue, bg: "rgba(59,130,246,0.12)" },
  Salud: { emoji: "💊", color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
  Entretenimiento: { emoji: "🎮", color: COLORS.purple, bg: COLORS.purpleBg },
  Ropa: { emoji: "👗", color: "#14b8a6", bg: "rgba(20,184,166,0.12)" },
  Educación: { emoji: "📚", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  Otro: { emoji: "📦", color: COLORS.textMuted, bg: "rgba(148,163,184,0.12)" },
  Salario: { emoji: "💰", color: COLORS.green, bg: COLORS.greenBg },
  Freelance: { emoji: "💻", color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  Inversión: { emoji: "📈", color: "#84cc16", bg: "rgba(132,204,22,0.12)" },
};

type Transaction = {
  id: string;
  type: "ingreso" | "gasto";
  amount: number;
  category: string;
  time: string;
  date: string;
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "ingreso",
    amount: 120.0,
    category: "Salario",
    time: "8:00 AM",
    date: "Hoy",
  },
  {
    id: "2",
    type: "gasto",
    amount: 35.4,
    category: "Supermercado",
    time: "8:30 AM",
    date: "Hoy",
  },
  {
    id: "3",
    type: "gasto",
    amount: 2.7,
    category: "Transporte",
    time: "7:45 AM",
    date: "Hoy",
  },
  {
    id: "4",
    type: "gasto",
    amount: 12.5,
    category: "Almuerzo",
    time: "1:15 PM",
    date: "Hoy",
  },
];

const EXPENSE_CATEGORIES = [
  "Supermercado",
  "Almuerzo",
  "Transporte",
  "Salud",
  "Entretenimiento",
  "Ropa",
  "Educación",
  "Otro",
];
const INCOME_CATEGORIES = ["Salario", "Freelance", "Inversión", "Otro"];
const TABS = [
  { key: "inicio", label: "Inicio", emoji: "🏠" },
  { key: "resumen", label: "Resumen", emoji: "📊" },
  { key: "metas", label: "Metas", emoji: "🎯" },
  { key: "ajustes", label: "Ajustes", emoji: "⚙️" },
];

// ─── CIRCULAR PROGRESS ────────────────────────────────────────────────────────
function CircularProgress({ pct }: { pct: number }) {
  const size = 90;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  // Simulate arc via a styled view overlay
  const angle = (pct / 100) * 360;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background ring */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: "rgba(255,255,255,0.08)",
        }}
      />
      {/* Foreground arc — clipped trick using overflow */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderTopColor:
            pct > 80 ? COLORS.red : pct > 50 ? COLORS.yellow : COLORS.green,
          borderRightColor:
            angle >= 90
              ? pct > 80
                ? COLORS.red
                : pct > 50
                  ? COLORS.yellow
                  : COLORS.green
              : "transparent",
          borderBottomColor:
            angle >= 180
              ? pct > 80
                ? COLORS.red
                : pct > 50
                  ? COLORS.yellow
                  : COLORS.green
              : "transparent",
          borderLeftColor:
            angle >= 270
              ? pct > 80
                ? COLORS.red
                : pct > 50
                  ? COLORS.yellow
                  : COLORS.green
              : "transparent",
          transform: [{ rotate: "-90deg" }],
        }}
      />
      <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: "800" }}>
        {pct}%
      </Text>
      <Text
        style={{ color: COLORS.textMuted, fontSize: 10, fontWeight: "500" }}
      >
        Disponible
      </Text>
    </View>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ pct }: { pct: number }) {
  const barColor =
    pct < 50 ? COLORS.green : pct < 80 ? COLORS.orange : COLORS.red;
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const widthInterp = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[
          styles.progressFill,
          { width: widthInterp, backgroundColor: barColor },
        ]}
      />
    </View>
  );
}

// ─── WAVE DECORATION ──────────────────────────────────────────────────────────
function WaveDecoration({ color }: { color: string }) {
  return <View style={[styles.waveLine, { borderColor: color }]} />;
}

// ─── TRANSACTION ITEM ─────────────────────────────────────────────────────────
function TransactionItem({ tx }: { tx: Transaction }) {
  const meta = CATEGORY_ICONS[tx.category] ?? CATEGORY_ICONS["Otro"];
  const sign = tx.type === "gasto" ? "-" : "+";
  const amtColor = tx.type === "gasto" ? COLORS.pink : COLORS.green;
  return (
    <View style={styles.txRow}>
      <View style={[styles.txIcon, { backgroundColor: meta.bg }]}>
        <Text style={{ fontSize: 18 }}>{meta.emoji}</Text>
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txCategory}>{tx.category}</Text>
        <Text style={styles.txTime}>
          {tx.date}, {tx.time}
        </Text>
      </View>
      <Text style={[styles.txAmount, { color: amtColor }]}>
        {sign}${tx.amount.toFixed(2)}
      </Text>
    </View>
  );
}

// ─── RESUMEN SCREEN ───────────────────────────────────────────────────────────
function ResumenScreen({ transactions }: { transactions: Transaction[] }) {
  const gastos = transactions.filter((t) => t.type === "gasto");
  const byCategory: Record<string, number> = {};
  gastos.forEach((g) => {
    byCategory[g.category] = (byCategory[g.category] ?? 0) + g.amount;
  });
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const total = gastos.reduce((s, g) => s + g.amount, 0);

  const BAR_COLORS = [
    COLORS.pink,
    COLORS.purple,
    COLORS.blue,
    COLORS.orange,
    COLORS.green,
    COLORS.yellow,
  ];

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 40 }}>📊</Text>
          <Text style={styles.emptyTitle}>Sin gastos registrados</Text>
          <Text style={styles.emptySubtitle}>
            Agrega tu primer gasto con el botón +
          </Text>
        </View>
      ) : (
        entries.map(([cat, amt], i) => {
          const meta = CATEGORY_ICONS[cat] ?? CATEGORY_ICONS["Otro"];
          const pct = total > 0 ? (amt / total) * 100 : 0;
          return (
            <View key={cat} style={styles.summaryRow}>
              <View style={[styles.txIcon, { backgroundColor: meta.bg }]}>
                <Text style={{ fontSize: 16 }}>{meta.emoji}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.summaryRowHeader}>
                  <Text style={styles.txCategory}>{cat}</Text>
                  <Text style={[styles.txAmount, { color: COLORS.pink }]}>
                    ${amt.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

// ─── METAS SCREEN ─────────────────────────────────────────────────────────────
function MetasScreen() {
  const GOALS = [
    {
      name: "Fondo de emergencia",
      target: 5000,
      saved: 1800,
      emoji: "🛡️",
      color: COLORS.green,
    },
    {
      name: "Vacaciones",
      target: 1500,
      saved: 640,
      emoji: "✈️",
      color: COLORS.blue,
    },
    {
      name: "Nuevo laptop",
      target: 1200,
      saved: 990,
      emoji: "💻",
      color: COLORS.purple,
    },
  ];
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Mis Metas</Text>
      {GOALS.map((g) => {
        const pct = Math.round((g.saved / g.target) * 100);
        return (
          <View key={g.name} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={{ fontSize: 28 }}>{g.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.goalName}>{g.name}</Text>
                <Text style={styles.txTime}>
                  ${g.saved.toFixed(0)} / ${g.target.toFixed(0)}
                </Text>
              </View>
              <Text style={[styles.goalPct, { color: g.color }]}>{pct}%</Text>
            </View>
            <View style={[styles.progressTrack, { marginTop: 10 }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${pct}%`, backgroundColor: g.color },
                ]}
              />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

// ─── AJUSTES SCREEN ───────────────────────────────────────────────────────────
function AjustesScreen() {
  const OPTIONS = [
    { emoji: "👤", label: "Perfil", sub: "Diego López" },
    { emoji: "🔔", label: "Notificaciones", sub: "Activadas" },
    { emoji: "💵", label: "Moneda", sub: "USD ($)" },
    { emoji: "🌙", label: "Tema", sub: "Oscuro" },
    { emoji: "🔒", label: "Seguridad", sub: "PIN activado" },
    { emoji: "📤", label: "Exportar datos", sub: "CSV / PDF" },
  ];
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Ajustes</Text>
      {OPTIONS.map((o) => (
        <TouchableOpacity
          key={o.label}
          style={styles.settingRow}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.txIcon,
              { backgroundColor: "rgba(255,255,255,0.06)" },
            ]}
          >
            <Text style={{ fontSize: 18 }}>{o.emoji}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.txCategory}>{o.label}</Text>
            <Text style={styles.txTime}>{o.sub}</Text>
          </View>
          <Text style={styles.textFaint}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── ADD TRANSACTION MODAL ─────────────────────────────────────────────────────
function AddModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, "id">) => void;
}) {
  const [txType, setTxType] = useState<"gasto" | "ingreso">("gasto");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    } else {
      slideAnim.setValue(500);
    }
  }, [visible]);

  const categories =
    txType === "gasto" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSave = () => {
    const num = parseFloat(amount.replace(",", "."));
    if (!amount || isNaN(num) || num <= 0) {
      setError("Ingresa un monto válido");
      return;
    }
    if (!category) {
      setError("Selecciona una categoría");
      return;
    }
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    onSave({
      type: txType,
      amount: num,
      category,
      time: `${h12}:${m} ${ampm}`,
      date: "Hoy",
    });
    setAmount("");
    setCategory("");
    setError("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity activeOpacity={1}>
            <Animated.View
              style={[
                styles.modalSheet,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Handle */}
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Nueva Transacción</Text>

              {/* Type toggle */}
              <View style={styles.typeToggle}>
                {(["gasto", "ingreso"] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeBtn,
                      txType === t &&
                        (t === "gasto"
                          ? styles.typeBtnActivePink
                          : styles.typeBtnActiveGreen),
                    ]}
                    onPress={() => {
                      setTxType(t);
                      setCategory("");
                      setError("");
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.typeBtnText,
                        txType === t && { color: COLORS.white },
                      ]}
                    >
                      {t === "gasto" ? "🔻 Gasto" : "🔺 Ingreso"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Amount */}
              <Text style={styles.inputLabel}>Monto</Text>
              <View style={styles.amountRow}>
                <Text style={styles.currencySign}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textFaint}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={(v) => {
                    setAmount(v);
                    setError("");
                  }}
                />
              </View>

              {/* Category */}
              <Text style={styles.inputLabel}>Categoría</Text>
              <View style={styles.catGrid}>
                {categories.map((c) => {
                  const meta = CATEGORY_ICONS[c] ?? CATEGORY_ICONS["Otro"];
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.catChip,
                        category === c && {
                          borderColor: meta.color,
                          backgroundColor: meta.bg,
                        },
                      ]}
                      onPress={() => {
                        setCategory(c);
                        setError("");
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 14 }}>{meta.emoji}</Text>
                      <Text
                        style={[
                          styles.catChipText,
                          category === c && { color: meta.color },
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Save button */}
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  {
                    backgroundColor:
                      txType === "gasto" ? COLORS.pink : COLORS.green,
                  },
                ]}
                onPress={handleSave}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ transactions }: { transactions: Transaction[] }) {
  const totalIncome = transactions
    .filter((t) => t.type === "ingreso")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "gasto")
    .reduce((s, t) => s + t.amount, 0);
  const available = totalIncome - totalExpense;
  const pctUsed =
    totalIncome > 0
      ? Math.min(Math.round((totalExpense / totalIncome) * 100), 100)
      : 0;
  const pctAvail = 100 - pctUsed;

  const statusMsg =
    pctUsed < 50
      ? "¡Vas Bien! 😊"
      : pctUsed < 80
        ? "¡Cuidado! ⚠️"
        : "¡Te estás pasando! 🚨";
  const statusColor =
    pctUsed < 50 ? COLORS.green : pctUsed < 80 ? COLORS.orange : COLORS.red;
  const recent = [...transactions].reverse().slice(0, 5);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.homeContent}
    >
      {/* Status card */}
      <View style={styles.statusCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.statusLabel}>Estado de hoy</Text>
          <Text style={[styles.statusMsg, { color: statusColor }]}>
            {statusMsg}
          </Text>
          <Text style={styles.statusSub}>
            Aún te queda el {pctAvail}% de tu ingreso disponible
          </Text>
        </View>
        <CircularProgress pct={pctAvail} />
      </View>

      {/* Income / Expense row */}
      <View style={styles.miniCardsRow}>
        <View style={[styles.miniCard, { borderColor: `${COLORS.green}30` }]}>
          <View style={styles.miniCardHeader}>
            <View
              style={[styles.miniIcon, { backgroundColor: COLORS.greenBg }]}
            >
              <Text
                style={{ color: COLORS.green, fontSize: 16, fontWeight: "700" }}
              >
                ↑
              </Text>
            </View>
            <Text style={styles.miniCardLabel}>Ingreso hoy</Text>
          </View>
          <Text style={[styles.miniCardAmt, { color: COLORS.green }]}>
            ${totalIncome.toFixed(2)}
          </Text>
          <Text style={styles.miniCardSub}>Total ingresado</Text>
          <WaveDecoration color={`${COLORS.green}40`} />
        </View>

        <View style={[styles.miniCard, { borderColor: `${COLORS.pink}30` }]}>
          <View style={styles.miniCardHeader}>
            <View style={[styles.miniIcon, { backgroundColor: COLORS.pinkBg }]}>
              <Text
                style={{ color: COLORS.pink, fontSize: 16, fontWeight: "700" }}
              >
                ↓
              </Text>
            </View>
            <Text style={styles.miniCardLabel}>Gasto hoy</Text>
          </View>
          <Text style={[styles.miniCardAmt, { color: COLORS.pink }]}>
            ${totalExpense.toFixed(2)}
          </Text>
          <Text style={styles.miniCardSub}>Total gastado</Text>
          <WaveDecoration color={`${COLORS.pink}40`} />
        </View>
      </View>

      {/* Available card */}
      <View style={styles.availCard}>
        <View>
          <Text style={styles.availLabel}>Te quedan</Text>
          <Text
            style={[
              styles.availAmt,
              { color: available < 0 ? COLORS.red : COLORS.green },
            ]}
          >
            ${Math.abs(available).toFixed(2)}
            {available < 0 ? " (negativo)" : ""}
          </Text>
          <Text style={styles.availSub}>para el resto del día</Text>
        </View>
        <Text style={{ fontSize: 52 }}>💰</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Uso de tu ingreso diario</Text>
          <Text
            style={[
              styles.progressPct,
              {
                color:
                  pctUsed < 50
                    ? COLORS.green
                    : pctUsed < 80
                      ? COLORS.orange
                      : COLORS.red,
              },
            ]}
          >
            {pctUsed}%
          </Text>
        </View>
        <ProgressBar pct={pctUsed} />
        <Text style={styles.progressSub}>
          Has usado ${totalExpense.toFixed(2)} de ${totalIncome.toFixed(2)}
        </Text>
      </View>

      {/* Recent transactions */}
      <View style={styles.txSection}>
        <View style={styles.txSectionHeader}>
          <Text style={styles.sectionTitle}>Gastos recientes</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        {recent.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40 }}>💸</Text>
            <Text style={styles.emptyTitle}>Sin transacciones</Text>
            <Text style={styles.emptySubtitle}>
              Presiona + para agregar una
            </Text>
          </View>
        ) : (
          recent.map((tx) => <TransactionItem key={tx.id} tx={tx} />)
        )}
      </View>
    </ScrollView>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState("inicio");
  const [modalVisible, setModalVisible] = useState(false);
  const fabScale = useRef(new Animated.Value(1)).current;

  const handleSave = (tx: Omit<Transaction, "id">) => {
    const newTx: Transaction = { ...tx, id: Date.now().toString() };
    setTransactions((prev) => [...prev, newTx]);
    setModalVisible(false);
  };

  const pressFab = () => {
    Animated.sequence([
      Animated.spring(fabScale, {
        toValue: 0.88,
        useNativeDriver: true,
        tension: 200,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
      }),
    ]).start();
    setModalVisible(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "inicio":
        return <HomeScreen transactions={transactions} />;
      case "resumen":
        return <ResumenScreen transactions={transactions} />;
      case "metas":
        return <MetasScreen />;
      case "ajustes":
        return <AjustesScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.7}>
          <Text style={styles.headerIconText}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>¡Hola, Diego! 👋</Text>
          <Text style={styles.greetingSub}>
            Este es tu resumen financiero de hoy
          </Text>
        </View>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.7}>
          <Text style={styles.headerIconText}>🔔</Text>
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      {/* ── CONTENT ── */}
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* ── BOTTOM NAV ── */}
      <View style={styles.bottomNav}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          const isFab = false;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabBtn}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabEmoji, active && styles.tabEmojiActive]}>
                {tab.emoji}
              </Text>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {active && <View style={styles.tabDot} />}
            </TouchableOpacity>
          );
        })}

        {/* FAB in center */}
        <Animated.View
          style={[styles.fabWrap, { transform: [{ scale: fabScale }] }]}
        >
          <TouchableOpacity
            style={styles.fab}
            onPress={pressFab}
            activeOpacity={0.85}
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ── ADD MODAL ── */}
      <AddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerIconText: { fontSize: 20 },
  headerCenter: { flex: 1, alignItems: "center" },
  greeting: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  greetingSub: { color: COLORS.textMuted, fontSize: 11, marginTop: 1 },
  notifBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.pink,
    borderWidth: 1.5,
    borderColor: COLORS.bg,
  },

  // Home
  homeContent: { padding: 16, paddingBottom: 120 },

  // Status card
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  statusLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  statusMsg: { fontSize: 20, fontWeight: "900", marginBottom: 6 },
  statusSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 17,
    maxWidth: 180,
  },

  // Mini cards
  miniCardsRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  miniCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  miniCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  miniIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  miniCardLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: "600" },
  miniCardAmt: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  miniCardSub: { color: COLORS.textFaint, fontSize: 10, marginBottom: 12 },
  waveLine: {
    height: 0,
    borderTopWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 2,
    opacity: 0.6,
  },

  // Available card
  availCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  availLabel: { color: COLORS.textMuted, fontSize: 13, marginBottom: 4 },
  availAmt: { fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  availSub: { color: COLORS.textFaint, fontSize: 11, marginTop: 2 },

  // Progress card
  progressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabel: { color: COLORS.text, fontSize: 13, fontWeight: "600" },
  progressPct: { fontSize: 14, fontWeight: "800" },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 2,
  },
  progressFill: { height: "100%", borderRadius: 4 },
  progressSub: { color: COLORS.textFaint, fontSize: 11, marginTop: 6 },

  // Transactions
  txSection: { gap: 2 },
  txSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: "800" },
  verTodos: { color: COLORS.purple, fontSize: 13, fontWeight: "600" },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  txIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: { flex: 1, marginLeft: 12 },
  txCategory: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  txTime: { color: COLORS.textMuted, fontSize: 11 },
  txAmount: { fontSize: 15, fontWeight: "800" },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: { color: COLORS.textMuted, fontSize: 13 },

  // Tab content
  tabContent: { flex: 1, padding: 16 },

  // Summary
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  summaryRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  // Goals
  goalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  goalHeader: { flexDirection: "row", alignItems: "center" },
  goalName: { color: COLORS.text, fontSize: 14, fontWeight: "700" },
  goalPct: { fontSize: 22, fontWeight: "900" },

  // Settings
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  textFaint: { color: COLORS.textFaint, fontSize: 20 },

  // Bottom nav
  bottomNav: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingHorizontal: 4,
    position: "relative",
    alignItems: "flex-end",
  },
  tabBtn: { flex: 1, alignItems: "center", paddingBottom: 4 },
  tabEmoji: { fontSize: 20, opacity: 0.45 },
  tabEmojiActive: { opacity: 1 },
  tabLabel: {
    color: COLORS.textFaint,
    fontSize: 10,
    marginTop: 3,
    fontWeight: "600",
  },
  tabLabelActive: { color: COLORS.purple },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.purple,
    marginTop: 3,
  },
  fabWrap: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 14 : 6,
    left: "50%",
    marginLeft: -28,
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  fabIcon: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "400",
    lineHeight: 32,
    marginTop: -2,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.surface2,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textFaint,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
  },
  typeToggle: { flexDirection: "row", gap: 10, marginBottom: 20 },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  typeBtnActivePink: {
    backgroundColor: COLORS.pinkBg,
    borderColor: COLORS.pink,
  },
  typeBtnActiveGreen: {
    backgroundColor: COLORS.greenBg,
    borderColor: COLORS.green,
  },
  typeBtnText: { color: COLORS.textMuted, fontSize: 14, fontWeight: "700" },
  inputLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  currencySign: {
    color: COLORS.textMuted,
    fontSize: 22,
    fontWeight: "600",
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "800",
    paddingVertical: 12,
  },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  catChipText: { color: COLORS.textMuted, fontSize: 12, fontWeight: "600" },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  saveBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
