
onload = (event) => {
  console.log('page loaded');

  // Based on https://codepen.io/vaskopetrov/pen/yVEXjz
  let clockEl = document.getElementsByClassName('clock-face')[0];

  for (let i = 0; i < 60; i++) {
    let className = 'dialline';
    if (i % 5 === 0) {
      className = 'dialline-large';
    }
    clockEl.innerHTML +=
      "<div class='" +
      className +
      "' style='transform: rotate(" +
      6 * i +
      "deg)'></div>";
  }

  setHands();
  console.log(
    'seconds to next whole minute: ' + millisecondsToNextMinute() / 1000
  );
  setTimeout(setHands, millisecondsToNextMinute());
  setTimeout(updateClockRegularly, millisecondsToNextMinute());

  let colourMode = document.getElementById('colour-mode');
  if (colourMode != null && colourMode instanceof HTMLElement) {
    colourMode.addEventListener('click', toggleColourMode);
  }

  let edit = document.getElementById('edit');
  if (edit != null && edit instanceof HTMLElement) {
    edit.addEventListener('click', editOnStackblitz);
  }

  let home = document.getElementById('home');
  if (home != null && home instanceof HTMLElement) {
    home.addEventListener('click', openGithubVersion);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState == "visible") {
      setHands();
    }
  })
};

function setHands() {
  /* to set current time */
  // console.log("in setHands");
  const time = new Date();
  const hour = -3600 * (time.getHours() % 12);
  const mins = -60 * time.getMinutes();
  const secs = -1 * time.getSeconds();

  // Get the root element
  let r = document.documentElement;
  reset_animation();
  r.style.setProperty('--_dm', `${mins}s`);
  r.style.setProperty('--_dh', `${hour + mins}s`);
  r.style.setProperty('--_ds', `${secs}s`);
}

function millisecondsToNextMinute() {
  // calculate next whole minute
  const now = new Date();
  const lastMinute = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes()
  );
  const nextMinute = lastMinute.valueOf() + 60 * 1000;
  return nextMinute - now.valueOf();
}

function updateClockRegularly() {
  // console.log("in updateClockRegularly");
  setInterval(setHands, 60 * 1000);
}

function reset_animation() {
  let elements = document.getElementsByClassName('arm');
  for (let element of elements) {
    if (element instanceof HTMLElement) {
      element.style.animation = 'none';
      element.offsetHeight; /* trigger reflow */
      element.style.animation = '';
    }
  }
}

function toggleColourMode(event: MouseEvent) {
  console.log('Toggling colour mode...');
  console.log(event.target);
  let targetElement = event.target;
  if (targetElement != null && targetElement instanceof HTMLElement) {
    console.log(targetElement.innerText);
    if (targetElement.innerText === 'light_mode') {
      targetElement.innerText = 'nightlight';
    } else {
      targetElement.innerText = 'light_mode';
    }
  }
  let root = document.documentElement;
  let background = getComputedStyle(root).getPropertyValue('--background');
  if (background === '#E8E8E8') {
    root.style.setProperty('--background', '#202020');
    root.style.setProperty('--foreground', '#E8E8E8');
  } else {
    root.style.setProperty('--background', '#E8E8E8');
    root.style.setProperty('--foreground', '#202020');
  }
}

function editOnStackblitz(event: MouseEvent) {
  if (window != null) {
    window.open('https://stackblitz.com/edit/css-clock', '_blank');
  }
}

function openGithubVersion(event: MouseEvent) {
  if (window != null) {
    window.open('https://davidgma.github.io/css-clock/', '_blank');
  }
}
