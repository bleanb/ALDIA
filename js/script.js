// Smooth scrolling para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto de parallax en el scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.3;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Animación de escritura para el título
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Intersección Observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.addEventListener('DOMContentLoaded', () => {
    // Animar elementos al cargar
    const animatedElements = document.querySelectorAll('.feature-card, .stat, .feature-card-drakonet');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Efecto hover en las cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animación de los botones
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-drakonet');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Efecto de ripple
            const ripple = document.createElement('div');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Header blur effect on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.3)';
            header.style.backdropFilter = 'blur(30px)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.1)';
            header.style.backdropFilter = 'blur(20px)';
        }
    });
    
    // Contador animado para las estadísticas
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                if (target >= 1000) {
                    element.textContent = Math.floor(start / 1000);
                } else {
                    element.textContent = Math.floor(start);
                }
            }
        }, 16);
    };
    
    // Activar contadores cuando sean visibles
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                animateCounter(entry.target, number);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));
});

// Añadir estilos CSS dinámicos
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .gradient-orb {
        will-change: transform;
    }
    
    .feature-card {
        will-change: transform;
    }
`;
document.head.appendChild(style);

// Efecto de mouse tracking para las orbs
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.02;
        const xOffset = (x - 0.5) * 100 * speed;
        const yOffset = (y - 0.5) * 100 * speed;
        
        orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// Preloader simple
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('current-year');
  if (y) y.textContent = new Date().getFullYear();
});

document.addEventListener('DOMContentLoaded', () => {
  // Toggle mensual/anual
  const toggle = document.getElementById('billingToggle');
  const amounts = document.querySelectorAll('.plan-card .amount');
  const periods = document.querySelectorAll('.plan-card .period');

  function updatePrices(){
    const yearly = toggle?.getAttribute('aria-pressed') === 'true';
    amounts.forEach(a=>{
      const val = yearly ? (a.dataset.yearly ?? a.dataset.monthly ?? a.textContent)
                         : (a.dataset.monthly ?? a.textContent);
      a.textContent = val;
    });
    periods.forEach(p=>{
      const base = p.textContent.includes('usuario') ? '/usuario/mes' : '/mes';
      p.textContent = yearly ? base + ' (anual)' : base;
    });
  }

  if (toggle){
    toggle.addEventListener('click', () => {
      const current = toggle.getAttribute('aria-pressed') === 'true';
      toggle.setAttribute('aria-pressed', String(!current));
      updatePrices();
    });
    updatePrices();
  }

  // Animación de entrada para las nuevas cards (usa tu observer)
  const newCards = document.querySelectorAll('.plan-card');
  newCards.forEach(el=>{
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all .6s ease';
    if (typeof observer !== 'undefined') observer.observe(el);
  });
});

