const api_key_alpha = '999YHL0UUTT27WPN'; // chave de api alpha, requisição via url
const api_key_fihub = 'ctg63apr01qn78n34co0ctg63apr01qn78n34cog'; // chave api finhub, requisição url
const paresMoedas = ['EUR', 'GBP']; // pares de moedas, utilizei as moedas mais valiosas segundo o google, a api tem limite de 5 requisições, então só coloquei 2 moedas
const simbolosAcoes = ['AAPL', 'TSLA', 'AMZN', 'META', 'GOOG']; // ações valiosas segundo o google, coloquei 5 das principais.
const coingecko = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false'; // url disponibilizado para todos, para uso na coingecko
// const para não a chave permanecer inalterada e trava para não ser retribuida, não utilização do var para não haver loop
async function atualizarMoedas() { // aqui é a parte necessaria para atualização das moedas, o async é utilizado para fazer a requisição e manter o codigo rodando
    const tabelaMoedas = document.querySelector('#moedas tbody'); // corpo da tabela do html
    tabelaMoedas.innerHTML = ''; // '' limpar a tabela antes de atualizar

    try {
        for (const par of paresMoedas) { // url para consulta alpha pega a chave do topo em '' e insere na url pela iquisição &{}
            const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=${par}&apikey=${api_key_alpha}`;
            const response = await fetch(url); // requisição para api
            const data = await response.json(); // conversor para json

            if (data['Realtime Currency Exchange Rate']) { // if para verificar se a respostas contem as informações
                const taxaAtual = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']); // pega a taxa
                const taxaAnterior = taxaAtual * (1 - (Math.random() * 0.01));  // simula uma taxa, pois a api não disponibiliza o valor anterior da moeda  e nem informa a variação
                const variacao = ((taxaAtual - taxaAnterior) / taxaAnterior) * 100; // calculo em %

                // adiciona uma linha na tabela
                tabelaMoedas.innerHTML += `
                    <tr>
                        <td>${par}/USD</td>
                        <td>${taxaAtual.toFixed(4)}</td>
                        <td>${variacao.toFixed(2)}%</td>
                    </tr>
                `;
}
}
} catch (error) { } // informa o erro no console caso apareça
}

// atualiza cotação das criptomoedas
async function atualizarCriptomoedas() {
    const tabelaCriptomoedas = document.querySelector('#criptomoedas tbody');  // seleciona o corpo da tabela
    tabelaCriptomoedas.innerHTML = ''; // '' limpa o conteudo, como informado acima

    try {
        const response = await fetch(coingecko); // faz requisição para coingecko
        const data = await response.json(); // converte a resposta json

         // retorno de dados, preenche a tabela
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
} catch (error) { } // caso ocorra erro, informa no console
}

// atualiza as ações
async function atualizarAcoes() {
    const tabelaAcoes = document.querySelector('#acoes tbody'); // seleciona o corpo
    tabelaAcoes.innerHTML = ''; // limpa o conteudo

    try {
        for (const simbolo of simbolosAcoes) {
            // monta a url com chaves, pelo topo
            const url = `https://finnhub.io/api/v1/quote?symbol=${simbolo}&token=${api_key_fihub}`;
            const response = await fetch(url); // faz requisição
            const data = await response.json(); // converte a resposta

            if (data.c && data.dp) { // verifica a disponibilidade dos dados
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
} catch (error) { } // informa no console caso tenha erro
}
// inicializador da atualização
function iniciarAtualizacao() {
    atualizarMoedas();
    atualizarCriptomoedas();
    atualizarAcoes();
    // intervalo de tempo, 60 segundos
    setInterval(() => {
        atualizarMoedas();
        atualizarCriptomoedas();
        atualizarAcoes();
    }, 60000);
}
// carregamento do dom e start
document.addEventListener('DOMContentLoaded', iniciarAtualizacao);