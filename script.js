/* ============================================
   MR.YE — 交互脚本
   ============================================ */

;(function () {
    // ----- Cursor glow -----
    const glow = document.getElementById('cursorGlow');
    let glowTimeout;
    document.addEventListener('mousemove', (e) => {
        if (!glow) return;
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.classList.add('active');
        clearTimeout(glowTimeout);
        glowTimeout = setTimeout(() => glow.classList.remove('active'), 1200);
    });
    // Touch: hide glow
    document.addEventListener('touchstart', () => {
        if (glow) glow.classList.remove('active');
    }, { once: true });

    // ----- Side decor -----
    const sideDecor = document.querySelector('.side-decor');
    let decorTimeout;
    window.addEventListener('scroll', () => {
        if (!sideDecor) return;
        sideDecor.classList.add('visible');
        clearTimeout(decorTimeout);
        decorTimeout = setTimeout(() => sideDecor.classList.remove('visible'), 2000);
    });

    // ----- Nav scroll effect -----
    const nav = document.getElementById('nav');
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    window.addEventListener('scroll', () => {
        if (!nav) return;
        // Background
        nav.classList.toggle('scrolled', window.scrollY > 40);
        // Active link
        let current = '';
        sections.forEach((sec) => {
            if (window.scrollY >= sec.offsetTop - 200) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    });

    // ----- Typing effect for hero roles -----
    const roleEl = document.querySelector('.hero__role-item');
    const roles = [
        'Kubernetes 集群架构',
        '可观测性体系搭建',
        '多云基础设施编排',
        'Operator 自定义开发',
    ];
    let roleIdx = 0, charIdx = 0, deleting = false, waiting = false;

    function typeRole() {
        if (!roleEl) return;
        const current = roles[roleIdx];

        if (waiting) {
            roleEl.textContent = current;
            setTimeout(() => { waiting = false; deleting = true; typeRole(); }, 2200);
            return;
        }
        if (deleting) {
            charIdx--;
            roleEl.textContent = current.slice(0, charIdx);
            if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(typeRole, 350); return; }
        } else {
            charIdx++;
            roleEl.textContent = current.slice(0, charIdx);
            if (charIdx === current.length) { waiting = true; setTimeout(typeRole, 2200); return; }
        }
        setTimeout(typeRole, deleting ? 35 : 80);
    }
    setTimeout(typeRole, 800);

    // ----- Scroll reveal -----
    const revealEls = document.querySelectorAll(
        '.work-card, .craft-domain, .about-block, .about-meta, .connect__info, .connect__form, .stat, .hero__intro, .hero__portrait'
    );
    revealEls.forEach((el) => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    // ----- Skill bar reveal -----
    const bars = document.querySelectorAll('.bar__fill');
    const barObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    barObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );
    bars.forEach((b) => barObserver.observe(b));

    // ----- Form submit -----
    const form = document.getElementById('connectForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.send-btn');
            const origHTML = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<span>Sent ✓</span><i class="fas fa-check"></i>';
                btn.classList.add('success');
                form.reset();
                // Reset textarea height
                const ta = form.querySelector('textarea');
                if (ta) ta.style.height = '';

                setTimeout(() => {
                    btn.innerHTML = origHTML;
                    btn.classList.remove('success');
                    btn.disabled = false;
                }, 2800);
            }, 1200);
        });
    }

    // ----- Stats counter animation -----
    const statNums = document.querySelectorAll('.stat__num');
    const statObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateStat(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    statNums.forEach((s) => statObserver.observe(s));

    function animateStat(el) {
        const text = el.textContent.trim();
        // Match patterns like "5+", "50+", "99.99%"
        const numMatch = text.match(/^([\d.]+)([+%]*)$/);
        if (!numMatch) { el.style.opacity = '1'; return; }

        const target = parseFloat(numMatch[1]);
        const suffix = numMatch[2] || '';
        const isFloat = numMatch[1].includes('.');
        const duration = 1800;
        const start = performance.now();

        el.style.opacity = '1';

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = isFloat
                ? (target * eased).toFixed(2)
                : Math.floor(target * eased);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = text; // Ensure exact final value
        }
        requestAnimationFrame(tick);
    }

    // Expose stat nums initially hidden
    statNums.forEach((s) => { s.style.opacity = '0'; s.style.transition = 'opacity 0.3s'; });

})();
