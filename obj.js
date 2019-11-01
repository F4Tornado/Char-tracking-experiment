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
        palette.foreground();

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

        let moveSpeed = 0.7

        if (keys["ArrowUp"]) {
            let addV = polarToCart(this.pos.r, moveSpeed);
            this.pos.v.x += addV[0];
            this.pos.v.y += addV[1];
            moving = true;
        }
        if (keys["ArrowDown"]) {
            this.pos.v.x *= 0.85;
            this.pos.v.y *= 0.85;
        }

        let turnSpeed = 0.02

        if (keys["ArrowRight"]) {
            this.pos.v.r += turnSpeed;
            if (moving) {
                this.pos.v.r -= turnSpeed / 2;
            }
        }
        if (keys["ArrowLeft"]) {
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

class Enemy {
    constructor() {
        this.pos = {};
        this.pos.x = player.pos.x + Math.random() * c.width * 2 - c.width;
        this.pos.y = player.pos.y + Math.random() * c.width * 2 - c.width;
        this.pos.v = {};
        this.pos.v.x = 0;
        this.pos.v.y = 0;
        this.dead = 0;
    }
    show() {
        draw.fillStyle = `hsla(0, 100%, ${100 - this.dead}%, ${1 - this.dead / 50})`

        let r = Math.atan2((player.pos.y - this.pos.y), (player.pos.x - this.pos.x));
        let r3 = Math.atan2((this.pos.y - player.pos.y), (this.pos.x - player.pos.x));
        let d = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);

        // draw.font = "20px Arial";
        // draw.textAlign = "center";
        // draw.fillText(Math.abs(player.pos.r - arc.width / 2 + r) + Math.abs(player.pos.r + arc.width / 2 + r) == arc.width, this.pos.x - viewport.x, this.pos.y - viewport.y - 30);
        draw.beginPath();
        let a = polarToCart(player.pos.r % (Math.PI * 2) - arc.width / 2, 100);
        let b = polarToCart(player.pos.r % (Math.PI * 2) + arc.width / 2, 100);
        draw.arc(a[0] + player.pos.x - viewport.x, a[1] + player.pos.y - viewport.y, 10, 0, Math.PI * 2);
        draw.arc(b[0] + player.pos.x - viewport.x, b[1] + player.pos.y - viewport.y, 10, 0, Math.PI * 2);
        draw.fill();
        if (d <= (c.width / arc.d) + 12 && d >= (c.width / arc.d) - 12 && Math.abs(player.pos.r % (Math.PI * 2) - arc.width / 2 + r) + Math.abs(player.pos.r % (Math.PI * 2) + arc.width / 2 + r) == arc.width) {
            // draw.fillStyle = "#ff0000";
            if (this.dead == 0) {
                this.dead = 1;
            }
        }

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