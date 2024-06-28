$(document).ready(function() {
    function updateSignalStatus() {
        $.get('/api/signal-info', function(data) {
            const { elapsedSeconds, signals } = data;
            const totalCycleDuration = signals.reduce((sum, signal) => sum + signal.greenDuration + signal.yellowDuration, 0);
            let remainingTime = totalCycleDuration - (elapsedSeconds % totalCycleDuration);

            let currentSignal = null;
            let currentState = null;
            let timeInCurrentState = 0;

            for (let i = 0; i < signals.length; i++) {
                const signal = signals[i];
                if (remainingTime > signal.greenDuration + signal.yellowDuration) {
                    remainingTime -= (signal.greenDuration + signal.yellowDuration);
                } else {
                    currentSignal = signal.name;
                    if (remainingTime > signal.yellowDuration) {
                        currentState = 'Green';
                        timeInCurrentState = remainingTime - signal.yellowDuration;
                    } else {
                        currentState = 'Yellow';
                        timeInCurrentState = remainingTime;
                    }
                    break;
                }
            }

            // Update UI
            $('#current-signal').text(currentSignal);
            $('#current-state').text(currentState).removeClass('text-success text-warning').addClass(currentState === 'Green' ? 'text-success' : 'text-warning');
            $('#time-remaining').text(timeInCurrentState);

            // Update signal lights
            $('.signal').removeClass('active yellow').addClass('inactive');
            $(`#${currentSignal.toLowerCase().replace(' ', '-')}`).removeClass('inactive').addClass(currentState === 'Green' ? 'active' : 'yellow');
        });
    }

    // Update every second
    setInterval(updateSignalStatus, 1000);
    updateSignalStatus(); // Initial update
});