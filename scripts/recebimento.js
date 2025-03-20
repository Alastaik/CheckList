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
                    <strong>Observações:</strong> ${recebimento.observations} <br>
                    <strong>Peças/Acessórios:</strong> ${recebimento.parts} <br>
                    <strong>Observações de Avarias:</strong> ${recebimento.observacoesAvarias} <br>
                    <strong>Serviços Realizados:</strong> ${recebimento.servicosRealizados}
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

        const parts = {
            bateria: document.querySelector('input[name="bateria"]:checked')?.value || 'não',
            macaco: document.querySelector('input[name="macaco"]:checked')?.value || 'não',
            triangulo: document.querySelector('input[name="triangulo"]:checked')?.value || 'não',
            chaveRoda: document.querySelector('input[name="chave-roda"]:checked')?.value || 'não',
            computadorBordo: document.querySelector('input[name="computador-bordo"]:checked')?.value || 'não',
            extintor: document.querySelector('input[name="extintor"]:checked')?.value || 'não',
            jogoTapetes: document.querySelector('input[name="jogo-tapetes"]:checked')?.value || 'não',
            vidrosEletricos: document.querySelector('input[name="vidros-eletricos"]:checked')?.value || 'não',
            travaEletrica: document.querySelector('input[name="trava-eletrica"]:checked')?.value || 'não',
            funcionamento: document.querySelector('input[name="funcionamento"]:checked')?.value || 'não',
            manual: document.querySelector('input[name="manual"]:checked')?.value || 'não',
            documentosDetran: document.querySelector('input[name="documentos-detran"]:checked')?.value || 'não',
            chaveReserva: document.querySelector('input[name="chave-reserva"]:checked')?.value || 'não'
        };

        const formData = {
            entryDate: document.getElementById('entry-date').value,
            entryTime: document.getElementById('entry-time').value,
            exitDate: exitDateInput.value,
            exitTime: exitTimeInput.value,
            vehicle: vehicleSelect.value,
            driverId: document.getElementById('driver-id').value,
            driverName: document.getElementById('driver-name').value,
            cardNumber: document.getElementById('card-number').value,
            observations: document.getElementById('observations').value,
            parts: parts,
            observacoesAvarias: document.getElementById('observacoes-avarias').value,
            servicosRealizados: document.getElementById('servicos-realizados').value
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
            if (!// filepath: c:\Users\User\Documents\my-website\scripts\recebimento.js
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
                    <strong>Observações:</strong> ${recebimento.observations} <br>
                    <strong>Peças/Acessórios:</strong> ${recebimento.parts} <br>
                    <strong>Observações de Avarias:</strong> ${recebimento.observacoesAvarias} <br>
                    <strong>Serviços Realizados:</strong> ${recebimento.servicosRealizados}
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

        const parts = {
            bateria: document.querySelector('input[name="bateria"]:checked')?.value || 'não',
            macaco: document.querySelector('input[name="macaco"]:checked')?.value || 'não',
            triangulo: document.querySelector('input[name="triangulo"]:checked')?.value || 'não',
            chaveRoda: document.querySelector('input[name="chave-roda"]:checked')?.value || 'não',
            computadorBordo: document.querySelector('input[name="computador-bordo"]:checked')?.value || 'não',
            extintor: document.querySelector('input[name="extintor"]:checked')?.value || 'não',
            jogoTapetes: document.querySelector('input[name="jogo-tapetes"]:checked')?.value || 'não',
            vidrosEletricos: document.querySelector('input[name="vidros-eletricos"]:checked')?.value || 'não',
            travaEletrica: document.querySelector('input[name="trava-eletrica"]:checked')?.value || 'não',
            funcionamento: document.querySelector('input[name="funcionamento"]:checked')?.value || 'não',
            manual: document.querySelector('input[name="manual"]:checked')?.value || 'não',
            documentosDetran: document.querySelector('input[name="documentos-detran"]:checked')?.value || 'não',
            chaveReserva: document.querySelector('input[name="chave-reserva"]:checked')?.value || 'não'
        };

        const formData = {
            entryDate: document.getElementById('entry-date').value,
            entryTime: document.getElementById('entry-time').value,
            exitDate: exitDateInput.value,
            exitTime: exitTimeInput.value,
            vehicle: vehicleSelect.value,
            driverId: document.getElementById('driver-id').value,
            driverName: document.getElementById('driver-name').value,
            cardNumber: document.getElementById('card-number').value,
            observations: document.getElementById('observations').value,
            parts: parts,
            observacoesAvarias: document.getElementById('observacoes-avarias').value,
            servicosRealizados: document.getElementById('servicos-realizados').value
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
            if (!
