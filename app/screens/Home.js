import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList, Image, StyleSheet, Text,
  TextInput, TouchableOpacity,
  View
} from "react-native";

import * as SQLite from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/customComponent/Header";
import { default as Colors, default as colors } from '../../constants/colors';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu.json';
// Open SQLite database




export default function Home({ navigation }) {

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

  // Clear search when screen gains focus
  useFocusEffect(
    useCallback(() => {
      setSearchQuery("");
    }, [])
  );

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
    <SafeAreaView style={styles.container}>
      <Header onBackPress={false} showProfileImage={true}></Header>

      <View style={styles.heroView}>
        <Text style={styles.heading}> Littile Lemon </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ width: "60%" }}>
            <Text style={styles.subHeading}> Chicago </Text>
            <Text style={styles.paraText} numberOfLines={5} ellipsizeMode="tail">
              We are family owned Mediterranean restaurant, focused on traditional
              recipes served with a modern twist.
            </Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require("../../assets/images/hero.png")}
          />
        </View>
       
        <View style={styles.searchView}>
          <TouchableOpacity
            onPress={() => {filterMenu(searchQuery);}}
            style={styles.searchButton}>
            <Ionicons name="search" size={25} color={Colors.dark_gray} />
          </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search here..."
              placeholderTextColor={Colors.white}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />  
        </View>
      </View>
      <View style={styles.MenuListView}>
        <Text style={{fontSize:18, fontWeight:'bold', color:colors.black, 
        alignSelf:'flex-start',padding:10}}>ORDER FOR DELIVERY!</Text>
      <View style={styles.menuContainer}>
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
      {/* Menu Items */}
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
      </View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
   
    backgroundColor: Colors.bg_color,
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  heroView: {
    flex: 0.6,
    width: "100%",
    padding: 20,
    backgroundColor: Colors.primary1,
  },
  heading:{
    fontSize: 42,
     marginLeft:-7,
    color: Colors.primary2_yellow,
    fontWeight: "bold",
    fontFamily: "Karla", // Apply Karla font
  },
  subHeading:{
    fontSize: 30,
    color: Colors.white,
    marginLeft:-7
  },
  paraText:{
    color: Colors.white,
    width: "100%",
     fontSize: 18,
      marginTop: 10 
  },
  heroImage:{
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  MenuListView :{
    flex: 1, 
    justifyContent: "center",
    alignItems: "center"
  },
  orderText:{
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.black
  },
   searchBar: {
    marginBottom: 24,
    backgroundColor: '#495E57',
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  searchView:{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width: "100%"
  },
  searchButton:{
    marginRight: 10 ,
    padding: 8, 
    backgroundColor: Colors.white, 
    borderRadius: 25
  },searchInput:{
        flex: 1,
        height: 40,
        borderColor: Colors.white,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: Colors.white,
  },

  menuContainer: { flex: 1,width:'100%', padding: 10 },
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

})