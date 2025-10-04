import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const API_URL = "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"; // replace with your API endpoint

export default function HomeTest() {
  const [db, setDb] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // ⏳ Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      filterMenu(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Step 1: open DB once
  useEffect(() => {
    const initDB = async () => {
      const database = await SQLite.openDatabaseAsync("menu.db");
      setDb(database);
    };
    initDB();
  }, []);

  // Step 2: fetch data when DB is ready
  useEffect(() => {
    if (!db) return;
    initializeData();
  }, [db]);

  // Fetch from API → save to SQLite → read
  const initializeData = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS menuitem (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          description TEXT,
          image TEXT,
          category TEXT
        );
      `);

      const existing = await db.getAllAsync("SELECT * FROM menuitem");
      if (existing.length === 0) {
        // Fetch from API
        const response = await fetch(API_URL);
        const json = await response.json();
        const menuData = json.menu;

        // Clear old data before inserting new
        await db.execAsync("DELETE FROM menuitem;");

        for (const item of menuData) {
          await db.runAsync(
            "INSERT INTO menuitem (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)",
            [item.name, item.price, item.description, item.image, item.category]
          );
        }
      }

      const items = await db.getAllAsync("SELECT * FROM menuitem");
      setMenuItems(items);

      const uniqueCats = [...new Set(items.map((i) => i.category))];
      setCategories(uniqueCats);

      if (uniqueCats.length > 0) {
        const defaultCategory = uniqueCats[0];
        setSelectedCategory(defaultCategory);

        // Filter data for the default category
        const filtered = items.filter((item) => item.category === defaultCategory);
        setMenuItems(filtered);

        console.log("defaultCategory :", defaultCategory);
        console.log("filtered :", filtered);
      }
     
      setLoading(false);

    } catch (error) {
      console.error("DB Error:", error);
    }
  };
 
  const filterMenu = async (query) => {
    if (!db) return;

    if (!db) {
      console.error("Database is not initialized. Please try again later.");
      return;
    }
    let sql = "SELECT * FROM menuitem";
    let params = [];

    if (selectedCategory) {
      sql += " WHERE category = ?";
      params.push(selectedCategory);
    }

    if (query.trim() !== "") {
      sql += selectedCategory ? " AND" : " WHERE";
      sql += " name LIKE ?";
      params.push(`%${query}%`);
    }

    const result = await db.getAllAsync(sql, params);
    setMenuItems(result);
  };

  const onCategoryChange = async (cat) => {
    setSelectedCategory(cat);
    const result = await db.getAllAsync("SELECT * FROM menuitem WHERE category = ?", [cat]);
    setMenuItems(result);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#333" />
        <Text>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔍 Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search menu..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 🏷️ Category Tabs */}
      <View style={styles.tabContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, selectedCategory === cat && styles.activeTab]}
            onPress={() => onCategoryChange(cat)}
          >
            <Text
              style={[styles.tabText, selectedCategory === cat && styles.activeTabText]}
            >
              {cat.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🍴 Menu List */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.desc}  numberOfLines={2} ellipsizeMode="tail">
                {item.description}</Text>
             <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.cardImage}>
              <Image
                source={{ uri: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true'.replace('${imageFileName}', item.image) }}
                style={{ width: 100, height: 100, borderRadius: 10, backgroundColor: "#bab6b6ff" }}
              />
            </View>
            
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 40,
  },
  tabContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#e6e6e6",
  },
  activeTab: { backgroundColor: "#333" },
  tabText: { color: "#333", fontWeight: "bold" },
  activeTabText: { color: "#fff" },
  card: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

  },
  cardContent: {
    flex: 0.7,
    paddingRight: 10,
  },
  cardImage: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: { fontSize: 18, fontWeight: "bold" },
  price: { color: "green", fontWeight: "600" ,paddingTop:5},
  desc: { color: "#555", marginTop: 4 },
});
