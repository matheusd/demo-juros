/*
 * Cenário de pagamento de aluguel e poupança integral para compra de imóvel
 * a vista.
 */
var JurosCenario3 = function (element, options) {    
    return this;
};

JurosCenario3.prototype = {
    campos: function () {
        return {
            valorImovel: {
                label: "Valor do imóvel desejado",
                type: "currency1000"
            },
            poupAtual: {
                label: "Poupança atual (entrada)",
                type: "currency1000"
            },
            salarioDisp: {
                label: "Salário disponível",
                type: "currency",
            },
            mesesFinan: {
                label: "Meses do financiamento",
                type: "int",
            },
            inflacao: {
                label: "Inflação",
                type: "perc"
            },
            cetFinanciamento: {
                label: "CET financiamento (a.a.)",
                type: "perc"
            },
            rendimento: {
                label: "Rendimento das aplicações (a.a.)",
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
        var rendimento = percMes2Ano(dados.rendimento);           
        var valorImovel = dados.valorImovel;      
        var valorFinan = dados.valorImovel - poup;
        poup = 0;
        var valorAmort = tof(valorFinan / dados.mesesFinan);
        var jurosFinan = percMes2Ano(dados.cetFinanciamento);                
        
        dadosCalc.tabs = {
            poup: {dados: []},
            rend: {dados: []},
            parcela: {dados: []},
            saldoDevedor: {dados: []},
            sobra: {dados: []},
            salario: {dados: []},            
        }
                
        
        for (var i = 1; i <= 480; i++) {        
            var rend = tof(poup*rendimento);
            
            if (i <= dados.mesesFinan) {
                var numParcPagas = i -1;
                var valorTotAmort = numParcPagas * valorAmort;
                var parcela = tof(valorAmort + jurosFinan * (valorFinan - valorTotAmort));
            } else {
                var parcela = 0;
            }
            
            
            var sobra = tof(salario - parcela);
            
            poup = poup + rend + sobra;
            
            
            if (i % 12 == 0) {
                salario = salario * (1+dados.reajusteSalario);
            }
            
            dadosCalc.tabs.poup.dados.push(poup);
            dadosCalc.tabs.rend.dados.push(rend);
            dadosCalc.tabs.sobra.dados.push(sobra);
            dadosCalc.tabs.parcela.dados.push(parcela);
            dadosCalc.tabs.salario.dados.push(salario);
            
            
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

