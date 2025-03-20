document.addEventListener('DOMContentLoaded', () => {
    console.log('Document is ready!');

    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');
    const addVehicleBtn = document.getElementById('add-vehicle-btn');
    const formSection = document.getElementById('form-section');
    const vehicleList = document.getElementById('vehicle-list');
    const vehicleForm = document.getElementById('vehicle-form');
    const plateInput = document.getElementById('plate');

    let vehicles = [];

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

    async function fetchVehicles() {
        try {
            const response = await fetch('http://localhost:3000/vehicles');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            vehicles = await response.json();
            renderVehicles();
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        }
    }

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
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to save vehicle:', error);
        }
    }

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
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to update vehicle:', error);
        }
    }

    async function deleteVehicle(id) {
        try {
            const response = await fetch(`http://localhost:3000/vehicles/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            vehicles = vehicles.filter(vehicle => vehicle.id !== id);
            renderVehicles();
        } catch (error) {
            console.error('Failed to delete vehicle:', error);
        }
    }

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

    if (addVehicleBtn && formSection) {
        addVehicleBtn.addEventListener('click', () => {
            formSection.classList.toggle('hidden');
        });
    }

    if (menuIcon && menu) {
        menuIcon.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

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
        }
    });

    fetchVehicles();
});
