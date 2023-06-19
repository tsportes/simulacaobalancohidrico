var data = [{
    "type": "sunburst",
    "labels": [
        "VOL ENTRADA", // 0
        "CONS AUTORIZADO", // 1
        "VOL PERDAS", // 2
        "FATURADO", // 3
        "NÃO FATURADO", // 4
        "APARENTES", // 5
        "REAIS", // 6
        "EXPORTADO", // 7
        "FAT MEDIDO", // 8
        "FAT NÃO MEDIDO", // 9
        "NÃO FAT MEDIDO", // 10
        "NÃO FAT NÃO MEDIDO", // 11
        "SUBMEDIÇÃO", // 12
        "CLANDESTINOS", // 13
        "FRAUDES", // 14
        "VAZ RAMAIS", // 15
        "VAZ REDES", // 16
        "VAZ RESERVATORIOS", //17
    ],
    "parents": [
        "", // 0
        "VOL ENTRADA", // 1
        "VOL ENTRADA", // 2
        "CONS AUTORIZADO", // 3
        "CONS AUTORIZADO", // 4
        "VOL PERDAS", // 5
        "VOL PERDAS", // 6
        "FATURADO", // 7
        "FATURADO", // 8
        "FATURADO", // 9
        "NÃO FATURADO", // 10
        "NÃO FATURADO", // 11
        "APARENTES", // 12
        "APARENTES", // 13
        "APARENTES", // 14
        "REAIS", // 15
        "REAIS", // 16
        "REAIS", // 17
    ],
    "values": [21250, 14297, 6953, 13158, 1139, 871, 6082, 60, 13075, 23, 39, 1100, 406, 204, 261, 4865, 1063, 154],
    "leaf": {
        "opacity": 0.4
    },
    "marker": {
        "line": {
            "width": 1.5
        }
    },
    "branchvalues": 'total'
}];

const estimClandestinas = 0.01
const consClandestinas = 34

var layout = {
    "margin": {
        "l": 0,
        "r": 0,
        "b": 0,
        "t": 0
    },
};

// Função debounce não aplicada
/* let inputElement = document.getElementById('elemento');
inputElement.oninput = debounce(function() {
    updateData();
}, 250);

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    }
} */

Plotly.newPlot('chart', data, layout, {
    showSendToCloud: true
});

function getTotalValue(label) {
    let total = 0;
    for (let i = 0; i < data[0].labels.length; i++) {
        if (data[0].parents[i] === label) {
            total += data[0].values[i];
        }
    }
    console.log("O total verificado é: ", total);
    return total;
}

function updateValue(index, newValue) {
    let parentLabel = data[0].parents[index];
    let totalValue = getTotalValue(data[0].labels[index]);

    if (newValue < totalValue) {
        throw new Error("O valor (" + newValue + ") para " + data[0].labels[index] + " é menor que a soma dos seus filhos: " + totalValue + ".");
    }

    data[0].values[index] = newValue;

    if (parentLabel) {
        let parentIndex = data[0].labels.indexOf(parentLabel);
        if (data[0].values[parentIndex] < getTotalValue(parentLabel)) {
            throw new Error("O valor para " + parentLabel + ": " + getTotalValue(parentLabel) + " é menor que a soma dos seus filhos (" + data[0].values[parentIndex] + ") após a atualização de " + data[0].labels[index]);
        }
    }
}


function updateData() {

    // Verificar se os dados são válidos e depois envia para confirmação

    var volEntrada = document.getElementById('volEntrada').value;

    var volAguaExportada = document.getElementById('volAguaExportada').value;

    var volFaturadoMedido = document.getElementById('volFaturadoMedido').value;

    var volFaturadoNaoMedido = document.getElementById('volFaturadoNaoMedido').value;

    var volNaoFaturadoMedido = document.getElementById('volNaoFaturadoMedido').value;

    var volNaoFaturadoNaoMedido = document.getElementById('volNaoFaturadoNaoMedido').value;

    var vazReservatorios = document.getElementById('vazReservatorios').value;

    var percentualIDMinput = document.getElementById('percentualIDM').value;

    var idm = parseFloat(percentualIDMinput);

    var percentualFraudes = document.getElementById('percentualFraudes').value;

    var qtdeRamaisPressurizados = (document.getElementById('qtdeRamaisPressurizados').value) / 1000;

    var estimativaClandestinas = parseInt(qtdeRamaisPressurizados) * estimClandestinas;

    var volClandestinas = parseInt(estimativaClandestinas) * consClandestinas; // Calcula os clandestinos
    // data[0].values[13] = volClandestinas; // Atualizar o valor de "Clandestinos"

    var estimativaFraudes = (percentualFraudes / 100);

    var volFraudes = parseFloat(estimativaFraudes) * parseInt(volFaturadoMedido); // Calcula as fraudes
    // data[0].values[14] = Math.floor(volFraudes); // Atualizar o valor de "Fraudes"

    var consAutorizadoNaoFaturado = parseInt(volNaoFaturadoMedido) + parseInt(volNaoFaturadoNaoMedido);
    // data[0].values[4] = consAutorizadoNaoFaturado; // Atualizar o valor de "CONS AUTORIZADO"

    var consAutorizadoFaturado = parseInt(volAguaExportada) + parseInt(volFaturadoMedido) + parseInt(volFaturadoNaoMedido);
    // data[0].values[3] = consAutorizadoFaturado; // Atualizar o valor de "CONS AUTORIZADO"

    var consAutorizado = parseInt(consAutorizadoFaturado) + parseInt(consAutorizadoNaoFaturado);
    //data[0].values[1] = consAutorizado; // Atualizar o valor de "Consumo autorizado"

    var volPerdas = parseInt(volEntrada) - parseInt(consAutorizado);
    // data[0].values[2] = volPerdas; // Atualizar o valor de "Perdas"

    var volSubmedicao = ((parseInt(consAutorizadoFaturado) * (100 / parseInt(idm))) - parseInt(consAutorizadoFaturado)); // Calcula a submedição
    // data[0].values[12] = Math.floor(volSubmedicao); // Atualizar o valor de "Submedição"

    var volPerdasAparentes = parseInt(volSubmedicao) + parseInt(volClandestinas) + parseInt(volFraudes);
    // data[0].values[5] = volPerdasAparentes; // Atualizar o valor de "Perdas aparentes"

    var volPerdasReais = parseInt(volPerdas) - parseInt(volPerdasAparentes);
    // data[0].values[6] = volPerdasReais; // Atualizar o valor de "Perdas reais"

    var volVazamentoRamais = ((parseInt(volPerdas) - parseInt(volPerdasAparentes)) * 0.8);
    // data[0].values[15] = Math.floor(volVazamentoRamais); // Atualizar o valor de "Vazamento em ramais"

    var volVazamentoRedes = (parseInt(volPerdasReais) - parseInt(vazReservatorios) - parseInt(volVazamentoRamais));
    // data[0].values[16] = volVazamentoRedes; // Atualizar o valor de "Vazamento em redes"

    updateValue(13, volClandestinas); // Atualizar o valor de "Clandestinos"
    updateValue(14, (Math.floor(volFraudes)));
    updateValue(4, consAutorizadoNaoFaturado);
    updateValue(3, consAutorizadoFaturado);
    updateValue(1, consAutorizado);
    updateValue(2, volPerdas);
    updateValue(12, (Math.floor(volSubmedicao)));
    updateData(5, volPerdasAparentes);
    updateData(6, volPerdasReais);
    updateData(15, (Math.floor(volVazamentoRamais)));
    updateData(16, volVazamentoRedes);

    updateData(0, volEntrada);
    updateData(7, volAguaExportada);
    updateData(8, volFaturadoMedido);
    updateData(9, volFaturadoNaoMedido);
    updateData(10, volNaoFaturadoMedido);
    updateData(11, volNaoFaturadoNaoMedido);
    updateData(17, vazReservatorios);

    //data[0].values[0] = parseInt(volEntrada); // Atualizar o "Volume de entrada"
    //data[0].values[7] = parseInt(volAguaExportada); // Atualizar o valor de "Volume água exportada"
    //data[0].values[8] = parseInt(volFaturadoMedido); // Atualizar o valor de "Volume água exportada"
    //data[0].values[9] = parseInt(volFaturadoNaoMedido); // Atualizar o valor de "Volume faturado não medido"
    //data[0].values[10] = parseInt(volNaoFaturadoMedido); // Atualizar o valor de "Volume não faturado medido"
    //data[0].values[11] = parseInt(volNaoFaturadoNaoMedido); // Atualizar o valor de "Volume não faturado não medido"
    //data[0].values[17] = parseInt(vazReservatorios); // Atualizar o valor de "Volume não faturado não medido"

    Plotly.react('chart', data, layout); // Replotar o gráfico com os novos dados

    let svgElement = document.querySelector('.main-svg');
    if (svgElement) {
        svgElement.style.background = 'transparent';
    };

    atualizarLabels(volEntrada, volAguaExportada, volFaturadoMedido, volFaturadoNaoMedido, volNaoFaturadoMedido, volNaoFaturadoNaoMedido, idm, qtdeRamaisPressurizados, percentualFraudes, vazReservatorios, consAutorizado, consAutorizadoFaturado);
};


// Atualizar labels
function atualizarLabels(volEntrada, volAguaExportada, volFaturadoMedido, volFaturadoNaoMedido, volNaoFaturadoMedido, volNaoFaturadoNaoMedido, idm, qtdeRamaisPressurizados, percentualFraudes, vazReservatorios, consAutorizado, consAutorizadoFaturado) {

    document.getElementById('volEntradaLabel').textContent = volEntrada;
    document.getElementById('volEntradaLabel_').textContent = volEntrada;
    document.getElementById('volAguaExportadaLabel').textContent = volAguaExportada;
    document.getElementById('volFaturadoMedidoLabel').textContent = volFaturadoMedido;
    document.getElementById('volFaturadoNaoMedidoLabel').textContent = volFaturadoNaoMedido;
    document.getElementById('volNaoFaturadoMedidoLabel').textContent = volNaoFaturadoMedido;
    document.getElementById('volNaoFaturadoNaoMedidoLabel').textContent = volNaoFaturadoNaoMedido;
    document.getElementById('percentualIDMLabel').textContent = idm + '%';
    document.getElementById('qtdeRamaisPressurizadosLabel').textContent = qtdeRamaisPressurizados * 1000;
    document.getElementById('percentualFraudesLabel').textContent = percentualFraudes + '%';
    document.getElementById('vazReservatoriosLabel').textContent = vazReservatorios;
    document.getElementById('consAutorizadoLabel_').textContent = consAutorizado;
    document.getElementById('consAutorizadoFaturadoLabel_').textContent = consAutorizadoFaturado;
}

window.onload = function() {
    let svgElement = document.querySelector('.main-svg');
    if (svgElement) {
        svgElement.style.background = 'transparent';
    }
};

document.onclick = function() {
    console.log(data[0].labels, data[0].values);

    var volEntrada = document.getElementById('volEntrada').value;
    var volAguaExportada = document.getElementById('volAguaExportada').value;
    var volFaturadoMedido = document.getElementById('volFaturadoMedido').value;
    var volFaturadoNaoMedido = document.getElementById('volFaturadoNaoMedido').value;
    var volNaoFaturadoMedido = document.getElementById('volNaoFaturadoMedido').value;
    var volNaoFaturadoNaoMedido = document.getElementById('volNaoFaturadoNaoMedido').value;
    var vazReservatorios = document.getElementById('vazReservatorios').value;
    var percentualIDMinput = document.getElementById('percentualIDM').value;
    var idm = parseFloat(percentualIDMinput);
    var percentualFraudes = document.getElementById('percentualFraudes').value;
    var qtdeRamaisPressurizados = (document.getElementById('qtdeRamaisPressurizados').value) / 1000;
    var estimativaClandestinas = parseInt(qtdeRamaisPressurizados) * estimClandestinas;
    var volClandestinas = parseInt(estimativaClandestinas) * consClandestinas;
    var estimativaFraudes = (percentualFraudes / 100);
    var volFraudes = parseFloat(estimativaFraudes) * parseInt(volFaturadoMedido);
    var consAutorizadoNaoFaturado = parseInt(volNaoFaturadoMedido) + parseInt(volNaoFaturadoNaoMedido);
    var consAutorizadoFaturado = parseInt(volAguaExportada) + parseInt(volFaturadoMedido) + parseInt(volFaturadoNaoMedido);
    var consAutorizado = parseInt(consAutorizadoFaturado) + parseInt(consAutorizadoNaoFaturado);
    var volPerdas = parseInt(volEntrada) - parseInt(consAutorizado);
    var volSubmedicao = ((parseInt(consAutorizadoFaturado) * (100 / parseInt(idm))) - parseInt(consAutorizadoFaturado));
    var volPerdasAparentes = parseInt(volSubmedicao) + parseInt(volClandestinas) + parseInt(volFraudes);
    var volPerdasReais = parseInt(volPerdas) - parseInt(volPerdasAparentes);
    var volVazamentoRamais = Math.floor((parseInt(volPerdas) - parseInt(volPerdasAparentes)) * 0.8);
    var volVazamentoRedes = (parseInt(volPerdasReais) - parseInt(vazReservatorios) - parseInt(volVazamentoRamais));

    console.log('volEntrada: ', volEntrada);
    console.log('volAguaExportada: ', volAguaExportada);
    console.log('volFaturadoMedido: ', volFaturadoMedido);
    console.log('volFaturadoNaoMedido: ', volFaturadoNaoMedido);
    console.log('volNaoFaturadoMedido: ', volNaoFaturadoMedido);
    console.log('volNaoFaturadoNaoMedido: ', volNaoFaturadoNaoMedido);
    console.log('vazReservatorios: ', vazReservatorios);
    console.log('percentualIDMinput: ', percentualIDMinput);
    console.log('idm: ', idm);
    console.log('percentualFraudes: ', percentualFraudes);
    console.log('volFraudes: ', volFraudes);
    console.log('qtdeRamaisPressurizados: ', qtdeRamaisPressurizados);
    console.log('estimativaClandestinas: ', estimativaClandestinas);
    console.log('volClandestinas: ', volClandestinas);
    console.log('estimativaFraudes: ', estimativaFraudes);
    console.log('consAutorizadoNaoFaturado: ', consAutorizadoNaoFaturado);
    console.log('consAutorizadoFaturado: ', consAutorizadoFaturado);
    console.log('consAutorizado: ', consAutorizado);
    console.log('volPerdas: ', volPerdas);
    console.log('volSubmedicao: ', volSubmedicao);
    console.log('volPerdasAparentes: ', volPerdasAparentes);
    console.log('volPerdasReais: ', volPerdasReais);
    console.log('volVazamentoRamais: ', volVazamentoRamais);
    console.log('volVazamentoRedes: ', volVazamentoRedes);

}