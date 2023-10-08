const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3001; // Change the port to 3001

app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Replace with your MySQL host
  user: 'root', // Replace with your MySQL username
  password: 'dj25082001', // Replace with your MySQL password
  database: 'node-complete', // Replace with the name of your MySQL database
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error('Error retrieving users:', err);
      return res.status(500).json({ message: 'Error retrieving users.', error: err });
    }

    res.status(200).json(results);
  });
});


// Define your API route to insert user data into the database
app.post('/api/users', (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required fields.' });
  }

  const newUser = {
    name,
    email,
    phone,
  };

  db.query('INSERT INTO user SET ?', newUser, (err, result) => { // Use 'users' instead of 'Users'
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Error inserting user.' });
    }

    newUser.id = result.insertId;
    res.status(201).json(newUser);
  });
});


// Define your DELETE API route to delete a user by ID
app.delete('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  // Perform a DELETE query in the database to delete the user by ID
  db.query('DELETE FROM user WHERE id = ?', userId, (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Error deleting user.', error: err });
    }

    if (result.affectedRows === 0) {
      // No user with the specified ID was found
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
