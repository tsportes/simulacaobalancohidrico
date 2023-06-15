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
        "",
        "VOL ENTRADA",
        "VOL ENTRADA",
        "CONS AUTORIZADO",
        "CONS AUTORIZADO",
        "VOL PERDAS",
        "VOL PERDAS",
        "FATURADO",
        "FATURADO",
        "FATURADO",
        "NÃO FATURADO",
        "NÃO FATURADO",
        "APARENTES",
        "APARENTES",
        "APARENTES",
        "REAIS",
        "REAIS",
        "REAIS",
    ],
    "values": [256533, 171218, 85315, 157764, 13454, 25521, 59794, 756, 156731, 275, 493, 12960, 19732, 2653, 3134, 47835, 10555, 1403],
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

function updateData() {

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

    var estimativaClandestinas = parseInt(qtdeRamaisPressurizados) * 0.01;
    var volClandestinas = parseInt(estimativaClandestinas) * 34; // Calcula os clandestinos
    data[0].values[13] = volClandestinas; // Atualizar o valor de "Clandestinos"

    var estimativaFraudes = (percentualFraudes / 100);
    var volFraudes = parseInt(estimativaFraudes) * parseInt(volFaturadoMedido); // Calcula as fraudes
    data[0].values[14] = volFraudes; // Atualizar o valor de "Fraudes"

    var consAutorizadoNaoFaturado = parseInt(volNaoFaturadoMedido) + parseInt(volNaoFaturadoNaoMedido);
    data[0].values[4] = consAutorizadoNaoFaturado; // Atualizar o valor de "CONS AUTORIZADO"

    var consAutorizadoFaturado = parseInt(volAguaExportada) + parseInt(volFaturadoMedido) + parseInt(volFaturadoNaoMedido);
    data[0].values[3] = consAutorizadoFaturado; // Atualizar o valor de "CONS AUTORIZADO"

    var consAutorizado = parseInt(consAutorizadoFaturado) + parseInt(consAutorizadoNaoFaturado);
    data[0].values[1] = consAutorizado; // Atualizar o valor de "Consumo autorizado"

    var volPerdas = parseInt(volEntrada) - parseInt(consAutorizado);
    data[0].values[2] = volPerdas; // Atualizar o valor de "Perdas"

    var volSubmedicao = ((parseInt(consAutorizadoFaturado) * (100 / parseInt(idm))) - parseInt(consAutorizadoFaturado)); // Calcula a submedição
    data[0].values[12] = Math.floor(volSubmedicao); // Atualizar o valor de "Submedição"

    var volPerdasAparentes = parseInt(volSubmedicao) + parseInt(volClandestinas) + parseInt(volFraudes);
    data[0].values[5] = volPerdasAparentes; // Atualizar o valor de "Perdas aparentes"

    var volPerdasReais = parseInt(volPerdas) - parseInt(volPerdasAparentes);
    data[0].values[6] = volPerdasReais; // Atualizar o valor de "Perdas reais"

    var volVazamentoRamais = ((parseInt(volPerdas) - parseInt(volPerdasAparentes)) * 0.8);
    data[0].values[15] = volVazamentoRamais; // Atualizar o valor de "Vazamento em ramais"

    var volVazamentoRedes = parseInt(volPerdas) - parseInt(volPerdasReais) - parseInt(volVazamentoRamais);
    data[0].values[16] = volVazamentoRedes; // Atualizar o valor de "Vazamento em redes"

    data[0].values[0] = parseInt(volEntrada); // Atualizar o "Volume de entrada"
    data[0].values[7] = parseInt(volAguaExportada); // Atualizar o valor de "Volume água exportada"
    data[0].values[8] = parseInt(volFaturadoMedido); // Atualizar o valor de "Volume água exportada"
    data[0].values[9] = parseInt(volFaturadoNaoMedido); // Atualizar o valor de "Volume faturado não medido"
    data[0].values[10] = parseInt(volNaoFaturadoMedido); // Atualizar o valor de "Volume não faturado medido"
    data[0].values[11] = parseInt(volNaoFaturadoNaoMedido); // Atualizar o valor de "Volume não faturado não medido"
    data[0].values[17] = parseInt(vazReservatorios); // Atualizar o valor de "Volume não faturado não medido"

    Plotly.react('chart', data, layout); // Replotar o gráfico com os novos dados

    let svgElement = document.querySelector('.main-svg');
    if (svgElement) {
        svgElement.style.background = 'transparent';
    };

    atualizarLabels(volEntrada, volAguaExportada, volFaturadoMedido, volFaturadoNaoMedido, volNaoFaturadoMedido, volNaoFaturadoNaoMedido, idm, qtdeRamaisPressurizados, percentualFraudes, vazReservatorios);
};


// Atualizar labels
function atualizarLabels(volEntrada, volAguaExportada, volFaturadoMedido, volFaturadoNaoMedido, volNaoFaturadoMedido, volNaoFaturadoNaoMedido, idm, qtdeRamaisPressurizados, percentualFraudes, vazReservatorios) {

    document.getElementById('volEntradaLabel').textContent = volEntrada;
    document.getElementById('volAguaExportadaLabel').textContent = volAguaExportada;
    document.getElementById('volFaturadoMedidoLabel').textContent = volFaturadoMedido;
    document.getElementById('volFaturadoNaoMedidoLabel').textContent = volFaturadoNaoMedido;
    document.getElementById('volNaoFaturadoMedidoLabel').textContent = volNaoFaturadoMedido;
    document.getElementById('volNaoFaturadoNaoMedidoLabel').textContent = volNaoFaturadoNaoMedido;
    document.getElementById('percentualIDMLabel').textContent = idm;
    document.getElementById('qtdeRamaisPressurizadosLabel').textContent = qtdeRamaisPressurizados;
    document.getElementById('percentualFraudesLabel').textContent = percentualFraudes;
    document.getElementById('vazReservatoriosLabel').textContent = vazReservatorios;
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
    var estimativaClandestinas = parseInt(qtdeRamaisPressurizados) * 0.01;
    var volClandestinas = parseInt(estimativaClandestinas) * 34;
    var estimativaFraudes = (percentualFraudes / 100);
    var volFraudes = parseInt(estimativaFraudes) * parseInt(volFaturadoMedido);
    var consAutorizadoNaoFaturado = parseInt(volNaoFaturadoMedido) + parseInt(volNaoFaturadoNaoMedido);
    var consAutorizadoFaturado = parseInt(volAguaExportada) + parseInt(volFaturadoMedido) + parseInt(volFaturadoNaoMedido);
    var consAutorizado = parseInt(consAutorizadoFaturado) + parseInt(consAutorizadoNaoFaturado);
    var volPerdas = parseInt(volEntrada) - parseInt(consAutorizado);
    var volSubmedicao = ((parseInt(consAutorizadoFaturado) * (100 / parseInt(idm))) - parseInt(consAutorizadoFaturado));
    var volPerdasAparentes = parseInt(volSubmedicao) + parseInt(volClandestinas) + parseInt(volFraudes);
    var volPerdasReais = parseInt(volPerdas) - parseInt(volPerdasAparentes);
    var volVazamentoRamais = ((parseInt(volPerdas) - parseInt(volPerdasAparentes)) * 0.8);
    var volVazamentoRedes = parseInt(volPerdas) - parseInt(volPerdasReais) - parseInt(volVazamentoRamais);

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