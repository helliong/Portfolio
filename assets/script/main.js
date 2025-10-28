/* Intro greeting */

const greetings = document.getElementById('greetings');

const greetingsList = ["Hello.", "Привет.", "Hola.", "Bonjour.", "Ciao.", "こんにちは。", "안녕하세요.", "مرحبا."];

let index = 0;

function updateGreeting() {
        index = (index + 1) % greetingsList.length;
        greetings.textContent = greetingsList[index];
}

setInterval(updateGreeting, 2000);

/* Intro clouds */

window.addEventListener('load', () => {
        const container = document.querySelector('.intro');
        const clouds = [
                document.querySelector('.first-cloud-intro'),
                document.querySelector('.second-cloud-intro'),
                document.querySelector('.thrid-cloud-intro')
        ].filter(Boolean);

        if (!container || clouds.length === 0) return;

        const pad = 50; 

        function rand(min, max) {
                return Math.random() * (max - min) + min;
        }

        function placeCloud(el) {
                
                const cw = container.clientWidth;
                const ch = container.clientHeight;

                
                const prevOpacity = el.style.opacity;
                el.style.opacity = 1;
                el.style.right = 'auto'; 
                const ew = el.offsetWidth || 200;
                const eh = el.offsetHeight || 100;

                const maxX = Math.max(0, cw - ew - pad);
                const maxY = Math.max(0, ch - eh - pad);

                const x = rand(pad, maxX);
                const y = rand(pad, maxY);

                el.style.left = `${x}px`;
                el.style.top  = `${y}px`;
                el.style.opacity = prevOpacity;
        }

        function cycleCloud(el) {
                const fadeDur = 3000; 
                const visibleDur = rand(4000, 9000);
                const idleDur = rand(1000, 3000);

                placeCloud(el);
                requestAnimationFrame(() => {
                        el.style.opacity = 1;
                });

                setTimeout(() => {
                        el.style.opacity = 0;

                        setTimeout(() => {
                                setTimeout(() => cycleCloud(el), idleDur);
                        }, fadeDur);
                }, visibleDur);
        }

        clouds.forEach((el, i) => {
                setTimeout(() => cycleCloud(el), i * 700 + rand(0, 800));
        });
});

const BLUR_MARGIN = 50; 

function getRect(el) {
        const x = parseFloat(el.style.left) || 0;
        const y = parseFloat(el.style.top) || 0;
        const w = el.offsetWidth || 200;
        const h = el.offsetHeight || 100;
        return { x, y, w, h };
}
function expandRect(r, m) {
        return { x: r.x - m, y: r.y - m, w: r.w + 2*m, h: r.h + 2*m };
}
function intersects(a, b) {
        return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
}

function placeCloudNoOverlap(el, others, container, pad = 20, maxAttempts = 50) {
        const cw = container.clientWidth;
        const ch = container.clientHeight;

        el.style.right = 'auto';

        const prevOpacity = el.style.opacity;
        el.style.opacity = 0;
        const ew = el.offsetWidth || 200;
        const eh = el.offsetHeight || 100;

        const maxX = Math.max(0, cw - ew - pad);
        const maxY = Math.max(0, ch - eh - pad);

        let best = { x: pad, y: pad }; 
        for (let i = 0; i < maxAttempts; i++) {
                const x = Math.random() * (maxX - pad) + pad;
                const y = Math.random() * (maxY - pad) + pad;

                const r = expandRect({ x, y, w: ew, h: eh }, BLUR_MARGIN);
                const collide = others.some(o => intersects(r, expandRect(getRect(o), BLUR_MARGIN)));
                if (!collide) {
                        el.style.left = `${x}px`;
                        el.style.top  = `${y}px`;
                        el.style.opacity = prevOpacity;
                        return;
                }
                best = { x, y };
        }

        el.style.left = `${best.x}px`;
        el.style.top  = `${best.y}px`;
        el.style.opacity = prevOpacity;
}


function cycleCloud(el) {
        const container = document.querySelector('.intro');
        const fadeDur = 2000;
        const visibleDur = Math.random() * (9000 - 4000) + 4000;
        const idleDur = Math.random() * (3000 - 1000) + 1000;

        const others = Array.from(document.querySelectorAll('.first-cloud-intro, .second-cloud-intro, .thrid-cloud-intro'))
                .filter(n => n !== el);

        placeCloudNoOverlap(el, others, container);
        requestAnimationFrame(() => {
                el.style.opacity = 0.5;
        });

        setTimeout(() => {
                el.style.opacity = 0;
                setTimeout(() => {
                        setTimeout(() => cycleCloud(el), idleDur);
                }, fadeDur);
        }, visibleDur);
}