// --- 1. BACKGROUND PARTICLE CANVAS (mouse interactive) ---
const canvas = document.getElementById('tech-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = 80;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.baseColor = Math.random() > 0.5 ? '230, 165, 88' : '87, 217, 179';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (mouse.x !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                this.x += (dx / dist) * force * 2.2;
                this.y += (dy / dist) * force * 2.2;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.baseColor}, 0.85)`;
        ctx.shadowBlur = 7;
        ctx.shadowColor = `rgba(${this.baseColor}, 0.7)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(230, 165, 88, ${1 - dist / 120})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// --- 2. TYPING EFFECT FOR HERO EYEBROW ---
const typingElement = document.getElementById('typing-text');
const typingText = "// aspiring web developer";
let charIndex = 0;

function typeEffect() {
    if (charIndex < typingText.length) {
        typingElement.textContent += typingText.charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 55);
    }
}
window.addEventListener('DOMContentLoaded', typeEffect);

// --- 3. SCROLL REVEAL (alternating direction via classes already on elements) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- 4. CLICK RIPPLE ---
document.addEventListener('click', function (e) {
    let ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)';
    ripple.style.borderRadius = '50%';
    ripple.style.left = `${e.clientX - 10}px`;
    ripple.style.top = `${e.clientY - 10}px`;
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'all 0.6s ease-out';
    ripple.style.zIndex = '9999';
    document.body.appendChild(ripple);
    setTimeout(() => {
        ripple.style.transform = 'scale(8)';
        ripple.style.opacity = '0';
    }, 10);
    setTimeout(() => { ripple.remove(); }, 600);
});

// --- 5. MOBILE MENU ---
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-list');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// --- 6. TOAST HELPER + CLICK TO COPY ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2600);
}

function copyText(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${label} Copied!`);
    }).catch(err => {
        console.error('Copy failed: ', err);
    });
}

// --- 6b. MAKE ALL ICONS FEEL CLICKABLE (pop feedback on tap) ---
document.querySelectorAll('.icon-btn').forEach(el => {
    el.addEventListener('click', function () {
        this.classList.remove('pop');
        void this.offsetWidth; // restart animation
        this.classList.add('pop');
    });
});

// --- 7. EMAILJS CONTACT FORM ---
// NOTE: replace with your own EmailJS public key, service ID and template ID
// from https://www.emailjs.com before this form will actually send messages.
(function () {
    emailjs.init("VxThDGOFaXH2_grCt");
})();

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const btn = this.querySelector('button');
    const btnLabel = btn.querySelector('span');
    const originalLabel = btnLabel.innerText;
    btnLabel.innerText = "Sending...";
    btn.disabled = true;

    emailjs.sendForm('service_v7q9yrq', 'template_sc822ro', this)
        .then(function () {
            btnLabel.innerText = "Message Sent!";
            document.getElementById('contact-form').reset();
            setTimeout(function () {
                btnLabel.innerText = originalLabel;
                btn.disabled = false;
            }, 2500);
        }, function (error) {
            alert('Failed to send. Please try again in a moment.');
            console.log('FAILED...', error);
            btnLabel.innerText = originalLabel;
            btn.disabled = false;
        });
});

// --- 8. CERTIFICATE MODAL ---
function openCertModal(imgSrc) {
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('cert-modal-img');
    modalImg.src = imgSrc;
    modal.classList.add('show');
}

function closeCertModal() {
    document.getElementById('cert-modal').classList.remove('show');
}

document.getElementById('cert-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeCertModal();
    }
});
