(function ($, oEnc) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value
    );

    $(function () {
        $('.rates-trigger').each(function (i, elem) {
            $(elem).on('click', function (event) {
                event.preventDefault()

                var ratesInstance = new RatesComp({
                    propsData: {

                    }
                }),

                mountPoint = document.createElement('div');
                document.body.appendChild(mountPoint)
                ratesInstance.$mount(mountPoint)
            })
        })
    })
    //var r = {
    //    el: '#',
    //    data: {
    //    },
    //    methods: {
    //        close() {
    //            $('#' + this.modalId).modal('hide')
    //        }
    //    },
    //    beforeDestroy: function () {

    //    }
    //};

})(jQuery, OaksEncryptor)