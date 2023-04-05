const app = require('express')();
const { v4 } = require('uuid');
const mongoose = require('mongoose');
const request = require('request');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  'mongodb+srv://jip1029:Updown1029@nasaimageappdb.h4indjy.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.post('/', async (req, res) => {
  const saltRounds = 10;
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    res.send('An error occurred, please try again.');
  }
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: 'public' });
});

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
