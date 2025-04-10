const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const carRoutes = require('./routes/cars');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // ВАЖЛИВО: для відкриття index.html

// Підключення до MongoDB
mongoose.connect('mongodb+srv://andriyanboxing10:Fylhszyeuro2000@1site.rhmefzg.mongodb.net/automarket?retryWrites=true&w=majority&appName=1site', {
  dbName: 'automarket',
})
  .then(() => console.log('✅ Підключено до MongoDB'))
  .catch((err) => console.error('❌ Помилка MongoDB:', err));

// API-маршрути
app.use('/api/cars', carRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на http://localhost:${PORT}`);
});
