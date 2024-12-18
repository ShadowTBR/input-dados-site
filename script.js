// Seleciona o formulário e a mensagem de resposta
const form = document.getElementById('obraForm');
const responseMessage = document.getElementById('responseMessage');

// Adiciona um ouvinte ao evento de envio do formulário
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita o comportamento padrão do formulário (recarregar a página)

  // Coleta os dados do formulário
  const formData = {
    //DADOS GERAIS
    nota: document.getElementById('nota').value || null,
    pep: document.getElementById('pep').value || null,
    regional: document.getElementById('regional').value || null,
    municipio: document.getElementById('municipio').value || null,
    tipoObra: document.getElementById('tipoObra').value || null,
    descricaoObra: document.getElementById('descricaoObra').value || null,
    tranche: document.getElementById('tranche').value || null,
    parceira: document.getElementById('parceira').value || null,
    anoDemanda: document.getElementById('anoDemanda').value || null,
    anoUni: document.getElementById('anoUni').value || null,
    notaAntiga: document.getElementById('notaAntiga').value || null,

    //DADOS FÍSICOS
    numLigacoes: document.getElementById('numLigacoes').value || null,
    totalKm: parseFloat(document.getElementById('totalKm').value) || null,
    
    //LICENÇA AMBIENTAL & OUTROS
    licencaAmbiental: document.getElementById('licencaAmbiental').value || null,
    retornoRegional: document.getElementById('retornoRegional').value || null,
    
  };

  console.log('Dados do formulário:', formData);

  try {
    const response = await fetch('http://15.229.2.170:3333/add-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      responseMessage.textContent = 'Dados enviados com sucesso!';
      responseMessage.style.color = 'green';
      responseMessage.classList.add('visible'); // Exibe a mensagem
      responseMessage.classList.remove('error'); // Remove a classe de erro, caso exista
    } else {
      const errorData = await response.json();
      responseMessage.textContent = `Erro: ${errorData.message}`;
      responseMessage.style.color = 'red';
      responseMessage.classList.add('visible'); // Exibe a mensagem
      responseMessage.classList.remove('success'); // Remove a classe de sucesso, caso exista
    }

    form.reset();

  } catch (error) {
    responseMessage.textContent = 'Erro ao conectar ao servidor. Verifique se o backend está rodando.';
    responseMessage.style.color = 'red';
    responseMessage.classList.add('visible');
    responseMessage.classList.remove('success');
    console.error('Erro ao enviar dados:', error);
  }

  setTimeout(() => {
    responseMessage.classList.remove('visible');
  }, 3000);
});

/* ------------------ FUNCIONALIDADE DE PESQUISA ------------------ */

// Elementos para pesquisa
const btnPesquisar = document.getElementById('btnPesquisar');
const pesquisaNota = document.getElementById('pesquisaNota');
const tabelaResultado = document.getElementById('tabelaResultado').querySelector('tbody');

// Evento para buscar nota no servidor
btnPesquisar.addEventListener('click', async () => {
  const nota = pesquisaNota.value;

  if (!nota) {
    alert('Digite uma nota para buscar.');
    return;
  }

  try {
    const response = await fetch(`http://15.229.2.170:3333/search-data?nota=${nota}`);

    if (response.ok) {
      const data = await response.json();
      if (data.length > 0) {
        populateResultTable(data);
      } else {
        alert('Nenhum resultado encontrado para a nota informada.');
        clearResultTable();
      }
    } else {
      alert('Nenhum resultado encontrado para a nota informada.');
    }
  } catch (error) {
    console.error('Erro na busca:', error);
    alert('Erro ao conectar com o servidor.');
  }
});

// Função para preencher a tabela de resultados
function populateResultTable(data) {
  tabelaResultado.innerHTML = ''; // Limpa resultados anteriores

  data.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tabelaResultado.appendChild(tr);
  });
}

// Função para limpar a tabela de resultados
function clearResultTable() {
  tabelaResultado.innerHTML = '';
}
