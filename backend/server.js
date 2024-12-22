const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile_photos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Sample data for messages
let messages = [
  {
    id: 1,
    content: "Hello there! 👋 Have a wonderful day!",
    category: "greetings",
    likes: 42,
    user: {
      username: "HappyUser123",
      profilePhoto: null
    },
    createdAt: "2024-01-01T10:00:00Z"
  },
  {
    id: 2,
    content: "Why don't scientists trust atoms? Because they make up everything! 😄",
    category: "jokes",
    likes: 28,
    user: {
      username: "JokeMaster",
      profilePhoto: null
    },
    createdAt: "2024-01-02T15:30:00Z"
  },
  {
    id: 3,
    content: "Believe you can and you're halfway there! ✨",
    category: "motivational",
    likes: 56,
    user: {
      username: "Motivator",
      profilePhoto: null
    },
    createdAt: "2024-01-03T08:45:00Z"
  },
  {
    id: 4,
    content: "Love is the master key that opens the gates of happiness! ❤️",
    category: "love",
    likes: 75,
    user: {
      username: "LoveGuru",
      profilePhoto: null
    },
    createdAt: "2024-01-04T12:00:00Z"
  }
];

// Predefined messages for random generation
const predefinedMessages = {
  greetings: [
    "Hi there! Hope you're having a fantastic day! 🌟",
    "Greetings and salutations! 👋",
    "Hey! Wishing you a wonderful time! ✨",
    "Hello! May your day be filled with joy! 🌈",
    "What's up? Have a fantastic day ahead! 🌞",
    "Hey there! Wishing you a day as bright as your smile! 💫",
    "Hello! May today bring you happiness and success! 🎉",
    "Hi! Sending you positive vibes for a great day! 🌱",
    "Good morning! May today be the start of something amazing! ☀️",
    "Hey! Wishing you a day filled with laughter and adventure! 🎉",
    "Hello! May your day be as sweet as you are! 🍰",
    "Hi! Sending you love and positivity for a fantastic day! ❤️",
    "Good morning! May today bring you peace and happiness! 🌸",
    "Hey! Wishing you a day that's as bright as your future! 🌟",
    "Hello! May today be the start of a new chapter in your life! 📚",
    "Hi! Sending you warm wishes for a wonderful day! 🌞",
    "Good morning! May today bring you joy and fulfillment! 🌈",
    "Hey! Wishing you a day filled with excitement and wonder! 🎉",
    "Hello! May today be a day to remember! 📸",
    "Hi! Sending you sunshine and smiles for a great day! ☀️",
    "Good morning! May today bring you strength and courage! 💪",
    "Hey! Wishing you a day that's as unique as you are! 🌈"
  ],
  jokes: [
    "What did the coffee report to the police? A mugging! ☕",
    "Why don't eggs tell jokes? They'd crack up! 🥚",
    "What do you call a bear with no teeth? A gummy bear! 🐻",
    "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
    "Why did the bicycle fall over? Because it was two-tired! 🚴",
    "What do you call a group of cows playing instruments? A moo-sical band! 🐮",
    "Why did the banana go to the doctor? He wasn't peeling well! 🍌",
    "Why did the astronaut break up with his girlfriend? Because he needed space! 🚀",
    "What do you call a can opener that doesn't work? A can't opener! 🍲",
    "Why did the computer go to the doctor? It had a virus! 💻",
    "Why did the mushroom go to the party? Because he was a fun-gi! 🍄",
    "Why did the pencil break up with the eraser? It was a sharp move! ✏️",
    "What do you call a fish with a sunburn? A star-fish! 🐟",
    "Why did the rabbit go to the doctor? To get some hare care! 🐰",
    "Why did the computer screen go to therapy? It was feeling a little glitchy! 🖥️",
    "Why did the baker go to the bank? He needed dough! 🍞",
    "Why did the turkey join the band? He was a drumstick! 🦃",
    "What do you call a group of chickens playing instruments? A fowl band! 🐓",
    "Why did the orange stop in the middle of the road? Because it ran out of juice! 🍊",
    "Why did the chicken cross the playground? To get to the other slide! 🐓"
  ],
  motivational: [
    "Every day is a new beginning! 🌅",
    "You are capable of amazing things! ⭐",
    "Your potential is limitless! 🚀",
    "Make today amazing! 💫",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. 🌈",
    "The future belongs to those who believe in the beauty of their dreams. 💭",
    "You don't have to be great to start, but you have to start to be great. 🚀",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. 💪",
    "Don't watch the clock; do what it does. Keep going. 🕰️",
    "You are never too old to set another goal or to dream a new dream. 🌟",
    "The only way to do great work is to love what you do. ❤️",
    "Keep your eyes on the stars, and your feet on the ground. 🌠",
    "You miss 100% of the shots you don't take. 🏒️",
    "I have not failed. I've just found 10,000 ways that won't work. 💡",
    "You are stronger than you seem, braver than you believe, and smarter than you think. 💪",
    "Do something today that your future self will thank you for. 🙏",
    "Happiness can be found even in the darkest of times if one only remembers to turn on the light. 💡",
    "You don't have to control your thoughts. You just have to stop letting them control you. 🙏",
    "The best is yet to come. 🌈",
    "You are doing the best you can, and that's something to be proud of. Keep going. 💪",
    "Life is 10% what happens to you and 90% how you react to it. 🌈"
  ],
  love: [
    "You are the sunshine that brightens up my day. ☀️",
    "I love you more with each passing day. 💕",
    "You are the reason I wake up with a smile on my face. 😊",
    "Forever and always, my love for you will endure. 💗",
    "You are the missing piece that makes me whole. 🧩",
    "In your eyes, I see my future. 👀",
    "You are the love of my life. 💖",
    "Every moment with you is a gift. 🎁",
    "You make my heart skip a beat. ❤️",
    "I am forever grateful for your love. 🙏",
    "You are my forever home. 🏠",
    "Your touch ignites a fire within me. 🔥",
    "You are my soulmate, my everything. 💕",
    "With you, I feel complete. 🌈",
    "You are the rhythm that makes my heart sing. 🎶",
    "In your arms, I find solace. 🤗",
    "You are the reason I breathe. 👅",
    "You are my guiding star. ⭐️",
    "Your love is my shelter. 🌂",
    "You are my forever companion. 👫",
    "With you, I feel invincible. 💪",
    "You are the melody that fills my heart. 🎵",
    "You are my safe haven. 🏠",
    "Your love is my anchor. ⚓️",
    "You are my forever love. 💕",
    "You make my heart flutter. 🦋",
    "You are my partner in every sense. 👫",
    "You are the missing piece to my puzzle. 🧩",
    "You are my forever friend. 👫",
    "You are the love that sets my soul on fire. 🔥",
    "You are my forever everything. 💕",
    "You are the reason I am alive. 👅",
    "You are my guiding light. ✨",
    "You are my shelter from the storm. ⛈️",
    "You are my forever home. 🏠",
    "You are my forever love. 💕",
    "You are my forever everything. 💕"
  ]
};

// Routes

// Get all messages with filtering and sorting
app.get('/api/messages', (req, res) => {
  let filteredMessages = [...messages];

  if (req.query.category && req.query.category !== 'all') {
    filteredMessages = filteredMessages.filter(m => m.category === req.query.category);
  }

  if (req.query.sort) {
    switch (req.query.sort) {
      case 'newest':
        filteredMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filteredMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'popular':
        filteredMessages.sort((a, b) => b.likes - a.likes);
        break;
    }
  }

  res.json(filteredMessages);
});

// Get random message
app.get('/api/messages/random', (req, res) => {
  const category = req.query.category || 'greetings';
  const messages = predefinedMessages[category];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  res.json({
    id: Date.now(),
    content: randomMessage,
    category: category,
    likes: 0,
    createdAt: new Date().toISOString()
  });
});

// Create new message
app.post('/api/messages', (req, res) => {
  const newMessage = {
    id: Date.now(),
    content: req.body.content,
    category: req.body.category,
    likes: 0,
    user: req.body.user,
    createdAt: new Date().toISOString()
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

// Update user profile
app.post('/api/profile', upload.single('photo'), (req, res) => {
  const { username } = req.body;
  let profilePhoto = null;

  if (req.file) {
    profilePhoto = `/uploads/profile_photos/${req.file.filename}`;
  }

  const user = {
    username,
    profilePhoto
  };

  res.json(user);
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
