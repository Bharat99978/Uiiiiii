const mysql = require('mysql');
const crypto = require('crypto');

// Database connection details
const connection = mysql.createConnection({
  host: 'mnz.domcloud.co',
  user: 'imaginary-promotion-waw',
  password: 'Cs7E_NMY9urp_v19(7',
  database: 'imaginary_promotion_waw_db'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

// Function to generate random username and password
function generateRandomString(length = 8) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

// Function to insert users in bulk
function insertBatchUsers(batchSize = 50000) {
  const users = [];

  // Generate 50,000 users in a single batch
  for (let i = 0; i < batchSize; i++) {
    const user = generateRandomString();
    const pass = generateRandomString();
    const hashedPassword = crypto.createHash('sha256').update(pass).digest('hex');
    users.push([user, hashedPassword]);
  }

  const query = 'INSERT INTO users (username, password) VALUES ?';
  connection.query(query, [users], (err) => {
    if (err) {
      console.error('Error inserting batch:', err);
    }
  });
}

// Continuous insertion every second
async function main() {
  while (true) {
    const startTime = Date.now();
    insertBatchUsers(50000); // Insert 50,000 users every second
    console.log('Inserted 50,000 users.');

    // Wait until 1 second has passed before inserting again
    await new Promise(resolve => setTimeout(resolve, 1000 - (Date.now() - startTime))); // Ensure the loop runs every second
  }
}

// Start inserting users continuously
main();