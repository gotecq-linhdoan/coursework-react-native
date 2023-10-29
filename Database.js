import * as SQLite from "expo-sqlite";

const database_name = "HikeApp.db";
const database_version = "3.0";
const database_displayname = "Hike App Database";
const database_size = 200000;

const db = SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size
);

const initDatabase = () => {
    db.transaction((tx) => {
        // Create the Hike table with the "image_uri" field
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS hike (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                location TEXT,
                date TEXT,
                level TEXT,
                length TEXT,
                parking INTEGER,
                image_uri TEXT
            );`,
            [],
            () => console.log("Hike table created successfully."),
            (error) => console.log("Error occurred while creating the Hike table.", error)
        );
    });
};

const clearDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "DROP TABLE IF EXISTS hike",
            [],
            () => {
                // The table is dropped, now recreate it with the new schema
                initDatabase();
            },
            (error) => console.log("Error occurred while dropping the hike table.", error)
        );
    });
};


const addHike = (name, description, location, date, level, length, parking, image_uri) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO hike (name, description, location, date, level, length, parking, image_uri) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [name, description, location, date, level, length, parking, image_uri],
                (_, { insertId }) => {
                    resolve(insertId);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

const updateHike = (id, name, description, location, date, level, length, parking, image_uri) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE hike SET name = ?, description = ?, location = ?, date = ?, level = ?, length = ?, parking = ?, image_uri = ? WHERE id = ?",
                [name, description, location, date, level, length, parking, image_uri, id],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve(true);
                    } else {
                        reject("Hike not found.");
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

const deleteHike = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM hike WHERE id = ?",
                [id],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve(true);
                    } else {
                        reject("Hike not found.");
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

const getHikes = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM hike",
                [],
                (_, { rows }) => {
                    resolve(rows._array);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

const deleteAllHikes = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM hike",
                [],
                () => {
                    resolve();
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};


const Database = {
    initDatabase,
    clearDatabase,
    addHike,
    updateHike,
    deleteHike,
    getHikes,
    deleteAllHikes
};

export default Database;
