let volumeFornecido = document.getElementById('volumeFornecido');
let consumoAutorizado = document.getElementById('consumoAutorizado');
let consumoNaoAutorizado = document.getElementById('consumoNaoAutorizado');
let percentualFraudes = document.getElementById('percentualFraudes');
let percentualSubmedicao = document.getElementById('percentualSubmedicao');
let valorConsumoClandestinas = document.getElementById('valorConsumoClandestinas');

let perdasAparentes = document.getElementById('perdasAparentes');
let perdasReais = document.getElementById('perdasReais');

let sliders = document.getElementsByClassName('slider');

for (let i = 0; i < sliders.length; i++) {
    sliders[i].addEventListener('input', function() {
        calculateLosses();
    });
}

function calculateLosses() {
    let aparentes = parseInt(volumeFornecido.value) - parseInt(consumoAutorizado.value) - parseInt(consumoNaoAutorizado.value);
    let reais = parseInt(percentualFraudes.value) + parseInt(percentualSubmedicao.value) + parseInt(valorConsumoClandestinas.value);

    perdasAparentes.textContent = aparentes < 0 ? 0 : aparentes;
    perdasReais.textContent = reais;
}

calculateLosses();