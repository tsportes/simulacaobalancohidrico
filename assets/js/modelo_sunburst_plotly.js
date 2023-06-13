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
    "leaf": { "opacity": 0.4 },
    "marker": { "line": { "width": 1.5 } },
    "branchvalues": 'total'
}];

var layout = {
    "margin": { "l": 0, "r": 0, "b": 0, "t": 0 },
};

Plotly.newPlot('chart', data, layout, { showSendToCloud: true })

myPlot = document.getElementById("chart");

window.onload = function() {
    let titulos = document.getElementsByClassName('slicetext');
    console.log('Carregou...');
    for (let i = 0; i < titulos.length; i++) {
        titulos[i].style.setProperty('font-family', '"Roboto Condensed", sans-serif')
        titulos[i].style.setProperty('font-size', '11px')
    }
}