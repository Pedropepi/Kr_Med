// js/agenda.js

// Função que inicializa a página de Agenda
function initAgendaPage() {
    console.log('Página de Agenda inicializada!');

    const currentWeekDisplay = document.getElementById('current-week-display');
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const agendaGrid = document.getElementById('agenda-grid');

    let currentWeekStart = new Date(); // Começa com a semana atual
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // Define para o último domingo

    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit' };
        return date.toLocaleDateString('pt-BR', options);
    }

    function getWeekRange(startDate) {
        const start = new Date(startDate);
        const end = new Date(startDate);
        end.setDate(end.getDate() + 6); // 6 dias depois para o fim da semana (dom-sab)
        return `${formatDate(start)} a ${formatDate(end)}`;
    }

    function renderAgenda() {
        currentWeekDisplay.textContent = `Semana de ${getWeekRange(currentWeekStart)} de ${currentWeekStart.getFullYear()}`;
        agendaGrid.innerHTML = ''; // Limpa a agenda

        const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const mockAppointments = { // Dados de exemplo
            '2025-07-28': [{ time: '09:00', patient: 'Maria Silva', professional: 'Dr. Carlos' }],
            '2025-07-29': [{ time: '10:00', patient: 'João Pereira', professional: 'Dra. Ana' }, { time: '14:00', patient: 'Pedro Souza', professional: 'Dr. Carlos' }],
            '2025-07-30': [],
            '2025-07-31': [{ time: '11:00', patient: 'Laura Martins', professional: 'Dra. Ana' }],
            '2025-08-01': [],
            '2025-08-02': [{ time: '16:00', patient: 'Felipe Costa', professional: 'Dr. Carlos' }],
            '2025-08-03': []
        };

        for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart);
            day.setDate(currentWeekStart.getDate() + i);
            const dateKey = day.toISOString().slice(0, 10); // Formato YYYY-MM-DD

            const dayDiv = document.createElement('div');
            dayDiv.classList.add('agenda-day');
            dayDiv.innerHTML = `<h4>${daysOfWeek[day.getDay()]} <br> ${formatDate(day)}</h4>`;

            const dailyAppointments = mockAppointments[dateKey] || [];

            // Gerar slots de 08:00 às 17:00 (exemplo)
            for (let hour = 8; hour <= 17; hour++) {
                const time = `${String(hour).padStart(2, '0')}:00`;
                const appointment = dailyAppointments.find(app => app.time === time);

                const slotDiv = document.createElement('div');
                slotDiv.classList.add('agenda-slot');
                slotDiv.dataset.time = time;
                slotDiv.dataset.date = dateKey;

                if (appointment) {
                    slotDiv.classList.add('occupied');
                    slotDiv.dataset.patient = appointment.patient;
                    slotDiv.dataset.prof = appointment.professional;
                    slotDiv.innerHTML = `${time} - ${appointment.patient} (${appointment.professional})`;
                    slotDiv.addEventListener('click', () => alert(`Detalhes do Agendamento:\nHorário: ${time}\nPaciente: ${appointment.patient}\nProfissional: ${appointment.professional}`));
                } else {
                    slotDiv.classList.add('empty');
                    slotDiv.innerHTML = `${time} - Disponível`;
                    slotDiv.addEventListener('click', () => alert(`Agendar para ${time} em ${formatDate(day)}`));
                }
                dayDiv.appendChild(slotDiv);
            }
            agendaGrid.appendChild(dayDiv);
        }
    }

    prevWeekBtn.addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        renderAgenda();
    });

    nextWeekBtn.addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        renderAgenda();
    });

    // Renderiza a agenda pela primeira vez
    renderAgenda();
}