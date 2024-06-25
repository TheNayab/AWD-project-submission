// // const mysql = require("mysql");
// // require("dotenv").config();
// // // const connection = () => {
// // const db = mysql.createConnection({
// //   host: process.env.host,
// //   user: process.env.user,
// //   password: process.env.pass,
// //   database: process.env.dbname,
// // });

// // db.connect(function (err) {
// //   if (err) throw err;
// //   console.log("Connected to DB!");
// // });
// // // };

// // module.exports = db;

// const mysql = require("mysql");
// require("dotenv").config();

// // Create a connection for the ai-bots database
// const db = mysql.createConnection({
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.pass,
//   database: process.env.dbname,
// });

// db.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected to Omni-Channel DB!");
// });

// // Create a connection for the omni-channel database
// const aiBotsDB = mysql.createConnection({
//   host: process.env.aiBotsHost,
//   user: process.env.aiBotsUser,
//   password: process.env.aiBotsPass,
//   database: process.env.aiBotsDBName,
// });

// aiBotsDB.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected to AI Bots DB!");
// });

// module.exports = { db, aiBotsDB };

const mysql = require("mysql2");
require("dotenv").config();

// Create a connection for the main database
// const db = mysql.createConnection({
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.pass,
//   database: process.env.dbname
// });

// db.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected to Omni-Channel DB!");
// });

// Create a connection for the AI bots database
const aiBotsDB = mysql.createConnection({
  host: process.env.aiBotsHost,
  user: process.env.aiBotsUser,
  password: process.env.aiBotsPass,
  database: process.env.aiBotsDBName,
});

aiBotsDB.connect(function (err) {
  if (err) throw err;
  console.log("Connected to AI Bots DB!");
});

module.exports = {  aiBotsDB };
