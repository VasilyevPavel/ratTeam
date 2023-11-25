require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const apiRouter = require('./routers/api.router');

const errorMiddleware = require('./middlewares/error-middlewares');

const { PORT, CORS_ORIGIN } = process.env;

// const corsOptions = {
//   origin: ['https://xll792-3000.csb.app', 'http://localhost:3000'],
//   credentials: true,
// };
const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors(corsOptions));

app.use('/api', apiRouter);
app.use(errorMiddleware);
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://xll792-3000.csb.app',
    'http://localhost:3000',
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
