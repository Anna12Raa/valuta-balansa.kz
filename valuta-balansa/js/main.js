document.addEventListener('DOMContentLoaded', () => {
    // === HEADER SCROLL ===
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Header shadow
        header.classList.toggle('scrolled', scrollY > 50);

        // Scroll progress bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';

        // Back to top button
        backToTop.classList.toggle('visible', scrollY > 500);
    });

    // Back to top
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === BURGER MENU ===
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
    });

    // Close menu on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('open');
        });
    });

    // === ACTIVE NAV ON SCROLL ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // === TABS ===
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // === FADE IN ON SCROLL (Intersection Observer) ===
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // === FORM VALIDATION & SUBMISSION ===
    const form = document.getElementById('feedbackForm');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            // Validate name
            const name = form.querySelector('#name');
            const nameGroup = name.closest('.form-group');
            if (!name.value.trim()) {
                nameGroup.classList.add('error');
                valid = false;
            } else {
                nameGroup.classList.remove('error');
            }

            // Validate email
            const email = form.querySelector('#email');
            const emailGroup = email.closest('.form-group');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                emailGroup.classList.add('error');
                valid = false;
            } else {
                emailGroup.classList.remove('error');
            }

            // Validate message
            const message = form.querySelector('#message');
            const messageGroup = message.closest('.form-group');
            if (!message.value.trim()) {
                messageGroup.classList.add('error');
                valid = false;
            } else {
                messageGroup.classList.remove('error');
            }

            if (valid) {
                const submitBtn = form.querySelector('.btn-submit');
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;

                // Собираем данные из формы
                const formData = new FormData(form);

                // Отправляем данные на почту
                fetch('https://valuta-balansa.kz/php/send.php', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "true" || data.success === true) {
                        submitBtn.textContent = 'Отправлено ✓';
                        submitBtn.classList.add('success');
                        formSuccess.classList.add('show');

                        setTimeout(() => {
                            form.reset();
                            submitBtn.textContent = 'Отправить';
                            submitBtn.classList.remove('success');
                            submitBtn.disabled = false;
                            formSuccess.classList.remove('show');
                            form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
                        }, 5000);
                    } else {
                        throw new Error('Ошибка сервера');
                    }
                })
                .catch(error => {
                    submitBtn.textContent = 'Ошибка отправки';
                    submitBtn.disabled = false;
                    alert('Произошла ошибка при отправке. Пожалуйста, напишите нам в WhatsApp.');
                });
            }
        });

        // Remove error on focus
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', () => {
                input.closest('.form-group').classList.remove('error');
            });
        });
    }
});
