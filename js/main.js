// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.main-nav a');
    const mainContentArea = document.getElementById('main-content');
    const topHeaderTitle = document.querySelector('.top-header h2');

    // Função para carregar o conteúdo de uma página
    async function loadContent(pageName, title) {
        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            mainContentArea.innerHTML = htmlContent;
            topHeaderTitle.textContent = title; // Atualiza o título do cabeçalho

            // Adiciona a classe específica para a página carregada
            mainContentArea.className = ''; // Limpa classes anteriores
            mainContentArea.classList.add('page-content', `${pageName}-page`);

            // Executar scripts específicos da página se existirem
            executePageScripts(pageName);

        } catch (error) {
            console.error('Erro ao carregar o conteúdo:', error);
            mainContentArea.innerHTML = `<p style="color: red;">Erro ao carregar a página: ${title}.</p>`;
        }
    }

    // Função para executar scripts específicos de cada página
    function executePageScripts(pageName) {
        switch (pageName) {
            case 'agenda':
                if (typeof initAgendaPage === 'function') {
                    initAgendaPage();
                } else {
                    console.warn('Função initAgendaPage não encontrada.');
                }
                break;
            case 'patients':
                if (typeof initPatientsPage === 'function') {
                    initPatientsPage();
                } else {
                    console.warn('Função initPatientsPage não encontrada.');
                }
                break;
            // Adicione mais cases para outras páginas conforme necessário
            default:
                // Limpa ou desativa scripts de outras páginas quando no dashboard
                mainContentArea.classList.add('dashboard-content');
                break;
        }
    }

    // Adiciona evento de clique para os links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o comportamento padrão do link

            // Remove a classe 'active' de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            // Adiciona a classe 'active' ao link clicado
            link.classList.add('active');

            const id = link.id;
            let pageName = '';
            let pageTitle = '';

            switch (id) {
                case 'nav-dashboard':
                    // Se for o dashboard, retorna ao conteúdo inicial do index.html
                    mainContentArea.innerHTML = `
                        <div class="card-grid">
                            <div class="card">
                                <h3>Consultas Hoje</h3>
                                <p class="card-value">12</p>
                                <span class="card-detail">5 confirmadas</span>
                            </div>
                            <div class="card">
                                <h3>Pacientes Ativos</h3>
                                <p class="card-value">250</p>
                                <span class="card-detail">Novos este mês: 15</span>
                            </div>
                            <div class="card">
                                <h3>Próximas Tarefas</h3>
                                <ul>
                                    <li>Revisar agenda de amanhã</li>
                                    <li>Ligar para paciente João S.</li>
                                </ul>
                            </div>
                            <div class="card">
                                <h3>Métricas Rápidas</h3>
                                <p>Taxa de ocupação: 75%</p>
                                <p>Faturamento estimado (mês): R$ 15.000</p>
                            </div>
                        </div>

                        <div class="recent-activity">
                            <h3>Atividade Recente</h3>
                            <ul>
                                <li><span class="timestamp">2 min atrás:</span> Agendamento de Maria A. para 15:00</li>
                                <li><span class="timestamp">10 min atrás:</span> Dr. Carlos adicionou prontuário de Pedro L.</li>
                                <li><span class="timestamp">1 hora atrás:</span> Paciente Ana P. cancelou consulta</li>
                            </ul>
                        </div>
                    `;
                    topHeaderTitle.textContent = 'Dashboard Principal';
                    executePageScripts('dashboard'); // Para limpar scripts se houver
                    break;
                case 'nav-agenda':
                    pageName = 'agenda';
                    pageTitle = 'Agenda de Consultas';
                    loadContent(pageName, pageTitle);
                    break;
                case 'nav-patients':
                    pageName = 'patients';
                    pageTitle = 'Gestão de Pacientes';
                    loadContent(pageName, pageTitle);
                    break;
                case 'nav-professionals':
                    // Exemplo de como você faria para outras páginas
                    pageName = 'professionals'; // Você criaria professionals.html
                    pageTitle = 'Gestão de Profissionais';
                    loadContent(pageName, pageTitle);
                    break;
                case 'nav-financial':
                    pageName = 'financial'; // Você criaria financial.html
                    pageTitle = 'Controle Financeiro';
                    loadContent(pageName, pageTitle);
                    break;
                case 'nav-reports':
                    pageName = 'reports'; // Você criaria reports.html
                    pageTitle = 'Relatórios da Clínica';
                    loadContent(pageName, pageTitle);
                    break;
                case 'nav-settings':
                    pageName = 'settings'; // Você criaria settings.html
                    pageTitle = 'Configurações do Sistema';
                    loadContent(pageName, pageTitle);
                    break;
                default:
                    console.warn('Navegação não configurada para:', id);
            }
        });
    });

    // Carrega o dashboard ao iniciar (garante que a classe 'active' esteja no Dashboard)
    document.getElementById('nav-dashboard').click();
});