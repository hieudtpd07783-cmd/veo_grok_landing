// ===== STARFIELD BACKGROUND =====
(() => {
  const canvas = document.getElementById("space");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0, height = 0, pointerX = 0, pointerY = 0;
  let stars = [];

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.max(90, Math.floor((width * height) / 12000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.7 + 0.35,
      a: Math.random() * 0.75 + 0.18,
      s: Math.random() * 0.25 + 0.05,
      hue: Math.random() > 0.72 ? 272 : 210,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const driftX = (pointerX / Math.max(width, 1) - 0.5) * 14;
    const driftY = (pointerY / Math.max(height, 1) - 0.5) * 10;
    for (const star of stars) {
      star.y += star.s;
      if (star.y > height + 8) { star.y = -8; star.x = Math.random() * width; }
      const twinkle = Math.sin((Date.now() * 0.001 + star.x) * 1.2) * 0.18;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${star.hue}, 100%, 78%, ${Math.max(0.08, star.a + twinkle)})`;
      ctx.arc(star.x + driftX, star.y + driftY, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", (e) => { pointerX = e.clientX; pointerY = e.clientY; }, { passive: true });
  resize();
  draw();
})();

// ===== FORM STEPPER BUTTONS =====
document.querySelectorAll('.stepper').forEach((stepper) => {
  const valEl = stepper.querySelector('.stepper-val');
  if (!valEl) return;
  const min = 1, max = 60;
  stepper.querySelectorAll('.stepper-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      let val = parseInt(valEl.textContent) || 10;
      if (i === 0 && val > min) { valEl.textContent = val - 1; }
      if (i === 1 && val < max) { valEl.textContent = val + 1; }
      // Update summary
      const summary = stepper.closest('.window-panel')?.querySelector('.summary-bar');
      if (summary) {
        const total = parseInt(valEl.textContent) * 8;
        summary.innerHTML = `⚡ Tổng ~<strong>${total}s</strong> (<strong>${valEl.textContent}</strong> cảnh × <strong>8s</strong>)`;
      }
    });
  });
});

// ===== PARALLAX FLOATING BADGES ON MOUSE MOVE =====
const badges = document.querySelectorAll('.floating-badge');
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  badges.forEach((badge, i) => {
    const factor = (i + 1) * 3;
    badge.style.transform = `translateY(${Math.sin(Date.now() * 0.001 + i) * 8}px) translateX(${x * factor}px)`;
  });
}, { passive: true });

// ===== TOOL WINDOW TILT ON HOVER =====
const toolWindow = document.querySelector('.tool-window');
if (toolWindow) {
  toolWindow.addEventListener('mousemove', (e) => {
    const rect = toolWindow.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    toolWindow.style.transform = `rotateY(${dx * -8}deg) rotateX(${dy * 5}deg) scale(1.01)`;
  });
  toolWindow.addEventListener('mouseleave', () => {
    toolWindow.style.transform = '';
  });
}

// ===== NAV ACTIVE LINK =====
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--accent)';
    }
  });
}, { passive: true });

// ===== CONTACT FORM SUBMISSION =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // THAY ĐỔI URL DƯỚI ĐÂY BẰNG URL GOOGLE APPS SCRIPT CỦA BẠN
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHzgQ9C3keI0AHMwIG54drPsipxoa1lhw28a6c66Y8Qe5kX-AMs7qaUcfaq6Q1E-xDOA/exec";
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const formMessage = document.getElementById('form-message');
    
    // Show loading
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';
    
    const formData = new FormData(contactForm);
    
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Use no-cors to avoid CORS issues with simple Google Apps Script setups
      });
      
      // Because of no-cors, we can't read the exact response, but if fetch didn't throw, it likely succeeded.
      formMessage.textContent = 'Gửi thông tin thành công! Chúng tôi sẽ liên hệ lại sớm nhất.';
      formMessage.classList.add('success');
      formMessage.style.display = 'block';
      contactForm.reset();
      
    } catch (error) {
      console.error('Error!', error.message);
      formMessage.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp Zalo.';
      formMessage.classList.add('error');
      formMessage.style.display = 'block';
    } finally {
      // Reset button
      btnText.style.display = 'inline-block';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });
}
