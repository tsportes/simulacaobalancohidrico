var data = [{
    "type": "sunburst",
    "labels": [
        "VOL ENTRADA",
        "CONS AUTORIZADO",
        "VOL PERDAS",
        "FATURADO",
        "NÃO FATURADO",
        "APARENTES",
        "REAIS",
        "EXPORTADO",
        "FAT MEDIDO",
        "FAT NÃO MEDIDO",
        "NÃO FAT MEDIDO",
        "NÃO FAT NÃO MEDIDO",
        "SUBMEDIÇÃO",
        "CLANDESTINOS",
        "FRAUDES",
        "VAZ RAMAIS",
        "VAZ REDES",
        "VAZ RESERVATORIOS",
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
    var volEntradaInput = document.getElementById('volEntrada');
    data[0].values[0] = volEntradaInput.value; // Atualizar o valor de "VOL ENTRADA"

    var consAutorizadoInput = document.getElementById('consAutorizado');
    data[0].values[1] = consAutorizadoInput.value; // Atualizar o valor de "CONS AUTORIZADO"

    // Atualize mais valores como os acima para cada campo de entrada

    Plotly.react('chart', data, layout); // Replotar o gráfico com os novos dados

    let svgElement = document.querySelector('.main-svg');
    if (svgElement) {
        svgElement.style.background = 'transparent';
    };
    atualizarLabels()
};

// Atualizar labels
function atualizarLabels() {
    const volumeEntrada = document.getElementById('volEntrada').value;
    const volumeAutorizado = document.getElementById('consAutorizado').value;

    document.getElementById('volumeEntrada').textContent = volumeEntrada;
    document.getElementById('consumoAutorizado').textContent = volumeAutorizado;
}

window.onload = function() {
    let svgElement = document.querySelector('.main-svg');
    if (svgElement) {
        svgElement.style.background = 'transparent';
    }
};