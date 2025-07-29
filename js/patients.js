// js/patients.js

function initPatientsPage() {
    console.log('Página de Pacientes inicializada!');

    const patientsTableBody = document.querySelector('#patients-table tbody');
    const addPatientBtn = document.getElementById('add-patient-btn');
    const patientFormModal = document.getElementById('patient-form-modal');
    const closeButton = patientFormModal.querySelector('.close-button');
    const patientForm = document.getElementById('patient-form');
    const searchPatientInput = document.getElementById('search-patient');

    // Dados de pacientes simulados
    let patients = [
        { id: 1, name: 'Maria Antônia Silva', phone: '(21) 98765-4321', email: 'maria.a@email.com', dob: '1985-03-10', last_consult: '20/07/2025' },
        { id: 2, name: 'João Pedro Santos', phone: '(21) 99123-4567', email: 'joao.p@email.com', dob: '1992-11-25', last_consult: '15/07/2025' },
        { id: 3, name: 'Ana Carolina Lima', phone: '(21) 98888-7777', email: 'ana.c@email.com', dob: '1970-01-01', last_consult: '22/07/2025' },
    ];

    function renderPatientsTable(filteredPatients = patients) {
        patientsTableBody.innerHTML = ''; // Limpa a tabela

        filteredPatients.forEach(patient => {
            const row = patientsTableBody.insertRow();
            row.dataset.id = patient.id; // Para fácil acesso ao ID
            row.innerHTML = `
                <td>${patient.name}</td>
                <td>${patient.phone}</td>
                <td>${patient.email}</td>
                <td>${patient.last_consult}</td>
                <td>
                    <button class="btn edit" data-id="${patient.id}">Editar</button>
                    <button class="btn delete" data-id="${patient.id}">Excluir</button>
                </td>
            `;
        });

        addTableEventListeners();
    }

    function addTableEventListeners() {
        // Adicionar eventos de clique para botões de Editar e Excluir
        patientsTableBody.querySelectorAll('.btn.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const patientId = parseInt(e.target.dataset.id);
                const patientToEdit = patients.find(p => p.id === patientId);
                if (patientToEdit) {
                    openPatientForm(patientToEdit);
                }
            });
        });

        patientsTableBody.querySelectorAll('.btn.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const patientId = parseInt(e.target.dataset.id);
                if (confirm(`Tem certeza que deseja excluir o paciente ID ${patientId}?`)) {
                    deletePatient(patientId);
                }
            });
        });
    }

    function openPatientForm(patient = null) {
        patientFormModal.style.display = 'block';
        patientForm.reset(); // Limpa o formulário

        if (patient) {
            // Modo de edição
            patientForm.dataset.editingId = patient.id;
            document.getElementById('patient-name').value = patient.name;
            document.getElementById('patient-phone').value = patient.phone;
            document.getElementById('patient-email').value = patient.email;
            document.getElementById('patient-dob').value = patient.dob; // yyyy-mm-dd
            patientFormModal.querySelector('h4').textContent = 'Editar Paciente';
        } else {
            // Modo de adição
            delete patientForm.dataset.editingId;
            patientFormModal.querySelector('h4').textContent = 'Novo Paciente';
        }
    }

    function closePatientForm() {
        patientFormModal.style.display = 'none';
        patientForm.reset();
        delete patientForm.dataset.editingId;
    }

    function savePatient(event) {
        event.preventDefault();

        const name = document.getElementById('patient-name').value;
        const phone = document.getElementById('patient-phone').value;
        const email = document.getElementById('patient-email').value;
        const dob = document.getElementById('patient-dob').value;

        const editingId = patientForm.dataset.editingId;

        if (editingId) {
            // Atualizar paciente existente
            const patientIndex = patients.findIndex(p => p.id === parseInt(editingId));
            if (patientIndex > -1) {
                patients[patientIndex] = {
                    ...patients[patientIndex], // Mantém outros dados
                    name,
                    phone,
                    email,
                    dob
                };
            }
        } else {
            // Adicionar novo paciente
            const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
            const newPatient = {
                id: newId,
                name,
                phone,
                email,
                dob,
                last_consult: 'N/A' // Nova consulta ainda não registrada
            };
            patients.push(newPatient);
        }

        renderPatientsTable();
        closePatientForm();
    }

    function deletePatient(idToDelete) {
        patients = patients.filter(patient => patient.id !== idToDelete);
        renderPatientsTable();
        alert('Paciente excluído com sucesso!');
    }

    function searchPatients() {
        const searchTerm = searchPatientInput.value.toLowerCase();
        const filtered = patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm) ||
            patient.phone.toLowerCase().includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm)
        );
        renderPatientsTable(filtered);
    }

    // Event Listeners
    addPatientBtn.addEventListener('click', () => openPatientForm());
    closeButton.addEventListener('click', closePatientForm);
    patientForm.addEventListener('submit', savePatient);
    searchPatientInput.addEventListener('input', searchPatients);

    // Renderiza a tabela de pacientes ao carregar a página
    renderPatientsTable();
}