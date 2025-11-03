// Controle de vídeo Youtube
document.addEventListener('DOMContentLoaded', () => {
    // Cria e carrega a API do YouTube dinamicamente
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Variável global para controlar o player
    let player;

    // Função chamada automaticamente quando a API do YouTube estiver pronta
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('hero-video', {
            videoId: 'UbzSt7etUq8', // Corrigido: identificador do vídeo
            playerVars: {
                'start': 6,
                'autoplay': 1,
                'mute': 1,
                'loop': 1,
                'playlist': 'UbzSt7etUq8', // Necessário para o loop
                'controls': 0,
                'showinfo': 0,
                'rel': 0,
                'modestbranding': 1,
                'iv_load_policy': 3,
                'disablekb': 1,
                'fs': 0,
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    // Quando o player estiver pronto, inicia o vídeo no tempo correto e sem som
    function onPlayerReady(event) {
        event.target.seekTo(6, true);
        event.target.mute();
        event.target.playVideo();
    }

    // Garante que o vídeo reinicie se pausar ou terminar
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            event.target.seekTo(6);
            event.target.playVideo();
        }

        if (event.data === YT.PlayerState.PAUSED) {
            event.target.seekTo(6, true);
            event.target.playVideo();
        }

        if (event.data === YT.PlayerState.PLAYING) {
            const currentTime = event.target.getCurrentTime();
            if (currentTime < 6) { // Evita tocar antes do tempo inicial
                event.target.seekTo(6);
            }
        }
    }

    // Reforça o loop contínuo com checagem periódica
    setInterval(() => {
        if (player && player.getPlayerState) {
            const state = player.getPlayerState();
            
            if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.CUED) {
                player.seekTo(6);
                player.playVideo();
            }
            
            if (player.isMuted && !player.isMuted()) {
                player.mute();
            }

            if (state === YT.PlayerState.PLAYING) {
                const currentTime = player.getCurrentTime();
                if (currentTime < 6) {
                    player.seekTo(6);
                }
            }
        }
    }, 2000);
});

// Scrol Reveal (Animações ao rolar)

const observerOptions = {
    threshold: 0.15, // Elemento precisa estar 15% visível
    rootMargin: '0px 0px -50px 0px' // Ajuste de margem inferior
};

// Usa IntersectionObserver para detectar quando os elementos aparecem na tela
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active'); // Adiciona classe de animação
            }, index * 100); // Delay progressivo
        }
    });
}, observerOptions);

// Observa todos os elementos com a classe .scroll-reveal
document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});

// Smooth Scrol (Navegação suave)

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const offsetTop = target.offsetTop - 20; // Ajuste da posição
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth' // Rolagem suave
            });
        }
    });
});

// Paralax suave (Ícones flutuantes - se houver)

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

// Captura o movimento do mouse e normaliza os valores
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Aplica um efeito suave de movimento (parallax) nos ícones
function animateParallax() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    const icons = document.querySelectorAll('.floating-icon');
    icons.forEach((icon, index) => {
        const speed = (index + 1) * 8;
        const x = currentX * speed;
        const y = currentY * speed;
        icon.style.transform = `translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(animateParallax);
}

animateParallax(); // Inicia a animação

// Formulário (Validação e envio)

const form = document.getElementById('rsvpForm');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData); // Converte os dados em objeto
        
        const submitBtn = form.querySelector('.btn-form-submit');
        const originalText = submitBtn.textContent;
        
        // Feedback visual após o envio
        submitBtn.textContent = '✓ Confirmado!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            form.reset(); // Limpa o formulário
        }, 2000);
        
        console.log('Formulário enviado:', data);
    });

    // Validação básica ao perder foco
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.style.borderColor = '#ef4444'; // Vermelho se vazio
            } else {
                input.style.borderColor = '';
            }
        });

        input.addEventListener('input', () => {
            input.style.borderColor = ''; // Remove o erro ao digitar
        });
    });
}

// Cards de Fantasia (Interatividade)

const costumeCards = document.querySelectorAll('.costume-card');

costumeCards.forEach(card => {
    card.addEventListener('click', function() {
        costumeCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected'); // Destaca o card escolhido
        
        const costumeName = this.querySelector('.costume-name').textContent;
        const fantasiaInput = document.querySelector('input[placeholder*="Vampiro"]');
        
        if (fantasiaInput) {
            fantasiaInput.value = costumeName;
            fantasiaInput.focus();
            
            // Move suavemente até o formulário
            document.querySelector('#rsvp').scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }
    });
});

// Performance (Otimizações)

// Lazy loading de imagens usando IntersectionObserver
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Evita executar código várias vezes durante resize (debounce)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('Window resized');
    }, 250);
});

// Acessibilidade (Navegação por teclado)

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Fechar elementos modais ou menus
    }
    
    if (e.key === 'Tab') {
        // Controlar foco nos elementos interativos
    }
});

// Preload Crítico

window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300); // Remove o loader após o carregamento
    }
    
    console.log('🎃 Halloween Party 2025 carregado!');
});

// Easter Egg (Comando secreto)

let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

// Detecta sequência Konami e aplica um efeito visual
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiSequence.length);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
        console.log('🎃 Easter egg encontrado!');
    }
});

// Tracking de eventos

// Função genérica para registrar eventos
function trackEvent(category, action, label) {
    console.log('Event:', { category, action, label });
}

// Captura cliques em botões para análise
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('Button', 'Click', btn.textContent.trim());
    });
});

// Registra profundidade do scroll (25%, 50%, 75%, 100%)
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent > maxScroll) {
        maxScroll = Math.floor(scrollPercent / 25) * 25;
        if ([25, 50, 75, 100].includes(maxScroll)) {
            trackEvent('Scroll', 'Depth', `${maxScroll}%`);
        }
    }
});
