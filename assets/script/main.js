/* INTRO */

let introActive = true;

function isIntroInactive() {
        const el = document.querySelector('.intro');
        return !el || el.classList.contains('leave') || el.classList.contains('hidden');
}

/* Greeting */
const greetingsEl = document.getElementById('greetings');
const greetingsList = ["Hello.", "Привет.", "Hola.", "Bonjour.", "Ciao.", "こんにちは。", "안녕하세요.", "مرحبا."];
let greetingsIndex = 0;
if (greetingsEl) greetingsEl.textContent = greetingsList[0];

function updateGreeting() {
        if (isIntroInactive() || !greetingsEl) return;
        greetingsIndex = (greetingsIndex + 1) % greetingsList.length;
        greetingsEl.textContent = greetingsList[greetingsIndex];
}
setInterval(updateGreeting, 2000);

/* Clouds + author click + no-overlap */
(function () {
        const MIN_DIST = 420;
        const PAD = 50;
        const FADE_DUR = 2000;
        const VISIBLE_MIN = 5000;
        const VISIBLE_MAX = 7000;
        const IDLE_MIN = 1500;
        const IDLE_MAX = 3000;

        function rand(min, max) { return Math.random() * (max - min) + min; }
        function centerRect(x, y, w, h) { return { cx: x + w / 2, cy: y + h / 2 }; }
        function dist(a, b) { const dx = a.cx - b.cx, dy = a.cy - b.cy; return Math.hypot(dx, dy); }

        function placeCloudNoOverlap(el, others, container) {
                if (isIntroInactive()) return;
                const cw = container.clientWidth;
                const ch = container.clientHeight;
                el.style.right = 'auto';
                const ew = el.offsetWidth || 200;
                const eh = el.offsetHeight || 100;
                const maxX = Math.max(0, cw - ew - PAD);
                const maxY = Math.max(0, ch - eh - PAD);

                for (let i = 0; i < 80; i++) {
                        const x = rand(PAD, maxX);
                        const y = rand(PAD, maxY);
                        const c = centerRect(x, y, ew, eh);
                        const ok = others.every(o => {
                                const ow = o.offsetWidth || 200;
                                const oh = o.offsetHeight || 100;
                                const ox = parseFloat(o.style.left) || 0;
                                const oy = parseFloat(o.style.top) || 0;
                                const oc = centerRect(ox, oy, ow, oh);
                                return dist(c, oc) >= MIN_DIST;
                        });
                        if (ok) { el.style.left = `${x}px`; el.style.top = `${y}px`; return; }
                }
                const x = rand(PAD, maxX);
                const y = rand(PAD, maxY);
                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
        }

        function cycleCloud(el) {
                if (isIntroInactive()) return;
                const container = document.querySelector('.intro');
                const others = Array.from(document.querySelectorAll('.first-cloud-intro, .second-cloud-intro, .thrid-cloud-intro')).filter(n => n !== el);
                const visibleDur = rand(VISIBLE_MIN, VISIBLE_MAX);
                const idleDur = rand(IDLE_MIN, IDLE_MAX);

                placeCloudNoOverlap(el, others, container);
                requestAnimationFrame(() => { if (!isIntroInactive()) el.style.opacity = 0.8; });

                setTimeout(() => {
                        if (isIntroInactive()) return;
                        el.style.opacity = 0;
                        setTimeout(() => {
                                if (isIntroInactive()) return;
                                setTimeout(() => cycleCloud(el), idleDur);
                        }, FADE_DUR);
                }, visibleDur);
        }

        window.addEventListener('load', () => {
                const intro = document.querySelector('.intro');
                const author = document.querySelector('.author');
                const clouds = [
                        document.querySelector('.first-cloud-intro'),
                        document.querySelector('.second-cloud-intro'),
                        document.querySelector('.thrid-cloud-intro')
                ].filter(Boolean);
                if (!intro || !author) return;

                clouds.forEach((el, i) => {
                        setTimeout(() => cycleCloud(el), i * 600 + rand(0, 500));
                });

                author.addEventListener('click', () => {
                        introActive = false;
                        clouds.forEach(el => el.style.opacity = 0);
                        intro.classList.add('leave');
                        intro.addEventListener('transitionend', () => {
                                intro.classList.add('hidden');
                        }, { once: true });
                });
        });
})();

/* MAIN PAGE */