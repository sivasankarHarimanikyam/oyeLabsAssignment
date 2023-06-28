const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
let db = null;

const dbPath = path.join(__dirname, "customersDatabase.db");

const customers = [
  {
    email: "anurag11@yopmail.com",
    name: "anurag",
  },
  {
    email: "sameer11@yopmail.com",
    name: "sameer",
  },
  {
    email: "ravi11@yopmail.com",
    name: "ravi",
  },
  {
    email: "akash11@yopmail.com",
    name: "akash",
  },
  {
    email: "anjali11@yopmail.com",
    name: "anjali",
  },
  {
    email: "santosh11@yopmail.com",
    name: "santosh",
  },
];

const initialDbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Database Connected successfully");
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initialDbServer();

async function insertCustomers() {
  customers.forEach(async (customer) => {
    try {
      const getSqlQuery = `select * from customers where email = '${customer.email}'`;
      const result = await db.get(getSqlQuery);
      if (result) {
        const updateSqlQuery = `UPDATE customers SET name ='${customer.name}' where email = '${existingCus.email}' `;
        await db.run(updateSqlQuery);
      } else {
        const insertSqlQuery = `INSERT INTO customers (name,email) values ('${customer.name}','${customer.email}') `;
        await db.run(insertSqlQuery);
      }
    } catch (error) {
      console.log({ error });
    }
  });
}
insertCustomers();
