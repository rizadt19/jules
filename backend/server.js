const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import cors

const movies = require('./data/movies.json');
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const watchHistoryFilePath = path.join(__dirname, 'data', 'watchHistory.json');

const app = express();
const port = 3001;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a strong secret in a real application

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Helper function to read users from users.json
const readUsers = () => {
  const usersData = fs.readFileSync(usersFilePath);
  return JSON.parse(usersData);
};

// Helper function to write users to users.json
const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Helper function to read watch history from watchHistory.json
const readWatchHistory = () => {
  const watchHistoryData = fs.readFileSync(watchHistoryFilePath);
  return JSON.parse(watchHistoryData);
};

// Helper function to write watch history to watchHistory.json
const writeWatchHistory = (watchHistory) => {
  fs.writeFileSync(watchHistoryFilePath, JSON.stringify(watchHistory, null, 2));
};

// API endpoint for user registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readUsers();
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, email, passwordHash: hashedPassword };
    users.push(newUser);
    writeUsers(users);

    // Optionally, return a JWT token upon registration
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// API endpoint for user login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readUsers();
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

// API endpoint for user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const watchHistory = readWatchHistory();
    const userWatchHistory = watchHistory[req.user.userId] || [];

    res.json({
      email: user.email,
      // name: user.name || user.email.split('@')[0], // Assuming name can be derived or added
      watchHistory: userWatchHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// API endpoint for user watch history
app.post('/api/user/watch-history', authenticateToken, (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    const watchHistory = readWatchHistory();
    if (!watchHistory[req.user.userId]) {
      watchHistory[req.user.userId] = [];
    }

    // Avoid duplicate movieId
    if (!watchHistory[req.user.userId].includes(movieId)) {
      watchHistory[req.user.userId].push(movieId);
      writeWatchHistory(watchHistory);
    }

    res.status(200).json({ message: 'Watch history updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.get('/api/movies', (req, res) => {
  res.json(movies);
});

app.get('/api/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find(m => m.id === movieId);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Movie not found');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
