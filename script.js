const API_KEY_ALPHAVANTAGE = '999YHL0UUTT27WPN'; // Substitua pela sua chave válida
const API_KEY_FINNHUB = 'ctg63apr01qn78n34co0ctg63apr01qn78n34cog'; // Substitua pela sua chave válida
const paresMoedas = ['EUR', 'GBP'];
const simbolosAcoes = ['AAPL', 'TSLA', 'AMZN', 'META', 'GOOG'];
const API_COINGECKO = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false';

async function atualizarMoedas() {
    const tabelaMoedas = document.querySelector('#moedas tbody');
    tabelaMoedas.innerHTML = '';

    try {
        for (const par of paresMoedas) {
            const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=${par}&apikey=${API_KEY_ALPHAVANTAGE}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data['Realtime Currency Exchange Rate']) {
                const taxaAtual = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
                const taxaAnterior = taxaAtual * (1 - (Math.random() * 0.01)); // Simula variação
                const variacao = ((taxaAtual - taxaAnterior) / taxaAnterior) * 100;

                tabelaMoedas.innerHTML += `
                    <tr>
                        <td>${par}/USD</td>
                        <td>${taxaAtual.toFixed(4)}</td>
                        <td>${variacao.toFixed(2)}%</td>
                    </tr>
                `;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar cotações de moedas:', error.message);
    }
}

async function atualizarCriptomoedas() {
    const tabelaCriptomoedas = document.querySelector('#criptomoedas tbody');
    tabelaCriptomoedas.innerHTML = '';

    try {
        const response = await fetch(API_COINGECKO);
        const data = await response.json();

        data.forEach((cripto, index) => {
            tabelaCriptomoedas.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${cripto.name}</td>
                    <td>${cripto.current_price.toFixed(2)}</td>
                    <td>${cripto.price_change_percentage_24h.toFixed(2)}%</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar criptomoedas:', error.message);
    }
}

async function atualizarAcoes() {
    const tabelaAcoes = document.querySelector('#acoes tbody');
    tabelaAcoes.innerHTML = '';

    try {
        for (const simbolo of simbolosAcoes) {
            const url = `https://finnhub.io/api/v1/quote?symbol=${simbolo}&token=${API_KEY_FINNHUB}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.c && data.dp) {
                tabelaAcoes.innerHTML += `
                    <tr>
                        <td>${simbolosAcoes.indexOf(simbolo) + 1}</td>
                        <td>${simbolo}</td>
                        <td>${data.c.toFixed(2)}</td>
                        <td>${data.dp.toFixed(2)}%</td>
                    </tr>
                `;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar cotações de ações:', error.message);
    }
}

function iniciarAtualizacao() {
    atualizarMoedas();
    atualizarCriptomoedas();
    atualizarAcoes();
    setInterval(() => {
        atualizarMoedas();
        atualizarCriptomoedas();
        atualizarAcoes();
    }, 60000);
}

document.addEventListener('DOMContentLoaded', iniciarAtualizacao);