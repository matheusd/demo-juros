/** Cenário de aluguel para sempre. */
var  JurosCenario2 = function (element, options) {
    return this;
};

JurosCenario2.prototype = {
    campos: function () {
        return {
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
            aumentoAluguel: {
                label: "Aumento do aluguel (a.a.)",
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
        var aluguel = dados.aluguel;        
        var rendimento = dados.rendimento / 12;           
        
        dadosCalc.tabs = {
            poup: {dados: []},
            rend: {dados: []},
            sobra: {dados: []},
            aluguel: {dados: []},
            salario: {dados: []},
        }
        
        for (var i = 1; i <= 480; i++) {
            var rend = tof(poup*rendimento);
            var sobra = tof(salario - aluguel);
            
            poup = poup + rend + sobra;
            //poupTab.push(poup);
            
            if (i % 12 == 0) {
                salario = salario * (1+dados.reajusteSalario);
                aluguel = aluguel * (1+dados.aumentoAluguel);
            }
            
            dadosCalc.tabs.poup.dados.push(poup);
            dadosCalc.tabs.rend.dados.push(rend);
            dadosCalc.tabs.sobra.dados.push(sobra);
            dadosCalc.tabs.aluguel.dados.push(aluguel);
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

