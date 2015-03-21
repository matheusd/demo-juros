/*
 * Cenário de pagamento de aluguel e poupança integral para compra de imóvel
 * a vista.
 */
var JurosCenario1 = function (element, options) {    
    return this;
};

JurosCenario1.prototype = {
    campos: function () {
        return {
            valorImovel: {
                label: "Valor do imóvel desejado",
                type: "currency1000"
            },
            poupAtual: {
                label: "Poupança atual",
                type: "currency1000"
            },
            salarioDisp: {
                label: "Salário disponível",
                type: "currency1000",
            },
            aluguel: {
                label: "Aluguel atual",
                type: "currency",
            },
            inflacao: {
                label: "Inflação",
                type: "perc"
            },
            rendimento: {
                label: "Rendimento das aplicações (a.a.)",
                type: "perc"
            },
            aumentoAluguel: {
                label: "Aumento do aluguel (a.a.)",
                type: "perc"
            },
            valorizacaoImovel: {
                label: "Valorização do imóvel (a.a.)",
                type: "perc"
            }
        }
    }
}

