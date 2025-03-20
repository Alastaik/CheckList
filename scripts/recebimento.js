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
            observations: document.getElementById('observations').value,
            accessories: {
                bateria: document.querySelector('input[name="bateria"]:checked')?.value || 'não',
                bateriaDanificado: document.querySelector('input[name="bateria-danificado"]:checked')?.value || 'não',
                macaco: document.querySelector('input[name="macaco"]:checked')?.value || 'não',
                macacoDanificado: document.querySelector('input[name="macaco-danificado"]:checked')?.value || 'não',
                triangulo: document.querySelector('input[name="triangulo"]:checked')?.value || 'não',
                trianguloDanificado: document.querySelector('input[name="triangulo-danificado"]:checked')?.value || 'não',
                chaveDeRoda: document.querySelector('input[name="chave-de-roda"]:checked')?.value || 'não',
                chaveDeRodaDanificado: document.querySelector('input[name="chave-de-roda-danificado"]:checked')?.value || 'não',
                computadorDeBordo: document.querySelector('input[name="computador-de-bordo"]:checked')?.value || 'não',
                computadorDeBordoDanificado: document.querySelector('input[name="computador-de-bordo-danificado"]:checked')?.value || 'não',
                extintor: document.querySelector('input[name="extintor"]:checked')?.value || 'não',
                extintorDanificado: document.querySelector('input[name="extintor-danificado"]:checked')?.value || 'não',
                jogoDeTapetes: document.querySelector('input[name="jogo-de-tapetes"]:checked')?.value || 'não',
                jogoDeTapetesDanificado: document.querySelector('input[name="jogo-de-tapetes-danificado"]:checked')?.value || 'não',
                vidrosEletricos: document.querySelector('input[name="vidros-eletricos"]:checked')?.value || 'não',
                vidrosEletricosDanificado: document.querySelector('input[name="vidros-eletricos-danificado"]:checked')?.value || 'não',
                travaEletrica: document.querySelector('input[name="trava-eletrica"]:checked')?.value || 'não',
                travaEletricaDanificado: document.querySelector('input[name="trava-eletrica-danificado"]:checked')?.value || 'não',
                funcionamento: document.querySelector('input[name="funcionamento"]:checked')?.value || 'não',
                funcionamentoDanificado: document.querySelector('input[name="funcionamento-danificado"]:checked')?.value || 'não',
                manual: document.querySelector('input[name="manual"]:checked')?.value || 'não',
                manualDanificado: document.querySelector('input[name="manual-danificado"]:checked')?.value || 'não',
                documentosDetran: document.querySelector('input[name="documentos-detran"]:checked')?.value || 'não',
                documentosDetranDanificado: document.querySelector('input[name="documentos-detran-danificado"]:checked')?.value || 'não',
                chaveReserva: document.querySelector('input[name="chave-reserva"]:checked')?.value || 'não',
                chaveReservaDanificado: document.querySelector('input[name="chave-reserva-danificado"]:checked')?.value || 'não'
            },
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
            document.getElementById('observacoes-avarias').value = recebimento.observacoesAvarias;
            document.getElementById('servicos-realizados').value = recebimento.servicosRealizados;

            // Preencher os checkboxes de acessórios
            document.querySelector(`input[name="bateria"][value="${recebimento.accessories.bateria}"]`).checked = true;
            document.querySelector(`input[name="bateria-danificado"][value="${recebimento.accessories.bateriaDanificado}"]`).checked = true;
            document.querySelector(`input[name="macaco"][value="${recebimento.accessories.macaco}"]`).checked = true;
            document.querySelector(`input[name="macaco-danificado"][value="${recebimento.accessories.macacoDanificado}"]`).checked = true;
            document.querySelector(`input[name="triangulo"][value="${recebimento.accessories.triangulo}"]`).checked = true;
            document.querySelector(`input[name="triangulo-danificado"][value="${recebimento.accessories.trianguloDanificado}"]`).checked = true;
            document.querySelector(`input[name="chave-de-roda"][value="${recebimento.accessories.chaveDeRoda}"]`).checked = true;
            document.querySelector(`input[name="chave-de-roda-danificado"][value="${recebimento.accessories.chaveDeRodaDanificado}"]`).checked = true;
            document.querySelector(`input[name="computador-de-bordo"][value="${recebimento.accessories.computadorDeBordo}"]`).checked = true;
            document.querySelector(`input[name="computador-de-bordo-danificado"][value="${recebimento.accessories.computadorDeBordoDanificado}"]`).checked = true;
            document.querySelector(`input[name="extintor"][value="${recebimento.accessories.extintor}"]`).checked = true;
            document.querySelector(`input[name="extintor-danificado"][value="${recebimento.accessories.extintorDanificado}"]`).checked = true;
            document.querySelector(`input[name="jogo-de-tapetes"][value="${recebimento.accessories.jogoDeTapetes}"]`).checked = true;
            document.querySelector(`input[name="jogo-de-tapetes-danificado"][value="${recebimento.accessories.jogoDeTapetesDanificado}"]`).checked = true;
            document.querySelector(`input[name="vidros-eletricos"][value="${recebimento.accessories.vidrosEletricos}"]`).checked = true;
            document.querySelector(`input[name="vidros-eletricos-danificado"][value="${recebimento.accessories.vidrosEletricosDanificado}"]`).checked = true;
            document.querySelector(`input[name="trava-eletrica"][value="${recebimento.accessories.travaEletrica}"]`).checked = true;
            document.querySelector(`input[name="trava-eletrica-danificado"][value="${recebimento.accessories.travaEletricaDanificado}"]`).checked = true;
            document.querySelector(`input[name="funcionamento"][value="${recebimento.accessories.funcionamento}"]`).checked = true;
            document.querySelector(`input[name="funcionamento-danificado"][value="${recebimento.accessories.funcionamentoDanificado}"]`).checked = true;
            document.querySelector(`input[name="manual"][value="${recebimento.accessories.manual}"]`).checked = true;
            document.querySelector(`input[name="manual-danificado"][value="${recebimento.accessories.manualDanificado}"]`).checked = true;
            document.querySelector(`input[name="documentos-detran"][value="${recebimento.accessories.documentosDetran}"]`).checked = true;
            document.querySelector(`input[name="documentos-detran-danificado"][value="${recebimento.accessories.documentosDetranDanificado}"]`).checked = true;
            document.querySelector(`input[name="chave-reserva"][value="${recebimento.accessories.chaveReserva}"]`).checked = true;
            document.querySelector(`input[name="chave-reserva-danificado"][value="${recebimento.accessories.chaveReservaDanificado}"]`).checked = true;
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
