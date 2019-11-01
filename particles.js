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