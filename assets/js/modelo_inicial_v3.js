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

Plotly.newPlot('chart', data, layout, {
    showSendToCloud: true
});

atualizarGauge(34.3);

function updateData() {

    // Definição das variáveis

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
    var estimativaFraudes = (percentualFraudes / 100);
    var volFraudes = Math.floor(parseFloat(estimativaFraudes) * parseInt(volFaturadoMedido)); // Calcula as fraudes
    var consAutorizadoNaoFaturado = parseInt(volNaoFaturadoMedido) + parseInt(volNaoFaturadoNaoMedido);
    var consAutorizadoFaturado = parseInt(volAguaExportada) + parseInt(volFaturadoMedido) + parseInt(volFaturadoNaoMedido);
    var consAutorizado = parseInt(consAutorizadoFaturado) + parseInt(consAutorizadoNaoFaturado);
    var volPerdas = parseInt(volEntrada) - parseInt(consAutorizado);
    var volSubmedicao = Math.floor(((parseInt(consAutorizadoFaturado) * (100 / parseInt(idm))) - parseInt(consAutorizadoFaturado))); // Calcula a submedição
    var volPerdasAparentes = parseInt(volSubmedicao) + parseInt(volClandestinas) + parseInt(volFraudes);
    var volPerdasReais = parseInt(volPerdas) - parseInt(volPerdasAparentes);
    var volVazamentoRamais = Math.floor(((parseInt(volPerdas) - parseInt(volPerdasAparentes)) * 0.8));
    var volVazamentoRedes = (parseInt(volPerdasReais) - parseInt(vazReservatorios) - parseInt(volVazamentoRamais));

    // Chama função atualizar labels
    atualizarLabels(volEntrada, volAguaExportada, volFaturadoMedido, volFaturadoNaoMedido, volNaoFaturadoMedido, volNaoFaturadoNaoMedido, idm, qtdeRamaisPressurizados, percentualFraudes, vazReservatorios, consAutorizado, consAutorizadoFaturado);

    var vazamentos = Number(vazReservatorios) + Number(volVazamentoRamais);

    // Validações
    if (Number(volSubmedicao) >= Number(volPerdas)) {
        document.getElementById('btnAtualizar').classList.add("visivel");
        alert('Esta operação fará com que o valor de submedição seja maior que o de perdas. Recarregue a página!');
        throw new Error("O valor de submedição é maior que o volume de perdas...");
    } else if (Number(volPerdasReais) < Number(vazamentos)) {
        document.getElementById('btnAtualizar').classList.add("visivel");
        alert('Esta operação fará com que o valor de perdas seja menor que o de seus componentes. Se necessário, recarregue a página!');
        throw new Error("O valor de perdas é menor que o de seus componentes...");
    } else {
        // Atribuir valores
        data[0].values[13] = volClandestinas; // Atualizar o valor de "Clandestinos"
        data[0].values[14] = volFraudes; // Atualizar o valor de "Fraudes"
        data[0].values[4] = consAutorizadoNaoFaturado; // Atualizar o valor de "CONS AUTORIZADO"
        data[0].values[3] = consAutorizadoFaturado; // Atualizar o valor de "CONS AUTORIZADO"
        data[0].values[1] = consAutorizado; // Atualizar o valor de "Consumo autorizado"
        data[0].values[2] = volPerdas; // Atualizar o valor de "Perdas"
        data[0].values[12] = volSubmedicao; // Atualizar o valor de "Submedição"
        data[0].values[5] = volPerdasAparentes; // Atualizar o valor de "Perdas aparentes"
        data[0].values[6] = volPerdasReais; // Atualizar o valor de "Perdas reais"
        data[0].values[15] = volVazamentoRamais; // Atualizar o valor de "Vazamento em ramais"
        data[0].values[16] = volVazamentoRedes; // Atualizar o valor de "Vazamento em redes"
        data[0].values[0] = parseInt(volEntrada); // Atualizar o "Volume de entrada"
        data[0].values[7] = parseInt(volAguaExportada); // Atualizar o valor de "Volume água exportada"
        data[0].values[8] = parseInt(volFaturadoMedido); // Atualizar o valor de "Volume água exportada"
        data[0].values[9] = parseInt(volFaturadoNaoMedido); // Atualizar o valor de "Volume faturado não medido"
        data[0].values[10] = parseInt(volNaoFaturadoMedido); // Atualizar o valor de "Volume não faturado medido"
        data[0].values[11] = parseInt(volNaoFaturadoNaoMedido); // Atualizar o valor de "Volume não faturado não medido"
        data[0].values[17] = parseInt(vazReservatorios); // Atualizar o valor de "Volume não faturado não medido"
    }

    // Chama função atualizar labels
    atualizarLabels(volEntrada, volAguaExportada, volFaturadoMedido, volFaturadoNaoMedido, volNaoFaturadoMedido, volNaoFaturadoNaoMedido, idm, qtdeRamaisPressurizados, percentualFraudes, vazReservatorios, consAutorizado, consAutorizadoFaturado);

    // Replotar o gráfico com os novos dados
    Plotly.react('chart', data, layout);

    let svgElement = document.querySelector('.main-svg');
    if (svgElement) {
        svgElement.style.background = 'transparent';
    };

    // Chama função para plotar gráfico de perdas
    const indicePerdas = calcularIndice(consAutorizado, volEntrada);
    atualizarGauge(indicePerdas);

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

function recarregar() {
    location.reload()
}

// Retorna dados no console
document.ondblclick = function() {
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

// Plotar gráfico de perdas

function calcularIndice(consAutorizado, volEntrada) {
    // Código antigo e funcional
    // return ((volumeProduzido - volumeConsumido) / volumeProduzido) * 100;

    const baseIndice = 27.742249;
    const incrementoPor1000VolumeConsumido = -4.50982088e-6;
    const incrementoPor1000VolumeProduzido = 3.34325927e-6;

    const incrementoConsumido = (consAutorizado) * incrementoPor1000VolumeConsumido * 1000;
    const incrementoProduzido = (volEntrada) * incrementoPor1000VolumeProduzido * 1000;

    const indice = baseIndice + incrementoConsumido + incrementoProduzido;
    return indice;
}

function atualizarGauge(indice) {
    let corIndicador;

    if (indice <= 15) {
        corIndicador = '#00bded';
    } else if (indice <= 30) {
        corIndicador = '#00a300';
    } else if (indice <= 50) {
        corIndicador = '#ffd349';
    } else if (indice <= 75) {
        corIndicador = '#ff0000';
    } else {
        corIndicador = '#990000';
    }

    const gaugeData = {
        domain: { x: [0, 1], y: [0, 1] },
        value: indice,
        title: { text: 'Índice de Perdas de Água (%)' },
        gauge: {
            axis: { range: [0, 100] },
            bar: { color: corIndicador },
            bgcolor: 'white',
            borderwidth: 2,
            bordercolor: 'rgba(58, 71, 80, 0.9)'
        },
        type: 'indicator',
        mode: 'gauge+number'
    };

    Plotly.newPlot('gauge', [gaugeData]);
}

window.onload = function() {
    let svgElement = document.querySelectorAll('.main-svg');

    for (let i = 0; i < svgElement.length; i++) {
        svgElement[i].style.background = 'transparent';
    }

};