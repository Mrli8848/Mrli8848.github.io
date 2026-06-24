/* ============================================
   个人主页 - 交互脚本
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initTyping();
    initNavbar();
    initHamburger();
    initScrollTop();
    initScrollSpy();
    initSkillBars();
    initContactForm();
});

// ----- 打字效果 -----
function initTyping() {
    const typedEl = document.getElementById('typed');
    if (!typedEl) return;

    const titles = [
        'IT 运维工程师',
        '自动化运维专家',
        '移动开发爱好者',
        '终身学习者',
    ];
    let titleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let isWaiting = false;

    function type() {
        const current = titles[titleIdx];

        if (isWaiting) {
            // 打完一个词后停顿
            typedEl.textContent = current;
            setTimeout(() => {
                isWaiting = false;
                isDeleting = true;
                type();
            }, 2000);
            return;
        }

        if (isDeleting) {
            charIdx--;
            typedEl.textContent = current.substring(0, charIdx);
            if (charIdx === 0) {
                isDeleting = false;
                titleIdx = (titleIdx + 1) % titles.length;
                setTimeout(type, 400);
                return;
            }
        } else {
            charIdx++;
            typedEl.textContent = current.substring(0, charIdx);
            if (charIdx === current.length) {
                isWaiting = true;
                setTimeout(type, 2000);
                return;
            }
        }

        const speed = isDeleting ? 40 : 100;
        setTimeout(type, speed);
    }

    setTimeout(type, 500);
}

// ----- 导航栏滚动效果 -----
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ----- 汉堡菜单 -----
function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // 点击导航链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ----- 回到顶部按钮 -----
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
}

// ----- 滚动监听：高亮当前导航链接 -----
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
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
}

// ----- 技能条滚动动画 -----
function initSkillBars() {
    const progressBars = document.querySelectorAll('.skill-progress');
    let animated = false;

    function animateBars() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;
        const sectionTop = skillsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100 && !animated) {
            animated = true;
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            });
        }
    }

    window.addEventListener('scroll', animateBars);
    // 初始检查（页面加载时技能区可能已在视野内）
    animateBars();
}

// ----- 联系表单提交 -----
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button');
        const originalHTML = btn.innerHTML;

        // 模拟发送
        btn.innerHTML = '<span>发送中...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span>发送成功 ✓</span><i class="fas fa-check"></i>';
            btn.style.background = '#22c55e';
            form.reset();

            // 恢复按钮
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 2500);
        }, 1500);
    });
}

// ----- 滚动渐入动画（Intersection Observer）-----
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.project-card, .info-item, .skill-category, .about-text, .tag'
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 在 DOMContentLoaded 中也调用滚动渐入
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
});
