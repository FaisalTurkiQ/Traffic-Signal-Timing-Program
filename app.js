const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const signals = [
  { name: 'Signal 1', greenDuration: 50, yellowDuration: 5 },
  { name: 'Signal 2', greenDuration: 65, yellowDuration: 5 },
  { name: 'Signal 3', greenDuration: 60, yellowDuration: 5 },
  { name: 'Signal 4', greenDuration: 85, yellowDuration: 5 }
];

app.get('/', (req, res) => {
  res.render('index', { signals });
});

app.get('/api/signal-info', (req, res) => {
  const startTime = new Date(2024, 5, 28, 13, 51, 17); // June 28, 2024, 13:51:17
  const now = new Date();
  const elapsedSeconds = Math.floor((now - startTime) / 1000);
  res.json({ elapsedSeconds, signals });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});