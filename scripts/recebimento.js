document.addEventListener('DOMContentLoaded', () => {
    console.log('Document is ready!');

    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');
    const recebimentoForm = document.getElementById('recebimento-form');
    const vehicleSelect = document.getElementById('vehicle');
    const exitDateInput = document.getElementById('exit-date');
    const exitTimeInput = document.getElementById('exit-time');

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

    // Função para lidar com o envio do formulário
    recebimentoForm.addEventListener('submit', (event) => {
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

        console.log('Form Data:', formData);
        // Aqui você pode adicionar a lógica para salvar os dados no servidor
    });

    if (menuIcon && menu) {
        menuIcon.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    fetchVehicles();
});
