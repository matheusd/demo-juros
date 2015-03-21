!function ($) {
    

    var  JurosCalc = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.jurosCalc.defaults, options);
        this.func = new this.options.func();        
        this.rebuild()
    };
    
    JurosCalc.prototype = {
        constructor: JurosCalc,
        rebuild: function () {
            var campos = this.func.campos();            
            this.$element.empty();          
            var $table = $(this.options.htmlTabCampos);
            var $tbody = $table.find("tbody");
            for (var nomeCampo in campos) {
                var campo = campos[nomeCampo];
                
                var $tr = $("<tr>").appendTo($tbody);
                var $tdl = $("<td>").appendTo($tr).html(campo.label);
                var $tdc = $("<td>").appendTo($tr);
                this.buildCampo(nomeCampo, campo, $tdc);                
            }
            $table.appendTo(this.$element);
        },
        buildCampo: function (nomeCampo, campo, $tdc) {
            var funcName = "buildCampo_" + campo.type;
            this[funcName](nomeCampo, campo, $tdc);                        
        },
        
        buildCampo_currency1000: function (nomeCampo, campo, $tdc) {
            var $inp = $("<input type='text' class='form-control input-sm'>").attr("name", nomeCampo).appendTo($tdc);            
            $tdc.prepend("R$ ");
            $tdc.append(" mil");
        },        
        buildCampo_currency: function (nomeCampo, campo, $tdc) {
            var $inp = $("<input type='text' class='form-control input-sm'>").attr("name", nomeCampo).appendTo($tdc);            
            $tdc.prepend("R$ ");
        },
        buildCampo_perc: function (nomeCampo, campo, $tdc) {
            var $inp = $("<input type='text' class='form-control input-sm'>").attr("name", nomeCampo).appendTo($tdc)            
            $tdc.append(" %");
        },
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