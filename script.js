document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const counter = document.getElementById('slide-counter');
    const progress = document.getElementById('progress');

    let currentSlide = 0;

    function goToSlide(index) {
        currentSlide = index;
        const slide = slides[currentSlide];
        
        // Hide fragments when directly jumping to a slide
        const fragments = slide.querySelectorAll('.fragment');
        fragments.forEach(f => f.classList.remove('visible'));
        slide.dataset.currentFragment = -1;
        
        updateView();
    }

    function init() {
        const dotsContainer = document.getElementById('dots-container');

        slides.forEach((slide, index) => {
            const fragments = slide.querySelectorAll('.fragment');
            slide.dataset.currentFragment = -1;
            slide.dataset.totalFragments = fragments.length;
            
            // Generate dot button
            if (dotsContainer) {
                const dot = document.createElement('button');
                dot.classList.add('dot-btn');
                dot.title = `Aller à la slide ${index + 1}`;
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToSlide(index);
                });
                dotsContainer.appendChild(dot);
            }
            
            // Allow clicking anywhere to go next if it's the active slide
            slide.addEventListener('click', (e) => {
                // Don't trigger if they clicked a button
                if (!e.target.closest('.nav-btn')) {
                    if (index === currentSlide) {
                        next();
                    }
                }
            });
        });
        updateView();
    }

    function updateView() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });

        btnPrev.disabled = currentSlide === 0 && slides[currentSlide].dataset.currentFragment == -1;
        btnNext.disabled = currentSlide === slides.length - 1 && isLastFragment();
        
        counter.textContent = `${currentSlide + 1} / ${slides.length}`;
        
        // Update dots visual state
        const dots = document.querySelectorAll('.dot-btn');
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function isLastFragment() {
        const slide = slides[currentSlide];
        if (!slide) return true;
        const currentFrag = parseInt(slide.dataset.currentFragment);
        const totalFrag = parseInt(slide.dataset.totalFragments);
        return currentFrag >= totalFrag - 1;
    }

    function next() {
        const slide = slides[currentSlide];
        let currentFrag = parseInt(slide.dataset.currentFragment);
        const totalFrag = parseInt(slide.dataset.totalFragments);

        if (currentFrag < totalFrag - 1) {
            // Show next fragment
            currentFrag++;
            slide.dataset.currentFragment = currentFrag;
            const fragments = slide.querySelectorAll('.fragment');
            if (fragments[currentFrag]) {
                fragments[currentFrag].classList.add('visible');
            }
            updateView();
        } else if (currentSlide < slides.length - 1) {
            // Go to next slide
            currentSlide++;
            updateView();
        }
    }

    function prev() {
        const slide = slides[currentSlide];
        let currentFrag = parseInt(slide.dataset.currentFragment);

        if (currentFrag >= 0) {
            // Hide current fragment
            const fragments = slide.querySelectorAll('.fragment');
            if (fragments[currentFrag]) {
                fragments[currentFrag].classList.remove('visible');
            }
            slide.dataset.currentFragment = currentFrag - 1;
            updateView();
        } else if (currentSlide > 0) {
            // Go to prev slide
            currentSlide--;
            const prevSlide = slides[currentSlide];
            const prevFragments = prevSlide.querySelectorAll('.fragment');
            // Show all fragments on the slide we go back to
            prevFragments.forEach(f => f.classList.add('visible'));
            prevSlide.dataset.currentFragment = prevFragments.length - 1;
            updateView();
        }
    }

    // Control Buttons
    btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        next();
    });
    
    btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prev();
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
            e.preventDefault();
            next();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
            e.preventDefault();
            prev();
        }
    });

    init();
    initParticles();
    initDiscussionQuestions();

    // --- Futuristic Agentic Particle System for Slide 1 ---
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let mouse = {
            x: null,
            y: null,
            radius: 150 // Area of influence around cursor
        };

        window.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        const particles = [];
        const numParticles = 60; // How many agent dots
        
        // Convert hex #CF0063 to RGB for transparency usage
        const pinkR = 207;
        const pinkG = 0;
        const pinkB = 99;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() * 2 - 1) * 0.5;
                this.vy = (Math.random() * 2 - 1) * 0.5;
                this.size = Math.random() * 2 + 1.5;
                this.pulseTimer = Math.random() * Math.PI * 2;
            }

            update() {
                // Interactive mouse physics
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        
                        // Inverse proportion based on distance (closer = stronger push)
                        const force = (mouse.radius - distance) / mouse.radius;
                        
                        // Push force strength is 5
                        const directionX = forceDirectionX * force * 5;
                        const directionY = forceDirectionY * force * 5;
                        
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges smoothly
                if (this.x < 0) { this.x = 0; this.vx *= -1; }
                if (this.x > canvas.width) { this.x = canvas.width; this.vx *= -1; }
                if (this.y < 0) { this.y = 0; this.vy *= -1; }
                if (this.y > canvas.height) { this.y = canvas.height; this.vy *= -1; }
                
                this.pulseTimer += 0.05;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const currentOpacity = 0.4 + Math.sin(this.pulseTimer) * 0.3;
                ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity + 0.3})`;
                ctx.fill();
                
                // Add soft pink glow around particles
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgba(${pinkR}, ${pinkG}, ${pinkB}, 0.8)`;
                ctx.fill();
                ctx.shadowBlur = 0; // reset
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        // Keep track of data packets flowing between nodes
        const packets = [];

        function animate() {
            // Clear with slight transparency for trail effect
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw connecting lines
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 160) {
                        ctx.beginPath();
                        const opacity = 1 - (distance / 160);
                        ctx.strokeStyle = `rgba(${pinkR}, ${pinkG}, ${pinkB}, ${opacity * 0.6})`;
                        ctx.lineWidth = opacity * 1.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();

                        // Chance to spawn a data packet
                        if (Math.random() > 0.995) {
                            packets.push({
                                start: particles[i],
                                end: particles[j],
                                progress: 0,
                                speed: Math.random() * 0.02 + 0.01
                            });
                        }
                    }
                }
            }

            // Animate and draw packets
            for (let i = packets.length - 1; i >= 0; i--) {
                const pkt = packets[i];
                pkt.progress += pkt.speed;
                if (pkt.progress >= 1) {
                    packets.splice(i, 1);
                    continue;
                }
                
                const curX = pkt.start.x + (pkt.end.x - pkt.start.x) * pkt.progress;
                const curY = pkt.start.y + (pkt.end.y - pkt.start.y) * pkt.progress;
                
                ctx.beginPath();
                ctx.arc(curX, curY, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#ffffff';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    function initDiscussionQuestions() {
        const canvas = document.getElementById('discussion-canvas');
        if (!canvas) return;

        const slide = canvas.closest('.discussion-slide');
        const ctx = canvas.getContext('2d');
        const marks = [];
        const mouse = {
            x: null,
            y: null,
            radius: 190
        };
        const colors = [
            'rgba(255, 255, 255, 0.92)',
            'rgba(245, 180, 212, 0.9)',
            'rgba(164, 201, 255, 0.88)'
        ];

        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }

        class QuestionMark {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.size = 44 + Math.random() * 60;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() * 2 - 1) * 0.7;
                this.vy = (Math.random() * 2 - 1) * 0.7;
                this.rotation = Math.random() * Math.PI * 2;
                this.spin = (Math.random() * 2 - 1) * 0.012;
                this.symbol = '?';
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = initial ? 0.55 + Math.random() * 0.32 : 0.78;
            }

            update() {
                this.vx += (Math.random() * 2 - 1) * 0.045;
                this.vy += (Math.random() * 2 - 1) * 0.045;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.hypot(dx, dy) || 1;
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.vx += (dx / distance) * force * 1.2;
                        this.vy += (dy / distance) * force * 1.2;
                        this.spin += (Math.random() * 2 - 1) * 0.016;
                    }
                }

                this.vx *= 0.992;
                this.vy *= 0.992;
                this.spin *= 0.996;
                this.rotation += this.spin;
                this.x += this.vx;
                this.y += this.vy;

                const padding = this.size * 0.35;
                if (this.x < padding) {
                    this.x = padding;
                    this.vx *= -1;
                }
                if (this.x > canvas.width - padding) {
                    this.x = canvas.width - padding;
                    this.vx *= -1;
                }
                if (this.y < padding) {
                    this.y = padding;
                    this.vy *= -1;
                }
                if (this.y > canvas.height - padding) {
                    this.y = canvas.height - padding;
                    this.vy *= -1;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = `700 ${this.size}px Inter, sans-serif`;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 24;
                ctx.shadowColor = 'rgba(207, 0, 99, 0.34)';
                ctx.globalAlpha = this.opacity;
                ctx.fillText(this.symbol, 0, 0);
                ctx.shadowBlur = 0;
                ctx.strokeStyle = 'rgba(15, 16, 24, 0.58)';
                ctx.lineWidth = 2;
                ctx.strokeText(this.symbol, 0, 0);
                ctx.restore();
            }
        }

        function handlePointerMove(event) {
            const rect = canvas.getBoundingClientRect();
            const insideX = event.clientX >= rect.left && event.clientX <= rect.right;
            const insideY = event.clientY >= rect.top && event.clientY <= rect.bottom;

            if (!insideX || !insideY || !slide.classList.contains('active')) {
                mouse.x = null;
                mouse.y = null;
                return;
            }

            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        for (let i = 0; i < 34; i++) {
            marks.push(new QuestionMark());
        }

        function animateDiscussion() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (slide.classList.contains('active')) {
                for (const mark of marks) {
                    mark.update();
                    mark.draw();
                }
            }

            requestAnimationFrame(animateDiscussion);
        }

        animateDiscussion();
    }
});
