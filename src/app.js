require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);

// const apiRouter = require('./routers/api.router');

const { PORT, SECRET_KEY_SESSION } = process.env;
const corsOptions = {
  origin: [process.env.CORS_ORIGIN],
  credentials: true,
};

const sessionConfig = {
  store: new FileStore(),
  secret: SECRET_KEY_SESSION,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 100 * 60 * 1000,
    httpOnly: true,
  },
};

const app = express();

app.use(expressSession(sessionConfig));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(express.static(path.join(process.cwd(), 'storage')));

// app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server has been started on ${PORT}`);
});
