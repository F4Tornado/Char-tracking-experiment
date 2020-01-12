class Particle {
    constructor(x, y, r/*rotation*/, v/*velocity*/, c/*color*/, t/*time*/) {
        this.pos = {}
        this.pos.x = x;
        this.pos.y = y;
        this.t = t + performance.now();
        this.pos.v = {};
        let coords = polarToCart(r, v);
        this.pos.v.x = coords[0];
        this.pos.v.y = coords[1];
        this.c = c;
    }

    show() {
        draw.fillStyle = this.c;
        draw.beginPath();
        draw.arc(this.pos.x - viewport.x, this.pos.y - viewport.y, c.width / 512, 0, Math.PI * 2);
        draw.fill()

        this.pos.x += this.pos.v.x;
        this.pos.y += this.pos.v.y;
        this.pos.v.x *= 0.95;
        this.pos.v.y *= 0.95;

        if (performance.now() > this.t) {
            return "SPLIIIIIIIIIIIIIIICE";
        }
    }
}

class Circle {
    constructor(x, y, r/*radius to end*/, c/*color*/, t/*time*/, w/*width to start*/) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = c;
        this.startT = performance.now();
        this.t = t;
        this.w = w;
    }

    show() {
        if (performance.now() >= this.t + this.startT) {
            return "splois";
        }

        draw.strokeStyle = this.c;
        draw.lineWidth = (1 - (performance.now() - this.startT) / this.t) * this.w;
        let r = Math.max(this.r * ((performance.now() - this.startT) / this.t), 0);
        draw.beginPath();
        draw.arc(this.x - viewport.x, this.y - viewport.y, r, 0, Math.PI * 2);
        draw.stroke();
    }
}