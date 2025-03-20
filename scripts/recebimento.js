document.addEventListener('DOMContentLoaded', () => {
    console.log('Document is ready!');

    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');
    const recebimentoForm = document.getElementById('recebimento-form');
    const vehicleSelect = document.getElementById('vehicle');
    const exitDateInput = document.getElementById('exit-date');
    const exitTimeInput = document.getElementById('exit-time');
    const vehicleList = document.getElementById('vehicle-list');

    let recebimentos = [];
    let editIndex = null;

    // Função para obter a data atual no formato YYYY-MM-DD
    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Função para obter a hora atual no formato HH:MM
    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Preencher a data e hora de saída com os valores atuais
    exitDateInput.value = getCurrentDate();
    exitTimeInput.value = getCurrentTime();

    // Função para buscar os veículos do servidor
    async function fetchVehicles() {
        try {
            const response = await fetch('http://localhost:3000/vehicles');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const vehicles = await response.json();
            populateVehicleSelect(vehicles);
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        }
    }

    // Função para preencher o select de veículos
    function populateVehicleSelect(vehicles) {
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = `${vehicle.vehicle} - ${vehicle.plate}`;
            vehicleSelect.appendChild(option);
        });
    }

    // Função para buscar os recebimentos do servidor
    async function fetchRecebimentos() {
        try {
            const response = await fetch('http://localhost:3000/recebimentos');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            recebimentos = await response.json();
            renderRecebimentos();
        } catch (error) {
            console.error('Failed to fetch recebimentos:', error);
        }
    }

    // Função para renderizar a lista de recebimentos
    function renderRecebimentos() {
        vehicleList.innerHTML = '';
        recebimentos.forEach((recebimento, index) => {
            const item = document.createElement('div');
            item.classList.add('vehicle-item');
            item.innerHTML = `
                <div>
                    <strong>Veículo:</strong> ${recebimento.vehicle} <br>
                    <strong>Entrada:</strong> ${recebimento.entryDate} ${recebimento.entryTime} <br>
                    <strong>Saída:</strong> ${recebimento.exitDate} ${recebimento.exitTime} <br>
                    <strong>Condutor:</strong> ${recebimento.driverName} (${recebimento.driverId}) <br>
                    <strong>Cartão:</strong> ${recebimento.cardNumber} <br>
                    <strong>Observações:</strong> ${recebimento.observations}
                </div>
                <div>
                    <button class="btn edit-btn" data-index="${index}">Editar</button>
                    <button class="btn delete-btn" data-index="${index}">Excluir</button>
                </div>
            `;
            vehicleList.appendChild(item);
        });
    }

    // Função para lidar com o envio do formulário
    recebimentoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            entryDate: document.getElementById('entry-date').value,
            entryTime: document.getElementById('entry-time').value,
            exitDate: exitDateInput.value,
            exitTime: exitTimeInput.value,
            vehicle: vehicleSelect.value,
            driverId: document.getElementById('driver-id').value,
            driverName: document.getElementById('driver-name').value,
            cardNumber: document.getElementById('card-number').value,
            observations: document.getElementById('observations').value
        };

        if (editIndex !== null) {
            // Atualizar recebimento existente
            const id = recebimentos[editIndex].id;
            await updateRecebimento(id, formData);
            recebimentos[editIndex] = { id, ...formData };
            editIndex = null;
        } else {
            // Salvar novo recebimento
            const newRecebimento = await saveRecebimento(formData);
            recebimentos.push(newRecebimento);
        }

        renderRecebimentos();
        recebimentoForm.reset();
        exitDateInput.value = getCurrentDate();
        exitTimeInput.value = getCurrentTime();
    });

    // Função para salvar um novo recebimento no servidor
    async function saveRecebimento(recebimento) {
        try {
            const response = await fetch('http://localhost:3000/recebimentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recebimento)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to save recebimento:', error);
        }
    }

    // Função para atualizar um recebimento existente no servidor
    async function updateRecebimento(id, recebimento) {
        try {
            const response = await fetch(`http://localhost:3000/recebimentos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recebimento)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to update recebimento:', error);
        }
    }

    // Função para excluir um recebimento do servidor
    async function deleteRecebimento(id) {
        try {
            const response = await fetch(`http://localhost:3000/recebimentos/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            recebimentos = recebimentos.filter(recebimento => recebimento.id !== id);
            renderRecebimentos();
        } catch (error) {
            console.error('Failed to delete recebimento:', error);
        }
    }

    // Lidar com os botões de edição e exclusão
    vehicleList.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            editIndex = event.target.getAttribute('data-index');
            const recebimento = recebimentos[editIndex];

            document.getElementById('entry-date').value = recebimento.entryDate;
            document.getElementById('entry-time').value = recebimento.entryTime;
            exitDateInput.value = recebimento.exitDate;
            exitTimeInput.value = recebimento.exitTime;
            vehicleSelect.value = recebimento.vehicle;
            document.getElementById('driver-id').value = recebimento.driverId;
            document.getElementById('driver-name').value = recebimento.driverName;
            document.getElementById('card-number').value = recebimento.cardNumber;
            document.getElementById('observations').value = recebimento.observations;
        } else if (event.target.classList.contains('delete-btn')) {
            const index = event.target.getAttribute('data-index');
            const id = recebimentos[index].id;
            deleteRecebimento(id);
        }
    });

    if (menuIcon && menu) {
        menuIcon.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    fetchVehicles();
    fetchRecebimentos();
});
