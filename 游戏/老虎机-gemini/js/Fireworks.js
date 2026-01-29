export class Fireworks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isRunning = false;
        
        this.init();
    }

    init() {
        this.canvas.id = 'fireworks-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '99'; 
        
        document.body.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.launch();
        if (!this.isRunning) {
            this.isRunning = true;
            this.loop();
        }
    }

    stop(immediate = false) {
        this.isRunning = false;
        
        if (immediate) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles = [];
        }
    }

    launch() {
        // 正中间
        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;
        this.createExplosion(x, y);
    }

    createExplosion(x, y) {
        const particleCount = 100;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    loop() {
        if (this.particles.length === 0) {
            this.isRunning = false;
            // 彻底清空画布，防止残留
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }
        
        requestAnimationFrame(() => this.loop());
        
        // Clear with trail effect
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'lighter';
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.draw(this.ctx);
            
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.1;
        this.friction = 0.95;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
