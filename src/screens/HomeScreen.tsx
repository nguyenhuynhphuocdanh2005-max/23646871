import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENT, VARIANT, examStamp, BANNER_IMAGE_ID, FLASH_SECONDS } from '@constants/student';
import { COLORS, SIZES } from '@constants/theme';
import { Typography } from '@components/ui/Typography';
import { ShopInput } from '@components/ui/ShopInput';
import { ShopButton } from '@components/ui/ShopButton';
import { fetchProducts, Product, CategoryId } from '@services/productApi';
import { useCountdown } from '@hooks/useCountdown';

// Mảng được tính toán đảo thứ tự
const CATEGORIES = VARIANT.chipsReversed
  ? [
      { id: 'study', name: 'Học tập' },
      { id: 'drink', name: 'Nước' },
      { id: 'food', name: 'Đồ ăn' },
      { id: 'all', name: 'Tất cả' },
    ]
  : [
      { id: 'all', name: 'Tất cả' },
      { id: 'food', name: 'Đồ ăn' },
      { id: 'drink', name: 'Nước' },
      { id: 'study', name: 'Học tập' },
    ];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const flashTime = useCountdown(FLASH_SECONDS);

  const loadData = async () => {
    let isAlive = true;
    setLoading(true);
    setError(false);
    try {
      const data = await fetchProducts();
      if (isAlive) setProducts(data);
    } catch (e) {
      if (isAlive) setError(true);
    } finally {
      if (isAlive) setLoading(false);
    }
    return () => { isAlive = false; };
  };

  useEffect(() => {
    const cleanup = loadData();
    return () => { cleanup.then(fn => fn()); };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  const renderItem = useCallback(({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImg} resizeMode="contain" />
      <View style={styles.cardInfo}>
        <Typography variant="body1" style={styles.cardTitle} numberOfLines={1}>{item.title}</Typography>
        <Typography variant="body1" color={COLORS.primary} style={styles.cardPrice}>
          {item.price.toLocaleString('vi-VN')} đ
        </Typography>
        <Typography variant="body2" color={COLORS.textLight}>
          {item.category === 'food' ? 'Đồ ăn' : item.category === 'drink' ? 'Nước' : 'Học tập'}
        </Typography>
      </View>
      <ShopButton title="Đặt" onPress={() => {}} style={styles.btnDat} />
    </View>
  ), []);

  const watermark = (
    <View style={styles.watermark}>
      <Typography variant="body2" color={COLORS.primary}>
        TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
      </Typography>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Typography variant="h1" color={COLORS.primary}>CAMPUSMART</Typography>
          <Pressable style={styles.themeBtn}>
            <Typography variant="body2" color={COLORS.primary}>Sáng / Tối</Typography>
          </Pressable>
        </View>
        <Typography variant="body2" color={COLORS.textLight}>
          Tiện lợi KTX · <Typography variant="body2" color={COLORS.secondary}>Flash {flashTime}</Typography>
        </Typography>
      </View>

      <View style={styles.searchWrap}>
        <ShopInput
          placeholder={`Tìm món, nước, đồ dùng — ${STUDENT.mssv}`}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.bannerWrap}>
        <Image source={{ uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/320` }} style={styles.bannerImg} resizeMode="cover" />
        <View style={styles.bannerOverlay}>
          <Typography variant="h2" color={COLORS.surface}>Đặt nhanh · Nhận tại quầy</Typography>
          <Typography variant="body2" color={COLORS.surface}>Cửa hàng tiện lợi ký túc xá 24/7</Typography>
        </View>
      </View>

      <View style={styles.chipsRow}>
        {CATEGORIES.map(c => {
          const isActive = activeCategory === c.id;
          return (
            <Pressable
              key={c.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setActiveCategory(c.id as CategoryId)}
            >
              <Typography variant="body2" color={isActive ? COLORS.surface : COLORS.primary}>
                {c.name}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Typography variant="body1" style={{marginTop: 10}}>Đang tải món...</Typography>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Typography variant="body1" color={COLORS.error}>{STUDENT.mssv}</Typography>
            <Typography variant="body1">Không tải được dữ liệu món.</Typography>
            <ShopButton title="Thử lại" onPress={() => { loadData(); }} style={{marginTop: 10}} />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
            renderItem={renderItem}
            ListEmptyComponent={<Typography variant="body1" style={{textAlign: 'center', marginTop: 20}}>Không có món phù hợp</Typography>}
            contentContainerStyle={{paddingBottom: 20}}
          />
        )}
      </View>

      {/* Dòng tên ép xuống dưới */}
      {!VARIANT.watermarkAtTop && watermark}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  watermark: { padding: SIZES.padding, alignItems: 'center', backgroundColor: COLORS.border },
  header: { paddingHorizontal: SIZES.padding, paddingTop: SIZES.padding, paddingBottom: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  themeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 20 },
  searchWrap: { paddingHorizontal: SIZES.padding },
  bannerWrap: { height: 120, marginHorizontal: SIZES.padding, borderRadius: SIZES.radius, overflow: 'hidden', marginBottom: 15 },
  bannerImg: { width: '100%', height: '100%' },
  bannerOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(15, 118, 110, 0.7)', justifyContent: 'center', alignItems: 'center' },
  chipsRow: { flexDirection: 'row', paddingHorizontal: SIZES.padding, marginBottom: 15, justifyContent: 'space-between' },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.surface },
  chipActive: { backgroundColor: COLORS.primary },
  listContainer: { flex: 1, paddingHorizontal: SIZES.padding },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, padding: 12, borderRadius: SIZES.radius, marginBottom: 12, alignItems: 'center', elevation: 2 },
  cardImg: { width: 70, height: 70, borderRadius: SIZES.radius, backgroundColor: '#f0f0f0' },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardTitle: { fontWeight: 'bold' },
  cardPrice: { fontWeight: 'bold', marginVertical: 4 },
  btnDat: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
});
