const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 连接 MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 检查数据库连接
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB successfully!');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB connection error:', err);
});

// 引入路由
const todoRoutes = require('./src/routes/todoRoutes');
app.use('/api/todos', todoRoutes);

// 基本路由测试
app.get('/', (req, res) => {
  res.json({ message: '🎉 Todo API Server is working!' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});