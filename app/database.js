import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
  try {
    console.log("Creating table if not exists");
    db.exec(
      'CREATE TABLE IF NOT EXISTS menuitems (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, image TEXT, category TEXT);'
    );
    console.log("Table created successfully");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

export async function getMenuItems() {
  try{
    console.log("Fetching menu items from database");
     return new Promise((resolve) => {
        db.getAllAsync("SELECT * FROM menuitems");
  });
  }
  catch(error){
    console.error("Error fetching menu items:", error);
  }
 
}


export function saveMenuItems(json) 
{
   if (!json || json.length === 0) return;
try{
   // Clear old data
 // db.execAsync("DELETE FROM menuitems;");
    // Insert new data
  db.runAsync(
          "INSERT INTO menuitems (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)",
          [item.name, item.price, item.description, item.image, item.category]
        );

    console.log("✅ Data saved to SQLite");
} catch (error) {
      console.error("❌ Error fetching data:", error);
  }
   
}

/**
 * 4. Implement a transaction that executes a SQL statement to filter the menu by 2 criteria:
 * a query string and a list of categories.
 *
 * The query string should be matched against the menu item titles to see if it's a substring.
 * For example, if there are 4 items in the database with titles: 'pizza, 'pasta', 'french fries' and 'salad'
 * the query 'a' should return 'pizza' 'pasta' and 'salad', but not 'french fries'
 * since the latter does not contain any 'a' substring anywhere in the sequence of characters.
 *
 * The activeCategories parameter represents an array of selected 'categories' from the filter component
 * All results should belong to an active category to be retrieved.
 * For instance, if 'pizza' and 'pasta' belong to the 'Main Dishes' category and 'french fries' and 'salad' to the 'Sides' category,
 * a value of ['Main Dishes'] for active categories should return  only'pizza' and 'pasta'
 *
 * Finally, the SQL statement must support filtering by both criteria at the same time.
 * That means if the query is 'a' and the active category 'Main Dishes', the SQL statement should return only 'pizza' and 'pasta'
 * 'french fries' is excluded because it's part of a different category and 'salad' is excluded due to the same reason,
 * even though the query 'a' it's a substring of 'salad', so the combination of the two filters should be linked with the AND keyword
 *
 */
export async function filterByQueryAndCategories(query, categories) {
 return new Promise((resolve, reject) => {
    const placeholders = categories.map(() => '?').join(',');
    const sqlQuery = `SELECT * FROM menuitems WHERE category IN (${placeholders}) AND title LIKE ?;`;
    const params = [...categories, `%${query}%`];

    db.transaction((tx) => {
      tx.executeSql(
        sqlQuery,
        params,
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
}
