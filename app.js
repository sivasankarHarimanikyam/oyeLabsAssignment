const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./customerDetails.db");
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

function isEmail(email) {
  var emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }

  return false;
}
// Add Customer API
app.post("/add-customer", async (req, res) => {
  const { name, email } = req.body;
  console.log(isEmail(email));
  // validation check for req body of name or email
  if (name?.length < 4 || !isEmail(email)) {
    return res
      .status(400)
      .json({ message: "Please provide name or valid email " });
  }
  // Check for duplicate email
  try {
    db.get(
      `SELECT COUNT(*) as count FROM customers WHERE email = '${email}'`,
      (err, row) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to retrieve data with email" });
        } else {
          if (row.count > 0) {
            return res.status(400).json({ message: "Email already exists" });
          } else {
            console.log("adding customer..");
            // Open a transaction connection
            db.run("BEGIN TRANSACTION", () => {
              const insertQuery = db.prepare(
                `INSERT INTO customers(name,email) values (?,?)`
              );
              insertQuery.run(name, email, function (err) {
                if (err) {
                  // Rollback the transaction on error
                  db.run("ROLLBACK");
                  return res
                    .status(500)
                    .json({ error: "Failed to add customer" });
                } else {
                  // Commit the transaction on success
                  db.run("COMMIT");
                  res.json({ success: "Customer added successfully" });
                }
              });
              insertQuery.finalize();
            });
          }
        }
      }
    );
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ message: "Internal server error! Please try again later" });
  }
});

// Login API
app.post("/login", async (request, response) => {
  const { mobile, password } = request.body;

  if (!password || !mobile) {
    return response.status(400).json({
      message: "Please provide password and mobile",
    });
  }

  const selectUserQuery = `SELECT * FROM users WHERE mobile = '${mobile}'`;
  // checking user
  db.get(selectUserQuery, async (err, row) => {
    if (row === undefined) {
      // Error with invalid user
      response.status(400);
      response.send("Invalid User");
    } else {
      //comparing password
      const isPasswordMatched = await bcrypt.compare(password, row.password);
      if (isPasswordMatched === true) {
        response.status(200).json({ message: "Login Success!" });
      } else {
        response.status(400).json({ message: "Invalid Password" });
      }
    }
  });
});

app.post("/register", async (req, res) => {
  const { name, password, mobile } = req.body;
  console.log(req.body);
  if (name?.length < 4 || password?.length < 4 || mobile?.length != 10) {
    return res.status(400).json({
      message:
        "Please provide mobile 10 digits and name with minimum 5 characters,password with minimum 5 characters",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM users WHERE mobile = '${mobile}'`;
  db.get(selectUserQuery, (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Error please try again later" });
    } else {
      if (row === undefined) {
        try {
          const createUserQuery = `
        INSERT INTO 
        users ( name, password, mobile) 
        VALUES 
        (
            '${name}',
            '${hashedPassword}', 
            '${mobile}'
        )`;
          db.run(createUserQuery, (err) => {
            if (err) {
              return res.status(500).json({
                message: "Error please try again later",
              });
            } else {
              //   const newUserId = row.lastID;
              res.status(200).json({ message: `Created new user` });
            }
          });
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Internal Error! Please try again later" });
        }
      } else {
        return res.status(400).json({ message: "User already exists" });
      }
    }
  });
});
