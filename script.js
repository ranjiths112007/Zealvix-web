document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', newTheme);

            themeBtn.style.transform = "rotate(360deg)";
            setTimeout(() => {
                themeBtn.style.transform = "rotate(0deg)";
            }, 400);
        });
    }

    // --- 2. Mood Dock ---
    const moodBtns = document.querySelectorAll('.mood-btn');
    const root = document.documentElement;
    const palettes = {
        zealvix: ['#6A00FF', '#2E6BFF'],
        aqua:    ['#3FD0FF', '#2E6BFF'],
        iris:    ['#8A5BFF', '#6A00FF'],
        slate:   ['#C9D1FF', '#7A2DD8']
    };

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedMood = btn.getAttribute('data-mood');
            const colors = palettes[selectedMood];
            if (colors) {
                root.style.setProperty('--accent-1', colors[0]);
                root.style.setProperty('--accent-2', colors[1]);
                moodBtns.forEach(b => b.style.transform = 'scale(1)');
                btn.style.transform = 'scale(1.3)';
            }
        });
    });

    // --- 3. Scroll Reveal ---
    const animatedElements = document.querySelectorAll('.card, .founder-container, .portfolio-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // --- 4. Form Submission (AJAX, no page reload) ---
    const form = document.getElementById('contactForm');
    const formContainer = document.getElementById('formContainer');
    const successMessage = document.getElementById('successMessage');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const name = form.querySelector('[name="name"]').value.trim();
            const email = form.querySelector('[name="email"]').value.trim();
            const phone = form.querySelector('[name="phone"]').value.trim();
            const service = form.querySelector('[name="service"]').value;

            if (!name || !email || !phone || !service) {
                alert('Please fill in all fields before submitting.');
                return false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return false;
            }

            const btn = form.querySelector('.btn-submit');
            const originalText = btn.innerText;
            const formData = new FormData(form);

            // Append hidden fields for formsubmit
            formData.append('_captcha', 'false');
            formData.append('_subject', 'New Inquiry from Zealvix Website');
            formData.append('_template', 'table');

            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            fetch('https://formsubmit.co/ajax/team.zealvix@gmail.com', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(() => {
                setTimeout(() => {
                    formContainer.classList.add('form-hidden');
                    successMessage.style.display = 'flex';
                    form.reset();
                    btn.innerText = originalText;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 500);
            })
            .catch(error => {
                console.error('Submission error:', error);
                btn.innerText = 'Error. Try again.';
                btn.style.opacity = '1';
                btn.disabled = false;
                setTimeout(() => {
                    btn.innerText = originalText;
                }, 3000);
            });

            return false;
        });
    }

});
