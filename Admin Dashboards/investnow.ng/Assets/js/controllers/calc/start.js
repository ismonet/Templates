(function ($, oEnc) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value
    );

    $(function () {
        $('.calculator-trigger').each(function (i, elem) {
            $(elem).on('click', function (event) {
                event.preventDefault()

                var calcInstance = new CalculatorComp({
                    propsData: {
                       
                    }
                }),

                mountPoint = document.createElement('div');
                document.body.appendChild(mountPoint)
                calcInstance.$mount(mountPoint)
            })
        })
    })
    var r = {
        el: '#',
        data: {    
        },
        methods: { 
            close() {
                $('#' + this.modalId).modal('hide')
            }
        },
        beforeDestroy: function () {
            
        }
    };

})(jQuery, OaksEncryptor)