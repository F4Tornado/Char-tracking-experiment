const c = document.getElementById("game");
const draw = c.getContext("2d");
let player;
let pperf = 0;
let ticktime = 0;
let lives = 3;
let date = new Date();
let timeOffset = date.getTime();
const particles = [];
const enemies = [];
const arc = {
    r: 0,
    d: 8,
    size: 8,
    width: Math.PI / 2
}
const viewport = {
    x: 0,
    y: 0
}
const palette = {
    foregroundColor: `rgba(235, 235, 235)`,
    foreground: function () { draw.fillStyle = palette.foregroundColor },
    backgroundColor: `rgba(51, 51, 51, 0.5)`,
    background: function () { draw.fillStyle = palette.backgroundColor },
    gridColor: `#10acea`,
    grid: function () { draw.fillStyle = palette.gridColor },
    exhaustColor: `rgb(255, 0, 0)`,
    exhaust: function () { draw.fillStyle = palette.exhaustColor },
    arcColor: `hsla(273, 100%, 50%, 1)`,
    arc: function () { draw.fillStyle = palette.arcColor; }
}


function setup() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    player = new Player();
    adjustViewport()
    requestAnimationFrame(drawLoop);
}

function drawLoop() {
    // console.clear(); // comment out if needed; I was testing enemy death logic
    setTimeout(() => { if (lives !== 0) { requestAnimationFrame(drawLoop) } else { requestAnimationFrame(deadLoop) } }, 60 / 1000);
    // let t1 = performance.now();
    adjustViewport();
    palette.background();
    draw.fillRect(0, 0, c.width, c.height);
    drawGrid();

    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].show()) {
            particles.splice(i, 1);
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].show()) {
            enemies.splice(i, 1);
        }
    }

    drawArrows();

    draw.lineWidth = arc.size;
    draw.strokeStyle = palette.arcColor;
    draw.beginPath();
    draw.arc(player.pos.x - viewport.x, player.pos.y - viewport.y, c.width / arc.d, player.pos.r - arc.width / 2, player.pos.r + arc.width / 2);
    draw.stroke();

    player.update();

    // ticktime = performance.now() - pperf;
    // pperf = performance.now();
    // requestAnimationFrame(drawLoop);
    let t2 = performance.now();
    // document.getElementById("fps").innerHTML = "FPS: " + parseInt((1000 / Math.abs(t2 - t1)));
}

function deadLoop() {
    setTimeout(() => { if (lives !== 0) { requestAnimationFrame(drawLoop) } else { requestAnimationFrame(deadLoop) } }, 60 / 1000);
    adjustViewport();
    palette.background();
    draw.fillRect(0, 0, c.width, c.height);
    drawGrid();

    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].show()) {
            particles.splice(i, 1);
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].show()) {
            enemies.splice(i, 1);
        }
    }

    drawArrows();

    draw.lineWidth = 4
    draw.strokeStyle = palette.arcColor;
    draw.beginPath();
    draw.arc(player.pos.x - viewport.x, player.pos.y - viewport.y, c.width / arc.d, player.pos.r - arc.width / 2, player.pos.r + arc.width / 2);
    draw.stroke();

    player.update();

    draw.fillStyle = "#fff";
    draw.font = "120px PT Sans Narrow";
    draw.textAlign = "center";

    let spread = 60;

    if (keys["Enter"]) {
        lives = 3;
        enemies.splice(0, enemies.length);
        timeOffset = date.getTime();
    }

    draw.fillText("You died", c.width / 2, c.height / 2 - spread);
    draw.font = "60px PT Sans Narrow";
    draw.fillText("Press enter to restart", c.width / 2, c.height / 2 + 40 + spread);
}

function polarToCart(r, d) {
    return [d * Math.cos(r), d * Math.sin(r)]
}

function cartToPolar(x, y) {
    let d = Math.sqrt((x ** 2) + (y ** 2)),
        r = normalAngle(Math.atan2(y, x), true);
    return [r, d];
}
// t is the option between -180 to 180 (false) and 0 to 360 (true).
function normalAngle(r, t) {
    let o = r;
    if (t == true) {
        while (o >= Math.PI * 2 || o < 0) {
            if (o >= Math.PI * 2) {
                o -= Math.PI * 2
            } else {
                o += Math.PI * 2
            }
        }
    } else {
        while (o >= Math.PI || o < -Math.PI) {
            if (o >= Math.PI) {
                o -= Math.PI * 2
            } else {
                o += Math.PI * 2
            }
        }
    }
    return o;
}

function map(v, min1, max1, min2, max2) {
    return ((v - min1) / (max1 - min1)) * (max2 - min2) + min2
}

function drawGrid() {
    draw.strokeStyle = palette.gridColor;
    draw.lineWidth = 1;
    let div = 18;
    for (let i = 0; i < c.height - viewport.y % (c.width / div) + 500; i += c.width / div) {
        draw.beginPath();
        draw.moveTo(0, i - viewport.y % (c.width / div));
        draw.lineTo(c.width, i - viewport.y % (c.width / div));
        draw.stroke();
    }
    for (let i = 0; i < c.width - viewport.x % (c.width / div) + 500; i += c.width / div) {
        draw.beginPath();
        draw.moveTo(i - viewport.x % (c.width / div), 0);
        draw.lineTo(i - viewport.x % (c.width / div), c.height);
        draw.stroke();
    }
}

function drawArrows() {
    for (let i = 0; i < enemies.length; i++) {
        if ((enemies[i].pos.x - viewport.x < 0 || enemies[i].pos.x - viewport.x > c.width || enemies[i].pos.y - viewport.y < 0 || enemies[i].pos.y - viewport.y > c.height) && enemies[i].dead == 0) {
            palette.foreground();

            let r = Math.atan2((player.pos.y - enemies[i].pos.y), (player.pos.x - enemies[i].pos.x)) + Math.PI;

            let p1 = polarToCart(r, 16);
            let p2 = polarToCart(Math.PI * 2 / 3 + r, 8);
            let p3 = polarToCart(Math.PI * 2 * 2 / 3 + r, 8);
            let d = polarToCart(r, c.width / arc.d + c.width / 32);
            draw.beginPath();
            draw.moveTo(p1[0] + player.pos.x - viewport.x + d[0], p1[1] + player.pos.y - viewport.y + d[1]);
            draw.lineTo(p2[0] + player.pos.x - viewport.x + d[0], p2[1] + player.pos.y - viewport.y + d[1]);
            draw.lineTo(p3[0] + player.pos.x - viewport.x + d[0], p3[1] + player.pos.y - viewport.y + d[1]);
            draw.fill();
        }
    }
}

function dist(x1, y1, x2, y2) {
    let d = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

    if (isNaN(d)) {
        return 0;
    } else {
        return d;
    }
}

function spawnEnemies() {
    setTimeout(() => {
        if (lives !== 0) {
            for (let i = 0; i < 4; i++) {
                enemies.push(new Enemy());
            }
        }
        spawnEnemies();
    }, Math.E ** (-(date.getTime() - timeOffset) / 10000) * 5000);
}

spawnEnemies();

function adjustViewport() {
    const mult = 8;
    viewport.x = player.pos.v.x * mult + player.pos.x - (c.width / 2);
    viewport.y = player.pos.v.y * mult + player.pos.y - (c.height / 2);
}

window.onresize = () => {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
}

var keys = {};
window.addEventListener("keydown",
    function (e) {
        keys[e.key] = true;
    },
    false);

window.addEventListener('keyup',
    function (e) {
        keys[e.key] = false;
    },
    false);

setup();