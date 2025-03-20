document.addEventListener('DOMContentLoaded', () => {
    console.log('Document is ready!');

    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');
    const addVehicleBtn = document.getElementById('add-vehicle-btn');
    const formSection = document.getElementById('form-section');
    const vehicleList = document.getElementById('vehicle-list');
    const vehicleForm = document.getElementById('vehicle-form');
    const plateInput = document.getElementById('plate');
    const errorMessage = document.getElementById('error-message');

    let vehicles = [];

    // Função para exibir a mensagem de erro
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    // Função para esconder a mensagem de erro
    function hideError() {
        errorMessage.classList.add('hidden');
    }

    // Função para aplicar a máscara da placa
    function applyPlateMask(input) {
        input.addEventListener('input', () => {
            let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (value.length > 7) {
                value = value.slice(0, 7);
            }
            if (value.length > 3) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            }
            input.value = value;
        });
    }

    applyPlateMask(plateInput);

    // Função para buscar os veículos
    async function fetchVehicles() {
        try {
            const response = await fetch('http://localhost:3000/vehicles');
            if (!response.ok) {
                throw new Error('Erro ao carregar os veículos');
            }
            vehicles = await response.json();
            renderVehicles();
            hideError();
        } catch (error) {
            console.error('Erro ao buscar os veículos:', error);
            showError('Erro ao carregar os veículos. Tente novamente mais tarde.');
        }
    }

    // Função para salvar um novo veículo
    async function saveVehicle(vehicle) {
        try {
            const response = await fetch('http://localhost:3000/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicle)
            });
            if (!response.ok) {
                throw new Error('Erro ao salvar o veículo');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao salvar o veículo:', error);
            showError('Erro ao salvar o veículo. Tente novamente mais tarde.');
        }
    }

    // Função para atualizar um veículo existente
    async function updateVehicle(id, vehicle) {
        try {
            const response = await fetch(`http://localhost:3000/vehicles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicle)
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar o veículo');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar o veículo:', error);
            showError('Erro ao atualizar o veículo. Tente novamente mais tarde.');
        }
    }

    // Função para excluir um veículo
    async function deleteVehicle(id) {
        try {
            const response = await fetch(`http://localhost:3000/vehicles/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Erro ao excluir o veículo');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao excluir o veículo:', error);
            showError('Erro ao excluir o veículo. Tente novamente mais tarde.');
        }
    }

    // Função para renderizar a lista de veículos
    function renderVehicles() {
        vehicleList.innerHTML = '';
        vehicles.forEach((vehicle, index) => {
            const vehicleBlock = document.createElement('div');
            vehicleBlock.classList.add('vehicle-block');
            vehicleBlock.innerHTML = `
                <h3>${vehicle.yearModel} - ${vehicle.plate}</h3>
                <p>Veículo: ${vehicle.vehicle}</p>
                <p>Marca: ${vehicle.brand}</p>
                <p>Motor: ${vehicle.engine}</p>
                <p>Cor: ${vehicle.color}</p>
                <p>Nível de Combustível: ${vehicle.fuelLevel}</p>
                <button class="btn edit-btn" data-index="${index}" data-id="${vehicle.id}">Editar</button>
                <button class="btn delete-btn" data-id="${vehicle.id}">Excluir</button>
            `;
            vehicleList.appendChild(vehicleBlock);
        });
    }

    // Mostrar ou esconder o formulário de adicionar veículo
    if (addVehicleBtn && formSection) {
        addVehicleBtn.addEventListener('click', () => {
            formSection.classList.toggle('hidden');
        });
    }

    // Exibir ou esconder o menu
    if (menuIcon && menu) {
        menuIcon.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    // Adicionar ou editar um veículo ao enviar o formulário
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const vehicle = {
                vehicle: document.getElementById('vehicle').value,
                brand: document.getElementById('brand').value,
                yearModel: document.getElementById('year-model').value,
                engine: document.getElementById('engine').value,
                color: document.getElementById('color').value,
                plate: document.getElementById('plate').value,
                fuelLevel: document.getElementById('fuel-level').value
            };

            const editIndex = vehicleForm.getAttribute('data-edit-index');
            if (editIndex !== null) {
                const id = vehicles[editIndex].id;
                const updatedVehicle = await updateVehicle(id, vehicle);
                vehicles[editIndex] = updatedVehicle;
                vehicleForm.removeAttribute('data-edit-index');
            } else {
                const newVehicle = await saveVehicle(vehicle);
                vehicles.push(newVehicle);
            }

            renderVehicles();
            formSection.classList.add('hidden');
            vehicleForm.reset();
        });
    }

    // Editar ou excluir um veículo ao clicar nos botões
    vehicleList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const index = event.target.getAttribute('data-index');
            const vehicle = vehicles[index];

            document.getElementById('vehicle').value = vehicle.vehicle;
            document.getElementById('brand').value = vehicle.brand;
            document.getElementById('year-model').value = vehicle.yearModel;
            document.getElementById('engine').value = vehicle.engine;
            document.getElementById('color').value = vehicle.color;
            document.getElementById('plate').value = vehicle.plate;
            document.getElementById('fuel-level').value = vehicle.fuelLevel;

            formSection.classList.remove('hidden');
            vehicleForm.setAttribute('data-edit-index', index);
        } else if (event.target.classList.contains('delete-btn')) {
            const id = event.target.getAttribute('data-id');
            await deleteVehicle(id);
            vehicles = vehicles.filter(vehicle => vehicle.id !== id);
            renderVehicles();
        }
    });

    // Carregar os veículos ao carregar a página
    fetchVehicles();
});
