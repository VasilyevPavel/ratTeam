#!/bin/bash

#  Файл выпонняет установку sequelize для postgres, express, ReactSSR
# Для того что бы все сработало:
# 1) chmod +x Exam2phase.sh
# 2) ./Exam2phase.sh
# 2) настроить еслинт: (не обязательно)
# "rules": {
  # "no-console": 0,
  # "react/prop-types": 0,
  # "react/jsx-one-expression-per-line": 0,
  # "jsx-a11y/label-has-associated-control": 0,
  # "jsx-a11y/tabindex-no-positive": 0,
  # "default-param-last": "NONE"
# }

npm init -y;
npm i;
npm i express;
npm i @babel/core @babel/preset-env @babel/preset-react @babel/register react react-dom;
npm i @babel/cli
npm i dotenv
npm i -D nodemon
npm i morgan
npm i --save sequelize pg pg-hstore
npm i --save-dev sequelize-cli
npm i express-session
npm i session-file-store
npm i bcrypt
npm i http-errors

npm set-script start "node app.js"
npm set-script dev "nodemon app.js --ignore session --ext js,jsx,json"

echo "require('dotenv').config()
const path = require('path');

 module.exports = {
 'config': path.resolve('db', 'config', 'dbconfig.json'),
 'models-path': path.resolve('db', 'models'),
 'seeders-path': path.resolve('db', 'seeders'),
 'migrations-path': path.resolve('db', 'migrations')
 };" > .sequelizerc;

npx sequelize init;

echo '{
  "development": {
    "use_env_variable": "DB_URL",
    "dialect": "postgres"
  },
  "test": {
    "use_env_variable": "TEST_DB_URL",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "PROD_DB_URL",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "seederStorage": "sequelize",
  "seederStorageTableName": "SequelizeData"
}' > ./db/config/dbconfig.json;

echo "const { sequelize } = require('./models');

module.exports = async () => {
  try {
    await sequelize.authenticate();
    console.log('База данных успешно подключена 👍');
  } catch (error) {
    console.error('База НЕ подключена 😢', error.message);
  }
};" > ./db/dbCheck.js  ;

echo 'DB_URL=postgres://postgres:postgres@localhost:5432/exam2phase
PORT=3000
COOKIE_SEKRET=qwerty1234567890QWERTY
' > .env 

echo 'DB_URL=[dialect]://[admin]:[password]@[hostname]:[PORT]/[dbName]
PORT=3000
COOKIE_SEKRET=[кодовое слово]
' > .env_example

echo "require('@babel/register');
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const dbCheck = require('./db/dbCheck');

const ssr = require('./src/middlewares/ssr');

const app = express();

const indexRoutes = require('./src/routes/index.routes');
const authRoutes = require('./src/routes/auth.routes');

const { PORT = 3111, COOKIE_SEKRET = 'secretik' } = process.env;
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(ssr);
app.use(morgan('dev'));
app.use(express.json());
app.use(
  session({
    name: 'UserAuth',
    store: new FileStore(),
    secret: COOKIE_SEKRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // false - только для http, true - только для https
      maxAge: 1000 * 60 * 60 * 24 * 2,
      httpOnly: true,
    },
  }),
);

app.use('/', indexRoutes);
app.use('/auth', authRoutes);

dbCheck();
app.listen(PORT, (err) => {
  if (err) return console.log('Ошибка запуска сервера.', err.message);
  console.log(\`🤖 Сервер запущен на http://localhost:\${PORT}\`);
});
" > app.js

mkdir -p public/js
mkdir -p public/images
mkdir -p public/css
mkdir -p src
mkdir -p src/views
mkdir -p src/middlewares
mkdir -p src/lib
mkdir -p src/routes

echo "function isValidEmail(email) {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
}
function errorMessage(message, parentElement) {
  const errTxt = document.createElement('p');
  errTxt.innerText = message;
  errTxt.style.color = 'red';
  parentElement.appendChild(errTxt);
  setTimeout(() => {
    errTxt.remove();
  }, 4000);
}
async function submitForm(endpoint, form) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: form.name?.value,
      email: form.email.value,
      password: form.password.value,
    }),
  });
  return response;
}

const { regForm, logForm } = document.forms;

regForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (isValidEmail(e.target.email.value)) {
    const response = await submitForm('/auth/reg', e.target);
    if (response.status === 200) {
      window.location.href = '/login';
    } else if (response.status === 401) {
      errorMessage(
        'Адрес электронной почты уже занят',
        regForm,
      );
    }
  } else {
    errorMessage(
      'Не верный формат электронной почты.',
      regForm,
    );
  }
});
logForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isValidEmail(e.target.email.value)) {
    const response = await submitForm('/auth/login', e.target);
    if (response.status === 200) {
      window.location.href = '/';
    } else {
      errorMessage(
        'Неправильный адрес электронной почты или пароль',
        logForm,
      );
    }
  } else {
    errorMessage(
      'Введите правильный формат электронной почты.',
      logForm,
    );
  }
});
" > ./public/js/auth.js

echo "
" > ./public/js/application.js

echo 'const React = require("react");
const NavBar = require("./NavBar");

module.exports = function Layout({ children, user }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link href="/css/style.css" rel="stylesheet" />

        <script defer src="/js/auth.js" />
        <title>{}</title>
      </head>
      <body className="body">
        <div className="container">
          <NavBar user={user} />
          {children}
        </div>
      </body>
    </html>
  );
};
' > ./src/views/Layout.jsx

echo "const React = require('react');
const Layout = require('./Layout');

function Home({ title, user }) {
  return (
    <Layout user={user}>
      <div>
        <h2>{title}</h2>
      </div>
    </Layout>
  );
}

module.exports = Home;
" > ./src/views/Home.jsx

echo 'const React = require("react");
const Layout = require("./Layout");

module.exports = function Registration() {
  return (
    <Layout>
      <form name="regForm">
        <h3>Registration</h3>
        <input
          required
          className=""
          type="text"
          name="name"
          placeholder="Name"
        />
        <input
          required
          className=""
          type="email"
          name="email"
          placeholder="E-mail"
        />
        <input
          required
          className=""
          type="password"
          name="password"
          placeholder="Password"
        />
        <button type="submit">Submit</button>
      </form>
    </Layout>
  );
};
' > ./src/views/Registration.jsx

echo 'const React = require("react");

module.exports = function NavBar({ user }) {
  return (
    <nav className="navBar">
      {user ? (
        <>
          <span>hello</span>
          <a href="/">
            home
          </a>
          <a href="/auth/logout">
            logout
          </a>
        </>
      ) : (
        <>
          <a href="/login">
            login
          </a>
          <a href="/registration">
            registration
          </a>
        </>
      )}
    </nav>
  );
};
' > ./src/views/NavBar.jsx

echo 'const React = require("react");
const Layout = require("./Layout");

module.exports = function LogIn() {
  return (
    <Layout>
      <form name="logForm">
        <h3>Log In</h3>
        <input
          name="email"
          required
          className=""
          type="text"
          placeholder="E-mail"
        />
        <input
          name="password"
          required
          className=""
          type="password"
          placeholder="Password"
        />
        <button>Submit</button>
      </form>
    </Layout>
  );
};
' > ./src/views/Login.jsx

echo "require('@babel/register');
const ReactDomServer = require('react-dom/server');
const React = require('react');

const render = (reactComponent, props, res) => {
  const reactElement = React.createElement(reactComponent, {
    ...props,
    ...res.locals,
    ...res.app.locals,
  });
  const html = ReactDomServer.renderToStaticMarkup(reactElement);
  res.send(\`<!DOCTYPE html>\${html}\`);
};

module.exports = render;
" > ./src/lib/render.js

echo "const render = require('../lib/render');

const ssr = (req, res, next) => {
  res.render = (reactComponent, props) => {
    render(reactComponent, { ...props, user: req.session?.user }, res);
  };
  next();
};

module.exports = ssr;
" > ./src/middlewares/ssr.js

echo "const router = require('express').Router();

const Home = require('../views/Home');
const Login = require('../views/Login');
const Registration = require('../views/Registration');

// const {  } = require('../../db/models');

router.get('/', (req, res) => {
  const title = 'Home';
  res.render(Home, { title });
});

router.get('/login', (req, res) => {
  const title = 'Login';
  res.render(Login, { title });
});

router.get('/registration', (req, res) => {
  const title = 'Registration';
  res.render(Registration, { title });
});

module.exports = router;
" > ./src/routes/index.routes.js

echo "const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');

router.post('/reg', async (req, res) => {
  try {
    const sikret = await bcrypt.hash(req.body.password, 10);
    await User.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: sikret,
      },
      {
        returning: true,
        plain: true,
      },
    );

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(401);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.sendStatus(401);
  }
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.sendStatus(401);
  }
  req.session.user = user;
  res.sendStatus(200);
});

router.get('/logout', (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      console.log(e);
      return;
    }
    res.clearCookie('UserAuth');
    res.redirect('/');
  });
});

module.exports = router;
" > ./src/routes/auth.routes.js

echo '{
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": "> 5%",
          "modules": false
        }
      ],
      "@babel/preset-react"
    ]
}' > .babelrc

echo ".container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 768px) {
  .container {
    max-width: 750px;
  }
}

@media (min-width: 992px) {
  .container {
    width: 970px;
  }
}

@media (min-width: 1200px) {
  .container {
    width: 1170px;
  }
}
" > public/css/style.css

exports DB_URL=postgres://postgres:postgres@localhost:5432/[dbName]
npx sequelize-cli db:create
npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string 

npx create-gitignore node
npx eslint --init
