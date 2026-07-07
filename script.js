const targetDate = new Date('2026-07-12T15:00:00+02:00');

const elements = {
  days: document.querySelector('#days'), hours: document.querySelector('#hours'),
  minutes: document.querySelector('#minutes'), seconds: document.querySelector('#seconds')
};

function updateCountdown() {
  const remaining = Math.max(0, targetDate.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  elements.days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, '0');
  elements.hours.textContent = String(Math.floor(totalSeconds % 86400 / 3600)).padStart(2, '0');
  elements.minutes.textContent = String(Math.floor(totalSeconds % 3600 / 60)).padStart(2, '0');
  elements.seconds.textContent = String(totalSeconds % 60).padStart(2, '0');
  if (remaining === 0) {
    document.querySelector('.countdown').hidden = true;
    document.querySelector('#arrival-message').hidden = false;
  }
}

const partsFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Bratislava', hour: '2-digit', minute: '2-digit', second: '2-digit',
  hourCycle: 'h23'
});

function bratislavaTime() {
  const parts = Object.fromEntries(partsFormatter.formatToParts(new Date())
    .filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]));
  return { hour: parts.hour, minute: parts.minute, second: parts.second };
}

function updateClock() {
  const { hour, minute, second } = bratislavaTime();
  document.querySelector('#hour-hand').style.transform = `rotate(${(hour % 12) * 30 + minute * .5}deg)`;
  document.querySelector('#minute-hand').style.transform = `rotate(${minute * 6 + second * .1}deg)`;
  document.querySelector('#second-hand').style.transform = `rotate(${second * 6}deg)`;
  document.querySelector('#digital-time').textContent = [hour, minute, second]
    .map(value => String(value).padStart(2, '0')).join(':');
}

const marks = document.querySelector('#minute-marks');
for (let i = 0; i < 60; i += 1) {
  const mark = document.createElement('span');
  mark.className = `mark${i % 5 === 0 ? ' major' : ''}`;
  mark.style.setProperty('--r', `${i * 6}deg`);
  marks.appendChild(mark);
}

const hintModal = document.querySelector('#hint-modal');
const hintOpenButtons = document.querySelectorAll('.hint-open');
const hintClose = document.querySelector('.hint-close');
const hintTitle = document.querySelector('#hint-title');
const hintImage = document.querySelector('#hint-image');

function closeHintModal() {
  hintModal.classList.remove('is-open');
}

function openHintModal(button) {
  if (button) {
    hintTitle.textContent = button.dataset.hintTitle;
    hintImage.src = button.dataset.hintImage;
    hintImage.alt = button.dataset.hintTitle;
  }
  hintModal.classList.add('is-open');
}

hintOpenButtons.forEach(button => {
  button.addEventListener('click', () => openHintModal(button));
});
hintClose.addEventListener('click', closeHintModal);
hintModal.addEventListener('click', event => {
  if (event.target === hintModal) closeHintModal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeHintModal();
});

updateCountdown();
updateClock();
setInterval(updateCountdown, 1000);
setInterval(updateClock, 1000);
