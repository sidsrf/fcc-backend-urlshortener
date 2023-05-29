require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns')
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

var urls = {}
var newurl = 1
const ejson = { "error": 'invalid url' }
app.post('/api/shorturl', (req, res, next) => {
  try {
    var url = new URL(req.body['url'])
    if (!url.protocol.includes('http')) {
      throw new Error()
    } else {
      dns.lookup(url['host'], (err, add, fam) => {
        if (err) {
          throw new Error()
        } else {
          next();
        }
      })
    }
  } catch (err) {
    res.json(ejson)
  }
}, (req, res) => {
  res.json({ "original_url": req.body['url'], "short_url": newurl })
  urls[newurl++] = req.body['url']
})

app.get('/api/shorturl/:url', (req, res) => {
  const url = req.params['url']
  res.redirect(urls[url])
})


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
