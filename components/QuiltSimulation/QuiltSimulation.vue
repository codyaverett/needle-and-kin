<template>
  <canvas ref="quiltCanvas"></canvas>
</template>

<script>
export default {
  name: 'QuiltSimulation',
  mounted() {
    const canvas = this.$refs.quiltCanvas;
    const ctx = canvas.getContext('2d');

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle system for fabric simulation
    class Particle {
      constructor(x, y, pinned = false) {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.vx = 0;
        this.vy = 0;
        this.pinned = pinned;
      }
    }

    // Spring connecting particles
    class Spring {
      constructor(p1, p2, restLength) {
        this.p1 = p1;
        this.p2 = p2;
        this.restLength = restLength;
        this.stiffness = 0.1;
      }
    }

    // Quilt parameters
    const gridWidth = Math.ceil(window.innerWidth / 30);
    const gridHeight = Math.ceil(window.innerHeight / 30);
    const spacing = Math.min(window.innerWidth / gridWidth, window.innerHeight / gridHeight);
    const gravity = 0.2;
    const friction = 0.99;
    const particles = [];
    const springs = [];
    const patchSize = spacing * 2;
    const colors = ['#8B5A2B', '#6B8E23', '#DEB887', '#A0522D', '#556B2F', '#F5F5DC', '#8B3A3A']; // Natural colors

    // Create grid of particles spanning full screen
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const px = x * spacing;
        const py = y * spacing;
        const pinned = y === 0; // Pin top row
        particles.push(new Particle(px, py, pinned));
      }
    }

    // Create springs between particles
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const i = y * gridWidth + x;
        if (x < gridWidth - 1) {
          springs.push(new Spring(particles[i], particles[i + 1], spacing));
        }
        if (y < gridHeight - 1) {
          springs.push(new Spring(particles[i], particles[i + gridWidth], spacing));
        }
      }
    }

    // Mouse interaction variables
    let mouseX = 0, mouseY = 0, prevMouseX = 0, prevMouseY = 0;
    let isMouseDown = false;

    // Update mouse position
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('mousedown', () => {
      isMouseDown = true;
    });

    canvas.addEventListener('mouseup', () => {
      isMouseDown = false;
    });

    // Simulation update
    const update = () => {
      particles.forEach(p => {
        if (!p.pinned) {
          // Apply gravity
          const ax = 0;
          const ay = gravity;
          p.vx = (p.x - p.prevX) * friction + ax;
          p.vy = (p.y - p.prevY) * friction + ay;

          // Apply mouse influence
          if (isMouseDown) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const distance = Math.hypot(dx, dy);
            const maxDistance = 100;
            if (distance < maxDistance) {
              const strength = (1 - distance / maxDistance) * 0.5;
              const mouseVX = mouseX - prevMouseX;
              const mouseVY = mouseY - prevMouseY;
              p.vx += mouseVX * strength;
              p.vy += mouseVY * strength;
            }
          }

          p.prevX = p.x;
          p.prevY = p.y;
          p.x += p.vx;
          p.y += p.vy;
        }
      });

      // Update springs
      for (let i = 0; i < 5; i++) {
        springs.forEach(s => {
          const dx = s.p2.x - s.p1.x;
          const dy = s.p2.y - s.p1.y;
          const distance = Math.hypot(dx, dy);
          const force = (distance - s.restLength) * s.stiffness;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          if (!s.p1.pinned) {
            s.p1.x += fx;
            s.p1.y += fy;
          }
          if (!s.p2.pinned) {
            s.p2.x -= fx;
            s.p2.y -= fy;
          }
        });
      }
    };

    // Render quilt
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw quilt patches
      for (let y = 0; y < gridHeight - 1; y++) {
        for (let x = 0; x < gridWidth - 1; x++) {
          const i = y * gridWidth + x;
          const p1 = particles[i];
          const p2 = particles[i + 1];
          const p3 = particles[i + gridWidth + 1];
          const p4 = particles[i + gridWidth];

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();

          // Assign color based on patch position
          const colorIndex = (x + y) % colors.length;
          ctx.fillStyle = colors[colorIndex];
          ctx.fill();

          // Add stitching effect
          ctx.strokeStyle = '#F5F5F5';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };

    // Animation loop
    const animate = () => {
      update();
      render();
      requestAnimationFrame(animate);
    };

    animate();
  }
};
</script>

<style scoped>
canvas {
  display: block;
  width: 100vw;
  height: 100vh;
}
</style>