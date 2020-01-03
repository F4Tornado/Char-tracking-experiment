class Player {
    constructor() {
        this.pos = {};
        this.pos.x = 0;
        this.pos.y = 0;
        this.pos.r = 0;
        this.pos.v = {};
        this.pos.v.x = 0;
        this.pos.v.y = 0;
        this.pos.v.r = 0;
        this.trail = [{ x: 0, y: 0, t: performance.now() + 5000 }];
    }

    update() {
        draw.fillStyle = `hsl(0, 100%, ${(lives / 3) * 50 + 50}%)`;

        draw.strokeStyle = palette.exhaustColor;
        draw.lineWidth = 4;
        draw.beginPath();
        draw.moveTo(this.trail[this.trail.length - 1].x - viewport.x, this.trail[this.trail.length - 1].y - viewport.y);
        for (let i = this.trail.length - 2; i >= 0; i--) {
            draw.lineTo(this.trail[i].x - viewport.x, this.trail[i].y - viewport.y);
            if (this.trail[i].t < performance.now()) {
                this.trail.splice(i, 1);
            }
        }
        draw.stroke()

        draw.beginPath();
        let scale = 0.75;
        this.p1 = polarToCart(Math.PI / 2 + this.pos.r - Math.PI / 2, c.width / (24 / scale));
        this.p2 = polarToCart(-Math.PI / 3 + this.pos.r - Math.PI / 2, c.width / (32 / scale));
        this.p3 = polarToCart(-Math.PI / 2 + this.pos.r - Math.PI / 2, c.width / (64 / scale));
        this.p4 = polarToCart(-Math.PI / 1.5 + this.pos.r - Math.PI / 2, c.width / (32 / scale));
        let p1 = this.p1;
        let p2 = this.p2;
        let p3 = this.p3;
        let p4 = this.p4;
        draw.moveTo(p1[0] + this.pos.x - viewport.x, p1[1] + this.pos.y - viewport.y);
        draw.lineTo(p2[0] + this.pos.x - viewport.x, p2[1] + this.pos.y - viewport.y);
        draw.lineTo(p3[0] + this.pos.x - viewport.x, p3[1] + this.pos.y - viewport.y);
        draw.lineTo(p4[0] + this.pos.x - viewport.x, p4[1] + this.pos.y - viewport.y);
        draw.fill();
        this.pos.x += this.pos.v.x;
        this.pos.y += this.pos.v.y;
        this.pos.r += this.pos.v.r;
        this.pos.v.x *= 0.95;
        this.pos.v.y *= 0.95;
        this.pos.v.r *= 0.8;

        this.trail.push({ x: this.p3[0] + this.pos.x, y: this.p3[1] + this.pos.y, t: performance.now() + 5000 });

        let moving = false;

        let moveSpeed = 0.7;

        if (lives !== 0) {
            if (keys["ArrowUp"] || keys["w"]) {
                let addV = polarToCart(this.pos.r, moveSpeed);
                this.pos.v.x += addV[0];
                this.pos.v.y += addV[1];
                moving = true;
            }
            if (keys["ArrowDown"] || keys["s"]) {
                this.pos.v.x *= 0.85;
                this.pos.v.y *= 0.85;
            }

            let turnSpeed = 0.02

            if (keys["ArrowRight"] || keys["d"]) {
                this.pos.v.r += turnSpeed;
                if (moving) {
                    this.pos.v.r -= turnSpeed / 2;
                }
            }
            if (keys["ArrowLeft"] || keys["a"]) {
                this.pos.v.r -= turnSpeed;
                if (moving) {
                    this.pos.v.r += turnSpeed / 2;
                }
            }

            for (let i = 0; i < 16; i++) {
                if (moving) {
                    particles.push(new Particle(this.p3[0] + this.pos.x, this.p3[1] + this.pos.y, this.pos.r + (Math.random() - 0.5) * 0.5 + Math.PI, 8 * Math.random(), `hsl(${Math.random() * 51}, 100%, 50%)`, 2000));
                }
            }
        }
    }
}

class Enemy {
    constructor() {
        this.pos = {};
        this.pos.x = player.pos.x + Math.random() * c.width * 2 - c.width;
        this.pos.y = player.pos.y + Math.random() * c.width * 2 - c.width;
        while (dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y) < c.width) {
            this.pos.x = player.pos.x + Math.random() * c.width * 2 - c.width;
            this.pos.y = player.pos.y + Math.random() * c.width * 2 - c.width;
        }
        this.pos.v = {};
        this.pos.v.x = 0;
        this.pos.v.y = 0;
        this.dead = 0;
    }
    show() {
        draw.fillStyle = `hsla(0, 100%, ${100 - this.dead}%, ${1 - this.dead / 50})`

        let r = Math.atan2((player.pos.y - this.pos.y), (player.pos.x - this.pos.x));

        // draw.font = "20px Arial";
        // draw.textAlign = "center";
        // draw.fillText(Math.abs(player.pos.r - arc.width / 2 + r) + Math.abs(player.pos.r + arc.width / 2 + r) == arc.width, this.pos.x - viewport.x, this.pos.y - viewport.y - 30);
        let a1 = [(normalAngle(player.pos.r, true) - (arc.width / 2)), c.width / arc.d],
            b1 = [(normalAngle(player.pos.r, true) + (arc.width / 2)), c.width / arc.d],
            c1 = cartToPolar(this.pos.x - player.pos.x, this.pos.y - player.pos.y),
            a = polarToCart(normalAngle(a1[0]), a1[1]),
            b = polarToCart(normalAngle(b1[0]), b1[1]);
        if (b1[0] < a1[0]) {
            b1[0] += 2 * Math.PI
        };
        if (c1[0] < a1[0] && c1[0] < b1[0]) {
            c1[0] += 2 * Math.PI
        }
        if (c1[0] > a1[0] && c1[0] < a1[0] + arc.width && c1[1] > c.width / arc.d - 8 - arc.size / 2 && c1[1] < c.width / arc.d + 8 + arc.size / 2) {
            if (this.dead == 0) {
                this.dead = 1;
                draw.fillStyle = "hsla(177, 100%, 66%, 0.7)";
                draw.beginPath();
                let p = polarToCart(c1[0], c.width / arc.d);
                draw.arc(p[0], p[1], 16, 0, Math.PI * 2);
                draw.fill()
                console.log("something died");
            }
        }

        if (pointInPoly([this.pos.x, this.pos.y], [[player.p1[0] + player.pos.x, player.p1[1] + player.pos.y], [player.p2[0] + player.pos.x, player.p2[1] + player.pos.y], [player.p3[0] + player.pos.x, player.p3[1] + player.pos.y], [player.p4[0] + player.pos.x, player.p4[1] + player.pos.y]]) && this.dead == 0) {
            this.dead = 1;
            let r = Math.atan2(this.pos.v.y, this.pos.v.x);
            let d = dist(0, 0, this.pos.v.x, this.pos.v.y);
            player.pos.v.x += (this.pos.v.x - player.pos.v.x) / 40;
            player.pos.v.y += (this.pos.v.y - player.pos.v.y) / 40;
            for (let i = 0; i < 20; i++) {
                particles.push(new Particle(this.pos.x, this.pos.y, r + (Math.random() - 0.5) / 2, d + 5, `hsl(0, 100%, ${(lives / 3) * 50 + 50}%)`, 2000 + Math.random() * 200));
            }
            if (lives !== 0) {
                lives--;
            }
        }
        // if (d <= (c.width / arc.d) + 12 && d >= (c.width / arc.d) - 12 && Math.abs(player.pos.r % (Math.PI * 2) - arc.width / 2 + r) + Math.abs(player.pos.r % (Math.PI * 2) + arc.width / 2 + r) == arc.width) {
        // draw.fillStyle = "#ff0000";
        // if (this.dead == 0) {
        //     this.dead = 1;
        // }
        // }

        draw.beginPath();
        draw.arc(this.pos.x - viewport.x, this.pos.y - viewport.y, 8, 0, Math.PI * 2);
        draw.fill();

        let r2 = polarToCart(r, 0.5);
        if (this.dead == 0) {
            this.pos.v.x += r2[0];
            this.pos.v.y += r2[1];
        } else if (this.dead <= 50) {
            this.dead++;
        } else {
            return "SPLOOOOSE";
        }
        this.pos.x += this.pos.v.x;
        this.pos.y += this.pos.v.y;
        this.pos.v.x *= 0.98;
        this.pos.v.y *= 0.98;
    }
}

function pointInPoly(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};