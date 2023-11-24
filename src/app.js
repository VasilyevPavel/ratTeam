require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const apiRouter = require('./src/routers/api.router.js');
const errorMiddleware = require('./src/middlewares/error-middlewares');

const { PORT } = process.env;
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api', apiRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server has been started on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
