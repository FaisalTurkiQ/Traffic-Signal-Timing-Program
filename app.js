const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Signal timings
const signals = [
  { name: 'Signal 1', greenDuration: 50, yellowDuration: 5 },
  { name: 'Signal 2', greenDuration: 65, yellowDuration: 5 },
  { name: 'Signal 3', greenDuration: 60, yellowDuration: 5 },
  { name: 'Signal 4', greenDuration: 85, yellowDuration: 5 }
];

const totalCycleDuration = signals.reduce((sum, signal) => sum + signal.greenDuration + signal.yellowDuration, 0);

function calculateRemainingTime(startTime) {
  const now = new Date();
  const elapsedSeconds = Math.floor((now - startTime) / 1000) % totalCycleDuration;
  let elapsedTime = elapsedSeconds;

  let currentSignal = null;
  let currentState = null;
  let timeInCurrentState = 0;

  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i];
    const signalDuration = signal.greenDuration + signal.yellowDuration;

    if (elapsedTime < signalDuration) {
      currentSignal = signal.name;
      if (elapsedTime < signal.greenDuration) {
        currentState = 'Green';
        timeInCurrentState = signal.greenDuration - elapsedTime;
      } else {
        currentState = 'Yellow';
        timeInCurrentState = signalDuration - elapsedTime;
      }
      break;
    }

    elapsedTime -= signalDuration;
  }

  return { currentSignal, currentState, timeInCurrentState, signals };
}

app.get('/', (req, res) => {
  const startTime = new Date(2024, 5, 28, 13, 51, 17); // June 28, 2024, 13:51:17
  const { currentSignal, currentState, timeInCurrentState, signals } = calculateRemainingTime(startTime);
  res.render('index', { currentSignal, currentState, timeInCurrentState, signals });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});