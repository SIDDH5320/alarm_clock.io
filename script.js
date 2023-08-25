// Get references to DOM elements
const timeElement = document.getElementById('time');
const setAlarmBtn = document.getElementById('setAlarmBtn');
const alarmList = document.getElementById('alarmList');
const alarmTimeSelect = document.getElementById('alarmTime');
const alarmSecondSelect = document.getElementById('alarmSecond');
const setAlarmModalBtn = document.getElementById('setAlarmModalBtn');

// Array to store alarm objects
const alarms = [];

// Update current time every second
setInterval(updateTime, 1000);

// Show the alarm modal when the "Set Alarm" button is clicked
setAlarmBtn.addEventListener('click', () => {
  $('#alarmModal').modal('show');
});

// Set alarm when the modal's "Set Alarm" button is clicked
setAlarmModalBtn.addEventListener('click', () => {
  setAlarm();
  $('#alarmModal').modal('hide');
});

// Update the displayed time
function updateTime() {
    const now = new Date();
    
    // Get the current date in the format "Month Day, Year"
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);
    
    // Get the current time in the format "HH:MM:SS AM/PM"
    const timeString = now.toLocaleTimeString();
    
    // Update the timeElement to display both current date and time
    timeElement.textContent = `Current Date: ${dateString} | Current Time: ${timeString}`;
    
    checkAlarms(now);
  }

// Create a new alarm and add it to the alarms array
function setAlarm() {
  const alarmTimeSelectValue = alarmTimeSelect.value;
  const alarmSecondSelectValue = alarmSecondSelect.value;
  if (alarmTimeSelectValue && alarmSecondSelectValue) {
    const [hours, minutes] = alarmTimeSelectValue.split(':');
    const alarmTime = new Date();
    alarmTime.setHours(parseInt(hours));
    alarmTime.setMinutes(parseInt(minutes));
    alarmTime.setSeconds(parseInt(alarmSecondSelectValue));

    const alarmItem = document.createElement('div');
    alarmItem.classList.add('alarm-item');
    alarmItem.innerHTML = `
      <div>${formatTime(alarmTime)}</div>
      <button class="delete-btn">Delete</button>
    `;

    // Add the new alarm to the alarms array and render it
    alarms.push({ time: alarmTime, element: alarmItem, alerted: false });
    renderAlarms();

    const deleteBtn = alarmItem.querySelector('.delete-btn');
    // Delete the alarm when its delete button is clicked
    deleteBtn.addEventListener('click', () => {
      const index = alarms.findIndex(alarm => alarm.element === alarmItem);
      if (index !== -1) {
        alarms.splice(index, 1);
        renderAlarms();
      }
    });
  }
}

// Check if any alarms have reached their time
const alarmSound = new Audio('alarmsound/soundtwo.mp3'); //my alarm sound 

let currentAlarm = null; // Store the current triggered alarm

function checkAlarms(currentTime) {
  alarms.forEach(alarm => {
    if (currentTime >= alarm.time && !alarm.alerted) {
      alert('WAKE UP WAKE UP WAKE UP');
      alarm.alerted = true; // Mark as alerted to prevent repeated alerts
      
      // Play the alarm sound
      alarmSound.play();
      
      // Store the current triggered alarm
      currentAlarm = alarm;
    }
  });
}

// Function to stop the alarm sound
function stopAlarmSound() {
  if (currentAlarm) {
    // Pause the alarm sound
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset playback position
    currentAlarm = null; // Clear the current triggered alarm
  }
}

// Render the list of alarms
function renderAlarms() {
  alarmList.innerHTML = '';
  alarms.forEach(alarm => {
    const alarmElement = document.createElement('div');
    alarmElement.classList.add('alarm-item');
    alarmElement.innerHTML = `
      <div>${formatTime(alarm.time)}</div>
      <button class="delete-btn btn btn-danger">Delete</button>
    `;

    const deleteBtn = alarmElement.querySelector('.delete-btn');
    // Delete the alarm when its delete button is clicked
    deleteBtn.addEventListener('click', () => {
      const index = alarms.findIndex(a => a.time === alarm.time);
      if (index !== -1) {
        alarms.splice(index, 1);
        renderAlarms();
      }
    });

    alarmList.appendChild(alarmElement);
  });
}

// Format the time for display
function formatTime(date) {
  return date.toLocaleTimeString();
}
