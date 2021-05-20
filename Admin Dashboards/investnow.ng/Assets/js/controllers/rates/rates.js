var RatesComp = (function ($, oEnc, util) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value,
    );

    return Vue.component('rates-mod', {
        template: "#rates_tpl",
        computed: {
            modalId: function () {
                return 'rates-modal-' + this.compId
            },

        },
        data: function () {
            return {
                u: utils,
                compId: null,
                data: [],
            }
        },
        methods: {
            close() {
                $('#' + this.modalId).modal('hide')
            },

            getMutualFundRates() {
                $.LoadingOverlay('show')

                encryptor.send('product', 'mutual-fund-rates', {
                    method: 'get',
                }).then(resp => {
                    this.data = _.orderBy(resp.data, ['rate'], ['desc']);
                }).catch(resp => {
                    utils.displayAlert(resp.message)
                }).finally(() => {
                    $.LoadingOverlay('hide')
                })
            }
        },
        beforeMount: function () {
            this.compId = Math.floor(Math.random() * 10000)
            this.getMutualFundRates();

        },
        mounted: function () {
            $('#' + this.modalId).modal({ backdrop: 'static', keyboard: false })
            $('#' + this.modalId).modal('show')
        },
        destroyed: function () {
        }
    });
})(jQuery, OaksEncryptor, utils)