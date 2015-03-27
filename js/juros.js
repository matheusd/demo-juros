!function ($) {
    

    var  JurosCalc = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.jurosCalc.defaults, options);
        if (this.options.dadosExist) {
            this.options.funcName = this.options.dadosExist.funcName;
        }
        this.func = new window[this.options.funcName]();                
        this.rebuild();
        this.reload();
    };
    
    JurosCalc.prototype = {
        constructor: JurosCalc,
        rebuild: function () {
            var campos = this.func.campos();            
            this.$element.empty();          
            var $table = $(this.options.htmlTabCampos);
            var $tbody = $table.find("tbody");            
                        
            this.buildCampoRow($tbody, "nomeCenario", {label: "Nome do Cenário", type: "text"});
            for (var nomeCampo in campos) {
                var campo = campos[nomeCampo];
                this.buildCampoRow($tbody, nomeCampo, campo);
            }
            
            this.buildCampoRow($tbody, "nomeCenario", {type: "btns"});
            this.buildCampoRow($tbody, "id", {type: "hidden"});            
            $tbody.find("[name='id']").val(Math.random());
            
            this.buildCampoRow($tbody, "poup5", {type: "currency1000", label: "Poupado em 5 anos"});            
            this.buildCampoRow($tbody, "poup10", {type: "currency1000", label: "Poupado em 10 anos"});            
            this.buildCampoRow($tbody, "poup15", {type: "currency1000", label: "Poupado em 15 anos"});            
            this.buildCampoRow($tbody, "poup20", {type: "currency1000", label: "Poupado em 20 anos"});            
            this.buildCampoRow($tbody, "poup30", {type: "currency1000", label: "Poupado em 30 anos"});            
            this.buildCampoRow($tbody, "poup40", {type: "currency1000", label: "Poupado em 40 anos"});            
            
            $table.appendTo(this.$element);
            this.$table = $table;
        },
        
        buildCampoRow: function ($tbody, nomeCampo, campo)  {
            var $tr = $("<tr>").appendTo($tbody);
            var $tdl = $("<td>").appendTo($tr).html(campo.label);
            var $tdc = $("<td>").appendTo($tr);
            this.buildCampo(nomeCampo, campo, $tdc);                            
        },
        
        buildCampo: function (nomeCampo, campo, $tdc) {
            var funcName = "buildCampo_" + campo.type;
            this[funcName](nomeCampo, campo, $tdc);                        
        },
        
        buildCampo_currency1000: function (nomeCampo, campo, $tdc) {
            var $inp = $("<input type='text' class='form-control input-sm' data-type='currency1000'>").attr("name", nomeCampo).appendTo($tdc);            
            $tdc.prepend("R$ ");
            $tdc.append(" mil");
        },        
        buildCampo_currency: function (nomeCampo, campo, $tdc) {
            var $inp = $("<input type='text' class='form-control input-sm' data-type='currency'>").attr("name", nomeCampo).appendTo($tdc);            
            $tdc.prepend("R$ ");
        },
        buildCampo_perc: function (nomeCampo, campo, $tdc) {
            var $inp = $("<input type='text' class='form-control input-sm' data-type='perc'>").attr("name", nomeCampo).appendTo($tdc)            
            $tdc.append(" %");
        },
        buildCampo_text: function (nomeCampo, campo, $tdc) {
            var $inp = $("<input type='text' class='form-control input-sm' style='width: 15em'>").attr("name", nomeCampo).appendTo($tdc);                        
        },
        buildCampo_btns: function (nomeCampo, campo, $tdc)  {
            var $btn = $("<button type='button' class='btn btn-default btn-sm'>Salvar</button>").attr("name", nomeCampo).appendTo($tdc);                        
            $btn.on('click', $.proxy(this.btnSalvarCenarioClicked, this));            
            
            var $btn = $("<button type='button' class='btn btn-default btn-sm'>Recalcular</button>").attr("name", nomeCampo).appendTo($tdc);                        
            $btn.on('click', $.proxy(this.btnRecalcCenarioClicked, this));
            
            var $btn = $("<button type='button' class='btn btn-default btn-sm'>Dados</button>").attr("name", nomeCampo).appendTo($tdc);                        
            $btn.on('click', $.proxy(this.btnDadosCalcClicked, this));
        },
        buildCampo_hidden: function (nomeCampo, campo, $tdc) {
            var $inp = $("<input type='hidden'>").attr("name", nomeCampo).appendTo($tdc);                        
        },
        
        
        reload: function (e) {
            var $table = this.$table;
            var dados = this.options.dadosExist;
            for (var nome in dados) {
                var $t = $table.find("[name='"+nome+"']");
                var tipo = $t.attr("data-type");
                var val = dados[nome];
                if (tipo == "currency1000") {
                    val = val / 1000;
                } else if (tipo == "perc") {
                    val = val * 100;
                }
                $t.val(val);
            }
        },
        
        serialize: function (e) {
            var $table = this.$table;
            var $campos = $table.find("input");
            var dados = {funcName: this.options.funcName};
            $campos.each(function (index, obj) {
                var $t = $(this);
                var tipo = $t.attr("data-type");
                var val = $t.val();
                if (tipo == "currency1000") {
                    val = parseFloat(val) * 1000;
                } else if (tipo == "currency") {
                    val = parseFloat(val);
                } else if (tipo == "perc") {
                    val = parseFloat(val)/100;
                }
                dados[$t.attr("name")] = val;
            });            
            return dados;
        },
        
        
        btnSalvarCenarioClicked: function (e) {            
            var dados = this.serialize();
            localStorage.setItem("cen_" + dados.id, JSON.stringify(dados));
        },
        
        btnRecalcCenarioClicked: function (e) {
            var dadosCalc = {
                "poup5": null,
                "poup10": null,
                "poup15": null,
                "poup20": null,
                "poup30": null,
                "poup40": null,
                "tabs": {},
            };
            var dados = this.serialize();
            this.func.recalc(dados, dadosCalc);
            var $table = this.$table;
            $table.find("[name='poup5']").val((dadosCalc.poup5/1000).toFixed(2));
            $table.find("[name='poup10']").val((dadosCalc.poup10/1000).toFixed(2));
            $table.find("[name='poup15']").val((dadosCalc.poup15/1000).toFixed(2));
            $table.find("[name='poup20']").val((dadosCalc.poup20/1000).toFixed(2));
            $table.find("[name='poup30']").val((dadosCalc.poup30/1000).toFixed(2));
            $table.find("[name='poup40']").val((dadosCalc.poup40/1000).toFixed(2));
            this.dadosCalc = dadosCalc;
        },
        
        btnDadosCalcClicked: function (e) {
            var $tableDados = $("#tableDados").empty();
            if (!this.dadosCalc) return;
            var $thead = $("<thead>").appendTo($tableDados);
            var $tr = $("<tr>").appendTo($thead);
            var tabs = this.dadosCalc.tabs;
            $tr.append("<th>Mês</th>");
            if (tabs.salario) $tr.append("<th>Salário</th>");
            if (tabs.aluguel) $tr.append("<th>Aluguel</th>");
            if (tabs.sobra) $tr.append("<th>Sobra</th>");
            if (tabs.rend) $tr.append("<th>Rendimento</th>");
            if (tabs.poup) $tr.append("<th>Poupado</th>");
            
            var $tbody = $("<tbody>").appendTo($tableDados);
            for (var i = 0; i < 480; i++) {
                $tr = $("<tr>").appendTo($tbody);
                $("<td>"+(i+1)+"</td>").appendTo($tr);
                if (tabs.salario) $tr.append("<td>"+fmt(tabs.salario.dados[i])+"</td>");
                if (tabs.aluguel) $tr.append("<td>"+fmt(tabs.aluguel.dados[i])+"</td>");
                if (tabs.sobra) $tr.append("<td>"+fmt(tabs.sobra.dados[i])+"</td>");
                if (tabs.rend) $tr.append("<td>"+fmt(tabs.rend.dados[i])+"</td>");
                if (tabs.poup) $tr.append("<td>"+fmt(tabs.poup.dados[i])+"</td>");
                if ((i+1) % 12 == 0) {
                    $tr.addClass("info");
                }
            }
        }
    }
    
    $.fn.jurosCalc = function (option) {
        var args = Array.apply(null, arguments);
        args.shift();
        var internal_return;
        this.each(function () {
            var $this = $(this),
                data = $this.data('jurosCalc'),
                options = typeof option == 'object' && option;
            
            $this.data('jurosCalc', (data = new JurosCalc(this, $.extend({}, $.fn.jurosCalc.defaults, options))));
            
            if (typeof option == 'string' && typeof data[option] == 'function') {
                internal_return = data[option].apply(data, args);
                if (internal_return !== undefined) {
                    return false;
                }
            }
        });
        if (internal_return !== undefined)
            return internal_return;
        else
            return this;
    };

    $.fn.jurosCalc.defaults = {
        htmlTabCampos:
            "<table class='table table-condensed table-campos'><tbody></tbody></table>"
    };
    $.fn.jurosCalc.Constructor = JurosCalc;
    
}(window.jQuery);


function listarCenariosExistentes() {
    var cenarios = {};
    for (var i in localStorage) {        
        if (/^cen_.*$/.test(i)) {
            cenarios[i] = JSON.parse(localStorage[i]);
        }
    }
    return cenarios;
}

function tof(val) {
    return parseFloat(val.toFixed(2));
}

function fmt(val) {
    return val.toFixed(2);
}