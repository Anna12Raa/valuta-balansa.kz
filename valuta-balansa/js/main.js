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
    // === HERO STATS COUNTER ANIMATION ===
    const statCounters = document.querySelectorAll('.hero__stats b[data-count]');
    if (statCounters.length > 0) {
        statCounters.forEach(el => {
            const target = +el.dataset.count;
            const suffix = el.dataset.suffix || '';
            const duration = 1200;
            const startTime = performance.now();
            const updateCounter = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const val = Math.floor(progress * target);
                el.textContent = val + suffix;
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = target + suffix;
                }
            };
            requestAnimationFrame(updateCounter);
        });
    }

    // === HERO CALCULATOR LOGIC ===
    const calcCard = document.querySelector('.hero-calc');
    if (calcCard) {
        const BASE = {
            ip: {
                special: { name: 'Спецрежим (упрощёнка)', price: 75000 },
                general: { name: 'Общеустановленный (ОУР)', price: 135000 }
            },
            too: {
                special: { name: 'Спецрежим (упрощёнка)', price: 85000 },
                general: { name: 'Общеустановленный (ОУР)', price: 155000 }
            }
        };
        const state = { form: 'ip', mode: 'special' };

        const cEmp = document.getElementById('calcEmp');
        const empOut = document.getElementById('empOut');
        const totalOut = document.getElementById('calcTotal');
        const chips = document.querySelectorAll('.hero-calc-chip input');
        const calcOrderBtn = document.getElementById('calcOrderBtn');
        const calcWaBtn = document.getElementById('calcWaBtn');

        const fmt = n => n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');

        const calc = () => {
            const baseInfo = BASE[state.form][state.mode];
            let sum = baseInfo.price;
            const emp = parseInt(cEmp.value, 10) || 1;
            empOut.textContent = emp;

            // Стилизация заполненной части ползунка
            const min = +cEmp.min || 1;
            const max = +cEmp.max || 30;
            const pct = ((emp - min) / (max - min)) * 100;
            cEmp.style.background = `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`;

            // Доплата за сотрудников свыше 5
            let extraEmpCost = 0;
            if (emp > 5) {
                extraEmpCost = (emp - 5) * 5000;
                sum += extraEmpCost;
            }

            // Дополнительные опции
            const selectedExtras = [];
            chips.forEach(chip => {
                if (chip.checked) {
                    const add = parseInt(chip.dataset.add, 10) || 0;
                    sum += add;
                    const name = chip.dataset.name || chip.parentElement.textContent.trim();
                    selectedExtras.push(`${name} (+${fmt(add)} ₸)`);
                }
            });

            totalOut.textContent = fmt(sum) + ' ₸';

            // Формирование текста для WhatsApp
            const formName = state.form === 'ip' ? 'ИП' : 'ТОО';
            const modeName = baseInfo.name;
            const extrasText = selectedExtras.length > 0 ? selectedExtras.join(', ') : 'без доп. опций';

            const waMessage = `Здравствуйте! Меня интересует бухгалтерское сопровождение:\n` +
                `• Форма: ${formName}\n` +
                `• Режим: ${modeName}\n` +
                `• Сотрудников: ${emp}\n` +
                `• Доп. услуги: ${extrasText}\n` +
                `• Расчётная стоимость: ${fmt(sum)} ₸/мес.\n` +
                `Хочу получить консультацию.`;

            if (calcWaBtn) {
                calcWaBtn.href = `https://wa.me/77012044844?text=${encodeURIComponent(waMessage)}`;
            }

            return {
                formName,
                modeName,
                emp,
                selectedExtras,
                total: sum
            };
        };

        // Переключение табов формы (ИП / ТОО)
        const formBtns = document.querySelectorAll('#segForm .hero-calc-seg-btn');
        formBtns.forEach(b => {
            b.addEventListener('click', () => {
                formBtns.forEach(x => x.classList.remove('is-active'));
                b.classList.add('is-active');
                state.form = b.dataset.form;
                calc();
            });
        });

        // Переключение табов налогового режима (Спецрежим / Общеустановленный)
        const modeBtns = document.querySelectorAll('#segMode .hero-calc-seg-btn');
        modeBtns.forEach(b => {
            b.addEventListener('click', () => {
                modeBtns.forEach(x => x.classList.remove('is-active'));
                b.classList.add('is-active');
                state.mode = b.dataset.mode;
                calc();
            });
        });

        // Слушатели событий слайдера и чекбоксов
        cEmp.addEventListener('input', calc);
        chips.forEach(el => el.addEventListener('change', calc));

        // Кнопка "Заказать по расчёту" -> перенос данных в форму обратной связи
        if (calcOrderBtn) {
            calcOrderBtn.addEventListener('click', () => {
                const res = calc();
                const messageField = document.getElementById('message');
                const nameField = document.getElementById('name');
                const contactSection = document.getElementById('contact-form') || document.getElementById('contacts');

                if (messageField) {
                    const extrasList = res.selectedExtras.length > 0 ? res.selectedExtras.join(', ') : 'нет';
                    messageField.value = `Здравствуйте! Хочу заказать бухгалтерское сопровождение по расчёту на сайте:\n` +
                        `• Форма: ${res.formName}\n` +
                        `• Режим: ${res.modeName}\n` +
                        `• Сотрудников в штате: ${res.emp}\n` +
                        `• Дополнительные услуги: ${extrasList}\n` +
                        `• Расчётная стоимость: ${fmt(res.total)} ₸/мес.`;

                    const group = messageField.closest('.form-group');
                    if (group) group.classList.remove('error');
                }

                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        if (nameField) nameField.focus();
                    }, 600);
                }
            });
        }

        // Первоначальный расчёт при загрузке
        calc();
    }
});