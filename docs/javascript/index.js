"use strict";
onload = (event) => {
    console.log('page loaded');
    // Based on https://codepen.io/vaskopetrov/pen/yVEXjz
    let clockEl = document.getElementById('clock-face');
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
    placeItems();
    console.log('seconds to next whole minute: ' + millisecondsToNextMinute() / 1000);
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
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState == 'visible') {
            setHands();
        }
    });
    window.addEventListener('resize', placeItems);
    setInterval(() => {
        let now = new Date();
        let time = now.getHours().toFixed().padStart(2, '0') + ":" + now.getMinutes().toFixed().padStart(2, '0')
            + ":" + now.getSeconds().toFixed().padStart(2, '0');
        if (document.title !== time) {
            document.title = time;
        }
    }, 100);
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
    const lastMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    const nextMinute = lastMinute.valueOf() + 60 * 1000;
    return nextMinute - now.valueOf();
}
function updateClockRegularly() {
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
function toggleColourMode(event) {
    console.log('Toggling colour mode...');
    console.log(event.target);
    let targetElement = event.target;
    if (targetElement != null && targetElement instanceof HTMLElement) {
        console.log(targetElement.innerText);
        if (targetElement.innerText === 'light_mode') {
            targetElement.innerText = 'nightlight';
        }
        else {
            targetElement.innerText = 'light_mode';
        }
    }
    let root = document.documentElement;
    let background = getComputedStyle(root).getPropertyValue('--background');
    if (background === '#E8E8E8') {
        root.style.setProperty('--background', '#202020');
        root.style.setProperty('--foreground', '#E8E8E8');
        root.style.setProperty('--foreground2', '#E8E8E8a0');
    }
    else {
        root.style.setProperty('--background', '#E8E8E8');
        root.style.setProperty('--foreground', '#202020');
        root.style.setProperty('--foreground2', '#202020ed');
    }
}
function editOnStackblitz(event) {
    if (window != null) {
        window.open('https://stackblitz.com/edit/css-clock', '_blank');
    }
}
function openGithubVersion(event) {
    if (window != null) {
        window.open('https://davidgma.github.io/css-clock/', '_blank');
    }
}
// place items based on viewport dimensions
function placeItems() {
    let vh = window.innerHeight;
    let vw = window.innerWidth;
    let root = document.querySelector(':root');
    // console.log('vh: ' + vh);
    // 1. There's not enough space above or below
    if (vh < vw * 1.2 && vw < vh * 1.2) {
        console.log('not enough space above or below');
        // Make the clock face smaller with some margin at the top and put the icons at the bottom.
        // sizes in pixels but based on viewport sizes
        let clockSize = 72 * vh / 100; // pixels
        let transformSize = (clockSize - 5) / 2;
        let fontSize = clockSize / 15;
        let iconSize = clockSize / 10;
        root.style.setProperty('--clock-size', clockSize.toFixed() + 'px');
        root.style.setProperty('--font-size', fontSize.toFixed() + 'px');
        root.style.setProperty('--transform-origin', '50% ' + transformSize.toFixed() + 'px');
        root.style.setProperty('--nav-direction', "row");
        root.style.setProperty('--container-direction', "column");
        root.style.setProperty('--icon-size', iconSize.toFixed() + 'px');
        root.style.setProperty('--line-height', "auto");
        root.style.setProperty('--line-width', "100vw");
        root.style.setProperty('--line-border-horizontal', "1px solid var(--foreground2)");
        root.style.setProperty('--line-border-vertical', "none");
    }
    // 2. There's enough space above and below
    else if (vh >= vw * 1.2) {
        console.log(' enough space above and below');
        // sizes in pixels but based on viewport sizes
        let clockSize = 91 * vw / 100; // pixels
        let transformSize = (clockSize - 4) / 2;
        let fontSize = clockSize / 15;
        let iconSize = clockSize / 10;
        root.style.setProperty('--clock-size', clockSize.toFixed() + 'px');
        root.style.setProperty('--font-size', fontSize.toFixed() + 'px');
        root.style.setProperty('--icon-size', iconSize.toFixed() + 'px');
        root.style.setProperty('--transform-origin', '50% ' + transformSize.toFixed() + 'px');
        root.style.setProperty('--nav-direction', "row");
        root.style.setProperty('--container-direction', "column");
        root.style.setProperty('--line-height', "auto");
        root.style.setProperty('--line-width', "100vw");
        root.style.setProperty('--line-border-horizontal', "1px solid var(--foreground2)");
        root.style.setProperty('--line-border-vertical', "none");
    }
    // 3. There's enough space to the left and right
    if (vw > vh * 1.2) {
        console.log('enough space left and right');
        // sizes in pixels but based on viewport sizes
        let clockSize = 91 * vh / 100; // pixels
        let transformSize = (clockSize - 5) / 2;
        let fontSize = clockSize / 15;
        let iconSize = clockSize / 10;
        root.style.setProperty('--clock-size', clockSize.toFixed() + 'px');
        root.style.setProperty('--font-size', fontSize.toFixed() + 'px');
        root.style.setProperty('--icon-size', iconSize.toFixed() + 'px');
        root.style.setProperty('--transform-origin', '50% ' + transformSize.toFixed() + 'px');
        root.style.setProperty('--nav-direction', "column");
        root.style.setProperty('--container-direction', "row");
        root.style.setProperty('--line-height', "100vh");
        root.style.setProperty('--line-width', "auto");
        root.style.setProperty('--line-border-horizontal', "none");
        root.style.setProperty('--line-border-vertical', "1px solid var(--foreground2)");
    }
}
