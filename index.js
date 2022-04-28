require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middlewares/error-handler');
const router = require('./router/index');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use('/static', express.static('static'));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));
app.use('/api', router);
app.use(errorHandler);

const start = async () => {
  try {
    console.log('Connection has been established');
    await sequelize.authenticate();

    app.listen(PORT, () => {
      console.log(`Server has started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
