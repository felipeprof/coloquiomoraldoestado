// Este código foi removido pois a funcionalidade é implementada na função exibirProgramacao

// Este código foi removido pois a funcionalidade é implementada na função initSpeakersCarousel


// Função para carregar os dados da programação
async function carregarProgramacao() {
    try {
        const resposta = await fetch('programacao.json');
        if (!resposta.ok) {
            throw new Error('Não foi possível carregar os dados da programação');
        }
        const dados = await resposta.json();

        // Exibir a programação
        exibirProgramacao(dados);
    } catch (erro) {
        console.error('Erro ao carregar programação:', erro);
        document.getElementById('schedule').innerHTML = '<p class="error-message">Erro ao carregar os dados da programação. Por favor, tente novamente mais tarde.</p>';
    }
}

// Função para exibir a programação
function exibirProgramacao(dados) {
    const dayTabs = document.getElementById('dayTabs');
    const schedule = document.getElementById('schedule');

    // Limpar conteúdo atual
    dayTabs.innerHTML = '';
    schedule.innerHTML = '';

    // Criar as abas para cada dia
    dados.dias.forEach((dia, index) => {
        const tabElement = document.createElement('div');
        tabElement.className = `day-tab ${index === 0 ? 'active' : ''}`;
        tabElement.setAttribute('data-day', dia.id);
        tabElement.textContent = dia.nome;

        tabElement.addEventListener('click', () => {
            // Remover classe active de todas as abas
            document.querySelectorAll('.day-tab').forEach(tab => {
                tab.classList.remove('active');
            });

            // Adicionar classe active à aba clicada
            tabElement.classList.add('active');

            // Esconder todos os conteúdos de dias
            document.querySelectorAll('.day-content').forEach(content => {
                content.classList.remove('active');
            });

            // Mostrar o conteúdo do dia selecionado
            document.getElementById(`content-${dia.id}`).classList.add('active');
        });

        dayTabs.appendChild(tabElement);
    });

    // Criar o conteúdo para cada dia
    dados.dias.forEach((dia, index) => {
        const dayContent = document.createElement('div');
        dayContent.className = `day-content ${index === 0 ? 'active' : ''}`;
        dayContent.id = `content-${dia.id}`;

            // Adicionar os itens da programação para este dia
            dia.programacao.forEach(item => {
                const scheduleItem = document.createElement('div');
                scheduleItem.className = 'schedule-item';

                // Criar a estrutura HTML para o item da programação
                let scheduleContent = `
                    <div class="schedule-time">${item.horario}</div>
                    <div class="schedule-detail">
                        <div class="schedule-title">${item.titulo}</div>
                `;

            // Adicionar palestrante, se houver
            if (item.palestrante) {
                scheduleContent += `<div class="schedule-speaker">${item.palestrante}</div>`;
            }

            // Adicionar participantes, se houver
            if (item.participantes && item.participantes.length > 0) {
                item.participantes.forEach(participante => {
                    let participanteHtml = '';
                    if (participante.funcao) {
                        participanteHtml += `<span class="participant-function">${participante.funcao}: </span>`;
                    }
                    participanteHtml += participante.moderador
                        ? `<span class="moderator-name">${participante.nome}</span>`
                        : participante.nome;
                    
                    if (participante.tema) {
                        participanteHtml += `: "${participante.tema}"`;
                    }
                    scheduleContent += `<div class="schedule-speaker">${participanteHtml}</div>`;
                });
            }

            scheduleContent += `</div>`;
            scheduleItem.innerHTML = scheduleContent;

            dayContent.appendChild(scheduleItem);
        });

        schedule.appendChild(dayContent);
    });
}

// Iniciar o carregamento da programação quando a página estiver pronta
document.addEventListener('DOMContentLoaded', carregarProgramacao);

// Função de exemplo removida para simplificar o código

// Função para carregar e exibir a problemática no modal
async function carregarProblematica() {
    try {
        const response = await fetch('problematica.json');
        if (!response.ok) {
            throw new Error('Não foi possível carregar os dados da problemática');
        }
        return await response.json();
    } catch (erro) {
        console.error('Erro ao carregar problemática:', erro);
        return null;
    }
}

// Carrossel de Palestrantes
let currentSpeakerSlide = 0;
let speakerSlidesPerView = 3;
const speakerSlides = [];

function initSpeakersCarousel() {
    const speakersTrack = document.getElementById('speakersTrack');
    const indicators = document.getElementById('speakerIndicators');

    if (!speakersTrack || !indicators) {
        console.error('Elementos do carrossel não encontrados');
        return;
    }

    // Carregar os dados dos palestrantes
    fetch('palestrantes.json')
        .then(response => response.json())
        .then(data => {
            speakerSlides.length = 0; // Limpar array

            // Shuffle the speakers data (Fisher-Yates shuffle)
            for (let i = data.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [data[i], data[j]] = [data[j], data[i]];
            }

            // Renderizar os cartões dos palestrantes
            data.forEach((palestrante, index) => {
                const speakerCard = document.createElement('div');
                speakerCard.className = 'speaker-card';
                speakerCard.setAttribute('data-index', index);

                // Verificar se a foto existe, caso contrário usar uma imagem padrão
                const fotoUrl = palestrante.foto || 'placeholder.jpg';

                let talkAndThemeHtml = '';
                if (palestrante.palestra) {
                    talkAndThemeHtml += `<p class="speaker-talk"><strong>Palestra:</strong> ${palestrante.palestra}</p>`;
                }
                if (palestrante.tema) {
                    talkAndThemeHtml += `<p class="speaker-theme"><strong>Moderador(a) do Tema:</strong> ${palestrante.tema}</p>`;
                }

                // Verificar se é moderador e tem tema
                const moderatorInfo = palestrante.moderador && palestrante.tema 
                    ? `<div class="speaker-moderator">
                        <strong>Moderador(a) do Tema:</strong> ${palestrante.tema}
                       </div>`
                    : '';

                // New logic for palestra or moderador role
                let palestraOuModeradorHtml = '';
                if (palestrante.palestra) {
                    palestraOuModeradorHtml = `<p class="speaker-talk"><strong>Palestra:</strong> ${palestrante.palestra}</p>`;
                } else if (palestrante["Moderador(a)"]) {
                    palestraOuModeradorHtml = `<p class="speaker-moderator-role"><strong>Moderador(a):</strong> ${palestrante["Moderador(a)"]}</p>`;
                }

                speakerCard.innerHTML = `
                    <div class="speaker-img">
                        <img src="${fotoUrl}" alt="${palestrante.nome}">
                    </div>
                    <div class="speaker-info">
                        <h3>${palestrante.nome}</h3>
                        <p class="speaker-institution">${palestrante.instituicao}</p>
                        ${moderatorInfo}
                        <p class="speaker-bio">${palestrante.bio}</p>
                        ${palestraOuModeradorHtml}
                    </div>
                `;

                // Adicionar evento de clique no card para ir diretamente para aquele slide
                speakerCard.addEventListener('click', () => {
                    // Calcular para qual slide devemos ir
                    goToSpeaker(index);
                });

                speakersTrack.appendChild(speakerCard);
                speakerSlides.push(speakerCard);

                // Criar indicador com tooltip
                const indicator = document.createElement('div');
                indicator.className = 'carousel-indicator';
                indicator.dataset.index = index;
                indicator.setAttribute('title', palestrante.nome);
                indicator.setAttribute('aria-label', `Ver ${palestrante.nome}`);

                indicator.addEventListener('click', () => {
                    goToSpeaker(index);
                });

                indicators.appendChild(indicator);
            });

            // Definir slides por visualização com base na largura da tela
            updateSlidesPerView();

            // Obter referências aos botões
            const prevBtn = document.getElementById('prevSpeaker');
            const nextBtn = document.getElementById('nextSpeaker');

            if (!prevBtn || !nextBtn) {
                console.error('Botões de navegação não encontrados');
                return;
            }

            // Adicionar event listeners diretamente
            prevBtn.onclick = function() {
                prevSpeaker();
            };

            nextBtn.onclick = function() {
                nextSpeaker();
            };

            // Atualizar o carrossel pela primeira vez
            updateSpeakersCarousel();

            // Adicionar navegação com teclado
            document.addEventListener('keydown', (e) => {
                if (isElementInViewport(speakersTrack)) {
                    if (e.key === 'ArrowLeft') {
                        prevSpeaker();
                    } else if (e.key === 'ArrowRight') {
                        nextSpeaker();
                    }
                }
            });

            // Adicionar listener para responsividade
            window.addEventListener('resize', () => {
                updateSlidesPerView();
                updateSpeakersCarousel();
            });

            // Adicionar swipe em dispositivos touch
            let touchStartX = 0;
            let touchEndX = 0;

            speakersTrack.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});

            speakersTrack.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, {passive: true});

            function handleSwipe() {
                const minSwipeDistance = 50;
                if (touchEndX < touchStartX - minSwipeDistance) {
                    nextSpeaker(); // Swipe para esquerda = próximo
                } else if (touchEndX > touchStartX + minSwipeDistance) {
                    prevSpeaker(); // Swipe para direita = anterior
                }
            }
        })
        .catch(error => {
            console.error('Erro ao carregar palestrantes:', error);
        });
}

function updateSlidesPerView() {
    if (window.innerWidth <= 768) {
        speakerSlidesPerView = 1;
    } else if (window.innerWidth <= 992) {
        speakerSlidesPerView = 2;
    } else {
        speakerSlidesPerView = 3;
    }
}

// Função simplificada para mover para o slide anterior
function prevSpeaker() {
    if (!speakerSlides.length) return;

    if (currentSpeakerSlide > 0) {
        currentSpeakerSlide -= speakerSlidesPerView;
        if (currentSpeakerSlide < 0) currentSpeakerSlide = 0;
        updateSpeakersCarousel();

        const prevBtn = document.getElementById('prevSpeaker');
        if (prevBtn) {
            prevBtn.classList.add('clicked');
            setTimeout(() => prevBtn.classList.remove('clicked'), 300);
        }
    }
}

// Função simplificada para mover para o próximo slide
function nextSpeaker() {
    if (!speakerSlides.length) return;

    const maxSlide = Math.max(0, speakerSlides.length - speakerSlidesPerView);

    if (currentSpeakerSlide < maxSlide) {
        currentSpeakerSlide += speakerSlidesPerView;
        if (currentSpeakerSlide > maxSlide) currentSpeakerSlide = maxSlide;
        updateSpeakersCarousel();

        const nextBtn = document.getElementById('nextSpeaker');
        if (nextBtn) {
            nextBtn.classList.add('clicked');
            setTimeout(() => nextBtn.classList.remove('clicked'), 300);
        }
    }
}

function updateSpeakersCarousel() {
    const speakersTrack = document.getElementById('speakersTrack');
    const indicators = document.getElementById('speakerIndicators');
    const prevBtn = document.getElementById('prevSpeaker');
    const nextBtn = document.getElementById('nextSpeaker');

    if (!speakersTrack || !indicators || !speakerSlides.length) return;

    // Limitar o slide atual
    const maxSlide = Math.max(0, speakerSlides.length - speakerSlidesPerView);
    currentSpeakerSlide = Math.min(Math.max(0, currentSpeakerSlide), maxSlide);

    // Mover o track com animação suave
    const slideWidth = speakerSlides[0].offsetWidth + 20; // Largura + margem
    speakersTrack.style.transform = `translateX(-${currentSpeakerSlide * slideWidth}px)`;

    // Atualizar os indicadores
    const indicatorElements = document.querySelectorAll('.carousel-indicator');
    indicatorElements.forEach((indicator, index) => {
        const slideGroup = Math.floor(index / speakerSlidesPerView);
        const currentGroup = Math.floor(currentSpeakerSlide / speakerSlidesPerView);
        indicator.classList.toggle('active', slideGroup === currentGroup);
    });

    // Adicionar informação sobre os slides (atualizar o contador)
    const totalGroups = Math.ceil(speakerSlides.length / speakerSlidesPerView);
    const currentGroup = Math.floor(currentSpeakerSlide / speakerSlidesPerView) + 1;
    indicators.setAttribute('data-info', `${currentGroup} de ${totalGroups}`);

    // Marcar palestrantes visíveis como ativos
    speakerSlides.forEach((slide, index) => {
        const isVisible = index >= currentSpeakerSlide && index < currentSpeakerSlide + speakerSlidesPerView;
        slide.classList.toggle('active', isVisible);

        // Adicionar foco tabulável apenas nos slides visíveis
        if (isVisible) {
            slide.setAttribute('tabindex', '0');
        } else {
            slide.removeAttribute('tabindex');
        }
    });

    // Atualizar estado dos botões de navegação
    if (prevBtn) {
        if (currentSpeakerSlide <= 0) {
            prevBtn.classList.add('disabled');
            prevBtn.setAttribute('disabled', 'true');
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.removeAttribute('disabled');
        }
    }

    if (nextBtn) {
        if (currentSpeakerSlide >= maxSlide) {
            nextBtn.classList.add('disabled');
            nextBtn.setAttribute('disabled', 'true');
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.removeAttribute('disabled');
        }
    }
}

// Função para verificar se um elemento está visível na viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Função para ir diretamente para um palestrante específico
function goToSpeaker(index) {
    // Calcular para qual slide devemos ir baseado no índice e slides por view
    currentSpeakerSlide = Math.floor(index / speakerSlidesPerView) * speakerSlidesPerView;
    updateSpeakersCarousel();

    // Destacar o cartão clicado
    speakerSlides.forEach(slide => {
        slide.classList.remove('current');
    });

    speakerSlides[index].classList.add('current');
    setTimeout(() => {
        speakerSlides[index].classList.remove('current');
    }, 1500);
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o carrossel de palestrantes
    initSpeakersCarousel();

    // Configurar modal da problemática
    setupProblematicaModal();

    // Configurar timeline
    setupTimeline();

    // Inicializar contador
    updateCountdown();
    animateHeroElements();

    // Configurar menu responsivo
    setupMobileMenu();

    // Adicionar classe ao body quando a página é rolada para ajustar o menu
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });
});

// Função para configurar o menu responsivo
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Adicionar/remover classe no body quando o menu está aberto
        document.body.classList.toggle('menu-open');
    });

    // Fechar menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Função para fechar o menu
    function closeMenu() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (navMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnToggle) {
            closeMenu();
        }
    });
}

// Configuração do modal da problemática
function setupProblematicaModal() {
    const modal = document.getElementById('problematicaModal');
    const btn = document.getElementById('openProblematicaModal');
    const span = document.getElementsByClassName('close-modal')[0];
    const closeBtn = document.querySelector('.close-btn');

    if (!btn || !modal || !span) return;

    // Abrir modal e carregar dados
    btn.addEventListener('click', async function() {
        const dados = await carregarProblematica();

        if (dados) {
            // Preencher o modal com os dados
            document.getElementById('modal-titulo').textContent = dados.titulo;
            document.getElementById('modal-data').textContent = dados.data;

            // Preencher parágrafos
            const modalParagrafos = document.getElementById('modal-paragrafos');
            modalParagrafos.innerHTML = '';
            dados.paragrafos.forEach(paragrafo => {
                const p = document.createElement('p');
                p.textContent = paragrafo;
                modalParagrafos.appendChild(p);
            });

            // Preencher eixos temáticos
            const modalEixos = document.getElementById('modal-eixos');
            modalEixos.innerHTML = '';
            dados.eixos_tematicos.forEach(eixo => {
                const li = document.createElement('li');
                li.textContent = eixo;
                modalEixos.appendChild(li);
            });
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Fechar modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    span.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') closeModal();
    });
}

// Configuração da timeline
function setupTimeline() {
    setupHorizontalTimeline();
    animateTimelineOnScroll();

    window.addEventListener('resize', adjustTimelineLength);
}

// Função para animar a linha do tempo quando visível
function animateTimelineOnScroll() {
    const timeline = document.querySelector('.timeline');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timeline || !timelineItems.length) return;

    // Função para verificar se um elemento está visível na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Configura os estilos iniciais antes da animação
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = window.innerWidth > 768 ?
            (index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)') :
            'translateY(50px)';
    });

    // Função para animar itens da timeline que estão visíveis
    function checkTimelineVisibility() {
        if (isElementInViewport(timeline)) {
            timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                    item.style.transition = 'all 0.5s ease-out';
                }, 200 * index);
            });

            window.removeEventListener('scroll', checkTimelineVisibility);
        }
    }

    // Adiciona o event listener para o scroll
    window.addEventListener('scroll', checkTimelineVisibility);

    // Verifica imediatamente caso a timeline já esteja visível ao carregar
    checkTimelineVisibility();
}

// Função removida pois já está implementada em setupHorizontalTimeline

// Função para controlar a timeline horizontal
function setupHorizontalTimeline() {
    const timeline = document.querySelector('.timeline');
    const prevBtn = document.getElementById('prevTimeline');
    const nextBtn = document.getElementById('nextTimeline');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timeline || !prevBtn || !nextBtn) return;

    // Configurações iniciais
    let scrollPosition = 0;
    const itemWidth = timelineItems[0].offsetWidth + parseInt(window.getComputedStyle(timelineItems[0]).marginRight);
    const scrollStep = itemWidth * 2; // Rolar 2 itens por vez

    // Atualizar estado dos botões
    function updateButtonState() {
        prevBtn.disabled = scrollPosition <= 0;
        nextBtn.disabled = scrollPosition >= timeline.scrollWidth - timeline.clientWidth;
    }

    // Inicializar
    updateButtonState();
    adjustTimelineLength(); // Garantir que a linha se estenda corretamente

    // Botão para rolar para trás
    prevBtn.addEventListener('click', () => {
        scrollPosition = Math.max(0, scrollPosition - scrollStep);
        timeline.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        setTimeout(updateButtonState, 500); // Atualizar após a animação terminar
    });

    // Botão para rolar para frente
    nextBtn.addEventListener('click', () => {
        scrollPosition = Math.min(
            timeline.scrollWidth - timeline.clientWidth,
            scrollPosition + scrollStep
        );
        timeline.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        setTimeout(updateButtonState, 500); // Atualizar após a animação terminar
    });

    // Detectar rolagem com o mouse/trackpad
    timeline.addEventListener('scroll', () => {
        scrollPosition = timeline.scrollLeft;
        updateButtonState();
    });

    // Ajustar tamanho da linha quando a janela for redimensionada
    window.addEventListener('resize', adjustTimelineLength);

    // Adicionar navegação com teclado quando timeline tem foco
    timeline.tabIndex = 0; // Tornar o elemento focável
    timeline.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
            e.preventDefault();
        }
    });

    // Habilitar clique nos itens para marcar como ativo
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            timelineItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// Esta função foi removida e consolidada com animateTimelineOnScroll

// Função para garantir que a linha do tempo se estenda até o último item
function adjustTimelineLength() {
    const timeline = document.querySelector('.timeline');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineLine = document.querySelector('.timeline-line');

    // Encontra o item ativo ou o último item
    const activeItem = document.querySelector('.timeline-item.active') || timelineItems[timelineItems.length - 1];

    if (activeItem) {
        const timelineRect = timeline.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();

        // Calcula a largura da linha do tempo
        const width = itemRect.right - timelineRect.left - 15;
        timelineLine.style.width = `${width}px`;
    }
}

// Contador Regressivo
function updateCountdown() {
    const countDate = new Date("August 12, 2025 00:00:00").getTime();
    const now = new Date().getTime();
    const gap = countDate - now;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const textDay = Math.floor(gap / day);
    // Valores abaixo não são usados atualmente, mas podem ser úteis para futuras melhorias
    // const textHour = Math.floor((gap % day) / hour);
    // const textMinute = Math.floor((gap % hour) / minute);
    // const textSecond = Math.floor((gap % minute) / second);

    const countdownElement = document.querySelector(".hero-countdown-days");
    if (countdownElement) {
        countdownElement.textContent = textDay;

        // Adicionar animação de pulso quando o número muda
        countdownElement.classList.add("pulse");
        setTimeout(() => {
            countdownElement.classList.remove("pulse");
        }, 500);
    }
}

// Atualizar o contador a cada segundo
setInterval(updateCountdown, 1000);

// Função para animar elementos do hero
function animateHeroElements() {
    const heroElements = document.querySelectorAll(".hero-title-vi, .hero-title-colloquium, .hero-title-international, .hero-date-location, .hero-main-title, .hero-btn");

    heroElements.forEach((element, index) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        setTimeout(() => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        }, 200 * index);
    });
}
