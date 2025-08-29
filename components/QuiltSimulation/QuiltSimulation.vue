<template>
  <canvas ref="quiltCanvas" class="w-full h-full"></canvas>
</template>

<script>
export default {
  name: 'QuiltSimulation',
  mounted() {
    const canvas = this.$refs.quiltCanvas;
    const ctx = canvas.getContext('2d');

    // Set canvas to parent container size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight || 400; // Default height if parent has no height
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
        this.originalX = x;
        this.originalY = y;
      }
    }

    // Spring connecting particles
    class Spring {
      constructor(p1, p2, restLength) {
        this.p1 = p1;
        this.p2 = p2;
        this.restLength = restLength;
        this.stiffness = 0.08;
      }
    }

    // Quilt parameters - LARGER SQUARES
    const squareSize = 80; // Much larger squares for quilt effect
    const gridWidth = Math.ceil(canvas.width / squareSize) + 2;
    const gridHeight = Math.ceil(canvas.height / squareSize) + 2;
    const spacing = squareSize;
    const gravity = 0.1;
    const friction = 0.98;
    const windStrength = 0.3;
    const particles = [];
    const springs = [];
    
    // Traditional quilt colors and patterns
    const quiltPatterns = [
      { colors: ['#8B4789', '#DDA0DD', '#FFB6C1'], pattern: 'star' },
      { colors: ['#4682B4', '#87CEEB', '#F0F8FF'], pattern: 'diamond' },
      { colors: ['#228B22', '#90EE90', '#F0FFF0'], pattern: 'square' },
      { colors: ['#B22222', '#FA8072', '#FFF0F5'], pattern: 'triangle' },
      { colors: ['#DAA520', '#FFD700', '#FFFACD'], pattern: 'star' },
      { colors: ['#483D8B', '#6A5ACD', '#E6E6FA'], pattern: 'diamond' }
    ];

    // Create grid of particles
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const px = x * spacing - squareSize; // Offset to cover edges
        const py = y * spacing - squareSize;
        const pinned = y === 0 && x % 3 === 0; // Pin some top points
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
        // Diagonal springs for stability
        if (x < gridWidth - 1 && y < gridHeight - 1) {
          springs.push(new Spring(particles[i], particles[i + gridWidth + 1], spacing * Math.sqrt(2)));
        }
        if (x > 0 && y < gridHeight - 1) {
          springs.push(new Spring(particles[i], particles[i + gridWidth - 1], spacing * Math.sqrt(2)));
        }
      }
    }

    // Automatic movement variables
    let time = 0;
    let windTime = 0;

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

    // Draw traditional quilt pattern
    const drawQuiltPattern = (ctx, p1, p2, p3, p4, patternInfo) => {
      const centerX = (p1.x + p2.x + p3.x + p4.x) / 4;
      const centerY = (p1.y + p2.y + p3.y + p4.y) / 4;
      
      ctx.save();
      
      // Create clipping path
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.clip();
      
      // Background color
      ctx.fillStyle = patternInfo.colors[0];
      ctx.fill();
      
      // Draw pattern based on type
      if (patternInfo.pattern === 'star') {
        // Eight-pointed star pattern
        ctx.fillStyle = patternInfo.colors[1];
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8;
          const radius = i % 2 === 0 ? squareSize * 0.4 : squareSize * 0.2;
          const px = centerX + Math.cos(angle) * radius;
          const py = centerY + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        
        // Center detail
        ctx.fillStyle = patternInfo.colors[2];
        ctx.beginPath();
        ctx.arc(centerX, centerY, squareSize * 0.1, 0, Math.PI * 2);
        ctx.fill();
      } else if (patternInfo.pattern === 'diamond') {
        // Diamond pattern
        ctx.fillStyle = patternInfo.colors[1];
        ctx.beginPath();
        ctx.moveTo(centerX, p1.y + (centerY - p1.y) * 0.3);
        ctx.lineTo(p2.x - (p2.x - centerX) * 0.3, centerY);
        ctx.lineTo(centerX, p3.y - (p3.y - centerY) * 0.3);
        ctx.lineTo(p1.x + (centerX - p1.x) * 0.3, centerY);
        ctx.closePath();
        ctx.fill();
        
        // Inner diamond
        ctx.fillStyle = patternInfo.colors[2];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - squareSize * 0.15);
        ctx.lineTo(centerX + squareSize * 0.15, centerY);
        ctx.lineTo(centerX, centerY + squareSize * 0.15);
        ctx.lineTo(centerX - squareSize * 0.15, centerY);
        ctx.closePath();
        ctx.fill();
      } else if (patternInfo.pattern === 'square') {
        // Nested squares
        ctx.fillStyle = patternInfo.colors[1];
        ctx.fillRect(centerX - squareSize * 0.3, centerY - squareSize * 0.3, squareSize * 0.6, squareSize * 0.6);
        
        ctx.fillStyle = patternInfo.colors[2];
        ctx.fillRect(centerX - squareSize * 0.15, centerY - squareSize * 0.15, squareSize * 0.3, squareSize * 0.3);
      } else if (patternInfo.pattern === 'triangle') {
        // Triangle pinwheel
        const triangles = [
          { color: 1, points: [[p1.x, p1.y], [p2.x, p2.y], [centerX, centerY]] },
          { color: 2, points: [[p2.x, p2.y], [p3.x, p3.y], [centerX, centerY]] },
          { color: 1, points: [[p3.x, p3.y], [p4.x, p4.y], [centerX, centerY]] },
          { color: 2, points: [[p4.x, p4.y], [p1.x, p1.y], [centerX, centerY]] }
        ];
        
        triangles.forEach(tri => {
          ctx.fillStyle = patternInfo.colors[tri.color];
          ctx.beginPath();
          ctx.moveTo(tri.points[0][0], tri.points[0][1]);
          ctx.lineTo(tri.points[1][0], tri.points[1][1]);
          ctx.lineTo(tri.points[2][0], tri.points[2][1]);
          ctx.closePath();
          ctx.fill();
        });
      }
      
      ctx.restore();
      
      // Draw stitching lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Simulation update
    const update = () => {
      time += 0.016; // Assuming 60fps
      windTime += 0.02;
      
      // Generate gentle wind effect
      const windX = Math.sin(windTime) * windStrength;
      const windY = Math.cos(windTime * 0.7) * windStrength * 0.5;
      
      particles.forEach((p, index) => {
        if (!p.pinned) {
          // Apply gravity and wind
          const ax = windX * (1 + Math.sin(time + index * 0.1) * 0.2);
          const ay = gravity + windY * (1 + Math.cos(time + index * 0.1) * 0.2);
          
          // Add gentle wave motion
          const waveX = Math.sin(time * 2 + p.originalY * 0.01) * 0.5;
          const waveY = Math.cos(time * 1.5 + p.originalX * 0.01) * 0.3;
          
          p.vx = (p.x - p.prevX) * friction + ax + waveX;
          p.vy = (p.y - p.prevY) * friction + ay + waveY;

          // Apply mouse influence
          if (isMouseDown) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const distance = Math.hypot(dx, dy);
            const maxDistance = 150;
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
          
          // Gentle return to original position
          const returnForce = 0.001;
          p.x += (p.originalX - p.x) * returnForce;
          p.y += (p.originalY - p.y) * returnForce;
        }
      });

      // Update springs
      for (let i = 0; i < 3; i++) {
        springs.forEach(s => {
          const dx = s.p2.x - s.p1.x;
          const dy = s.p2.y - s.p1.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0) {
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
          }
        });
      }
    };

    // Render quilt
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw quilt patches with patterns
      for (let y = 0; y < gridHeight - 1; y++) {
        for (let x = 0; x < gridWidth - 1; x++) {
          const i = y * gridWidth + x;
          const p1 = particles[i];
          const p2 = particles[i + 1];
          const p3 = particles[i + gridWidth + 1];
          const p4 = particles[i + gridWidth];

          // Select pattern based on position
          const patternIndex = ((x + y * 2) % quiltPatterns.length);
          const patternInfo = quiltPatterns[patternIndex];
          
          drawQuiltPattern(ctx, p1, p2, p3, p4, patternInfo);
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
  width: 100%;
  height: 100%;
}
</style>