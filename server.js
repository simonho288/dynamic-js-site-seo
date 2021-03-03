const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/get-database-records', async (req, res) => {
  // Simulate little processing time from database server
  setTimeout(() => {
    let results = []; // just return an array of records
    for (let i = 0; i < 100; ++i) {
      results.push({
        id: i + 1,
        name: `Result Record Number #${i + 1}`,
        detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam lorem metus, molestie sit amet dignissim non, facilisis in nunc. Aenean consectetur non elit nec vulputate. Aliquam egestas vestibulum euismod. Sed eleifend diam at sem sagittis sodales. In hac habitasse platea dictumst. Donec suscipit est non odio placerat pulvinar. Ut iaculis mauris ante, et vulputate velit fringilla et. Donec ut sodales eros, ac fringilla lorem. Nam eleifend id tortor sit amet placerat. In viverra, orci nec pretium convallis, odio lacus dignissim sem, a venenatis lorem dui eu diam. Fusce urna diam, condimentum sed molestie et, egestas non dolor. Nulla nec vulputate nisi. Integer enim odio, tristique in congue in, placerat sed mi.',
        img: 'https://i.imgur.com/OVKaZgD.jpg'
      });
    }
    res.json(results);
  }, 800);
});

// Call this API to generate the static page.
app.get('/gen-static-pages', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${req.protocol}://${req.get('host')}/index.html?crawler=1`, {waitUntil: 'networkidle2'});
  let html = await page.content(); // Headless Chrome returns the HTML contents
  fs.writeFileSync('public/index-static.html', html); // Save the contents to file
  await browser.close();

  res.end('Static files generated');
});

app.listen(PORT, () => {
  console.log(`NodeJS Express API server running at port ${PORT}`);
});