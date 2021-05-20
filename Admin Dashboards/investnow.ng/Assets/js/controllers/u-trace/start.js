(function ($, oEnc) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value
    );

    $(function () {
        $('.trace-trigger').each(function (i, elem) {
            $(elem).on('click', function (event) {
                event.preventDefault()

                var traceInstance = new TraceComp({
                    propsData: {

                    }
                }),

                mountPoint = document.createElement('div');
                document.body.appendChild(mountPoint)
                traceInstance.$mount(mountPoint)
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