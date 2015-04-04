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
                type: "currency",
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
            },
            reajusteSalario: {
                label: "Reajuste do Salário (a.a.)",
                type: "perc"
            },
        }
    },
    
    recalc: function (dados, dadosCalc) {        
        var poup = dados.poupAtual;
        var salario = dados.salarioDisp;
        var aluguel = dados.aluguel;        
        var rendimento = percMes2Ano(dados.rendimento);           
        var valorImovel = dados.valorImovel;        
        
        dadosCalc.tabs = {
            poup: {dados: []},
            rend: {dados: []},
            sobra: {dados: []},
            aluguel: {dados: []},
            salario: {dados: []},
            valorImovel: {dados: []},
        }
        
        for (var i = 1; i <= 480; i++) {
            if ((poup > valorImovel) && (aluguel > 0)) {
                poup = poup - valorImovel;
                aluguel = 0;
                dadosCalc.mesCompraImovel = i-1;
                dadosCalc.valorCompraImovel = valorImovel;
            }
        
        
            var rend = tof(poup*rendimento);
            var sobra = tof(salario - aluguel);
            
            poup = poup + rend + sobra;
            
            
            if (i % 12 == 0) {
                salario = salario * (1+dados.reajusteSalario);
                aluguel = aluguel * (1+dados.aumentoAluguel);
                valorImovel = valorImovel * (1+dados.valorizacaoImovel);
            }
            
            dadosCalc.tabs.poup.dados.push(poup);
            dadosCalc.tabs.rend.dados.push(rend);
            dadosCalc.tabs.sobra.dados.push(sobra);
            dadosCalc.tabs.aluguel.dados.push(aluguel);
            dadosCalc.tabs.salario.dados.push(salario);
            dadosCalc.tabs.valorImovel.dados.push(valorImovel);
            
            
            switch (i) {
                case 60: dadosCalc.poup5 = poup; break;
                case 120: dadosCalc.poup10 = poup; break;
                case 180: dadosCalc.poup15 = poup; break;
                case 240: dadosCalc.poup20 = poup; break;
                case 360: dadosCalc.poup30 = poup; break;
                case 480: dadosCalc.poup40 = poup; break;
            }
        }
        
    }
}

