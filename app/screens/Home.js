import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList, Image, StyleSheet, Text,
  TextInput, TouchableOpacity,
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/customComponent/Header";
import Colors from '../../constants/colors';

import {
  createTable,
  getMenuItems,
  saveMenuItems
} from '../database';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu.json';
// Open SQLite database

export default function Home({ navigation }) {
  const [searchVisible, setSearchVisible] = useState(false);

  const [menuData, setMenuData] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("starters");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async() => {
     try {
        const response = await fetch(API_URL); 
        const data = await response.json();

        console.log("Fetched menu data:----------------", data);
        // Transform data to match DB schema
        const transformedMenu = data.menu.map(item => ({
          name: item.name,  
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category
        }));

        console.log("Menu list==========",transformedMenu);
        // Save to DB
        saveMenuItems(transformedMenu);

        return transformedMenu; // return transformed data
      
      } catch (error) {
        console.error('Error fetching menu:', error);
      } 
       return [];
  }
// Initial load
  useEffect(() => {
    (async () => {
      await createTable();
      await fetchData();
      let menuItems =await getMenuItems();
      setMenuData(menuItems);

      setLoading(false);
    })();
  }, []);

// useEffect(() => {
//     (async () => {
//       try {
//         await createTable();
//         let menuItems = await getMenuItems();

//         if (!menuItems.length) {
//           menuItems = await fetchData();
//         }
//          setMenuData(menuItems);
//       } catch (e) {
//         Alert.alert(e.message);
//       }
//     })();
//   }, []);

   // Filter logic
  const applyFilters = (category, query) => {
    let filtered = menuData.filter((item) => item.category === category);

    if (query.trim().length > 0) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredMenu(filtered);
  };
    
useEffect(() => {
    applyFilters(selectedCategory, searchQuery);
  }, [menuData, selectedCategory, searchQuery]);

  const categories = [...new Set(menuData.map((item) => item.category))];

  

    if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading menu...</Text>
      </View>
    );
  }
  

// const lookup = useCallback((q) => {
//     setSearchQuery(q);
//   }, []);

//   const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);
  
//   const handleSearchChange = (text) => {
//     setSearchBarText(text);
//     debouncedLookup(text);
//   };

  // useEffect(() => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, image TEXT, category TEXT);'
  //     );
  //   });

  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'SELECT * FROM menu;',
  //       [],
  //       (_, { rows }) => {
  //         if (rows.length > 0) {
  //           const menuItems = [];
  //           for (let i = 0; i < rows.length; i++) {
  //             menuItems.push(rows.item(i));
  //           }
  //           setData(menuItems);
  //         } else {
  //           fetch(API_URL)
  //             .then(response => response.json())
  //             .then(json => {
  //               setData(json.menu);
  //               db.transaction(tx => {
  //                 json.menu.forEach(item => {
  //                   tx.executeSql(
  //                     'INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?,?);',
  //                     [item.name, item.description, item.price, item.image,item.category]
  //                   );
  //                 });
  //               });
  //             })
  //             .catch(error => console.error(error));
  //         }
  //       },
  //       error => console.error(error)
  //     );
  //   });
  // }, [db]);
  


  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={false} showProfileImage={false}></Header>

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
         {/* <Searchbar
        placeholder="Search"
        placeholderTextColor="white"
        onChangeText={handleSearchChange}
        value={searchBarText}
        style={styles.searchBar}
        iconColor="white"
        inputStyle={{ color: 'white' }}
        elevation={0}
      /> */}
        <View style={styles.searchView}>
          <TouchableOpacity
            onPress={() => setSearchVisible(!searchVisible)}
            style={styles.searchButton}>
            <Ionicons name="search" size={25} color={Colors.dark_gray} />
          </TouchableOpacity>
          {searchVisible && (
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={Colors.white}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          )}
        </View>
      </View>
      <View style={styles.MenuListView}>
        <Text>ORDER FOR DELIVERY!</Text>
       {/* <FlatList
          data={menuData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        /> */}
        
      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.tab,
              selectedCategory === category && styles.activeTab,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === category && styles.activeTabText,
              ]}
            >
              {category.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Menu Items */}
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: `https://via.placeholder.com/100x80.png?text=${item.name.replace(
                  " ",
                  "+"
                )}`,
              }}
              style={styles.image}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items found.</Text>
        }
      />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.bg_color,
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  heroView: {
    flex: 1,
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
  
  tabsContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
  },
  activeTab: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  tabText: { color: "#555", fontWeight: "600" },
  activeTabText: { color: "#fff" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: { width: 100, height: 80, borderRadius: 8, marginRight: 12 },
  name: { fontSize: 18, fontWeight: "700" },
  description: { color: "#666", fontSize: 13, marginVertical: 4 },
  price: { fontWeight: "600", color: "#4CAF50" },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
    fontSize: 16,
  },

})