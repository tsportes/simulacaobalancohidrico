function calcularIndice(volumeConsumido, volumeProduzido) {
    // Código funcional
    // return ((volumeProduzido - volumeConsumido) / volumeProduzido) * 100;

    const baseIndice = 27.742249;
    const incrementoPor1000VolumeConsumido = -4.50982088e-6;
    const incrementoPor1000VolumeProduzido = 3.34325927e-6;

    const incrementoConsumido = (volumeConsumido) * incrementoPor1000VolumeConsumido * 1000;
    const incrementoProduzido = (volumeProduzido) * incrementoPor1000VolumeProduzido * 1000;

    const indice = (baseIndice + incrementoConsumido + incrementoProduzido) < 0 ? 0 : (baseIndice + incrementoConsumido + incrementoProduzido);
    return indice;
}

function atualizarValores() {
    const volumeConsumido = document.getElementById('volumeConsumido').value;
    const volumeProduzido = document.getElementById('volumeProduzido').value;

    document.getElementById('consumidoValue').textContent = volumeConsumido;
    document.getElementById('produzidoValue').textContent = volumeProduzido;

    const indice = calcularIndice(volumeConsumido, volumeProduzido);
    atualizarGauge(indice);
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
        domain: {
            x: [0, 1],
            y: [0, 1]
        },
        value: indice,
        title: {
            text: 'Índice de Perdas de Água (%)'
        },
        gauge: {
            axis: {
                range: [0, 100]
            },
            bar: {
                color: corIndicador
            },
            bgcolor: 'transparent',
            borderwidth: 2,
            bordercolor: 'rgba(58, 71, 80, 0.9)'
        },
        type: 'indicator',
        mode: 'gauge+number'
    };

    Plotly.newPlot('gauge', [gaugeData]);

    let svgElement = document.querySelector('.main-svg');
    if (svgElement) {
        svgElement.style.background = 'transparent';
    }
}


document.getElementById('volumeConsumido').addEventListener('input', atualizarValores);
document.getElementById('volumeProduzido').addEventListener('input', atualizarValores);

atualizarValores();

document.documentElement.classList.add('js');

addEventListener('input', e => {
    let _t = e.target;

    _t.parentNode.style.setProperty('--val', +_t.value)
}, false);

window.onload = function() {
    let svgElement = document.querySelector('.main-svg');
    if (svgElement) {
        svgElement.style.background = 'transparent';
    }
};