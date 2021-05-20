var TraceComp = (function ($, oEnc, util) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value,
    );

    return Vue.component('trace-mod', {
        template: "#uTraceModal_tpl",
        computed: {
            modalId: function () {
                return 'trace-modal-' + this.compId
            },
           
        },
        data: function () {
            return {
                TraceData: {
                    firstName: null,
                    surname: null,
                    otherName: null,
                    phone: null,
                    email: null,
                    equitiesToSearchFor:[]
               },
                u: utils,
                compId: null,
                pricelist: null,
            }
        },
        methods: {
            close() {
                $('#' + this.modalId).modal('hide')
            },

            getStockPrices: function () {
                $.LoadingOverlay("show")
                var url = 'https://api.unitedcapitalplcgroup.com/json/stock-broking/get-equity-list?segments=EQTY%7CPREMIUM';
                $.get(url).done((resp) => {
                    //console.log(this.pricelist)
                    this.pricelist = resp.data;
                    if (resp.data.length == 0) {
                        utils.displayAlert("Please try again later, could not fetch list of equities")
                       this.close()
                    }
                    $.LoadingOverlay("hide")
                }).fail(error => {
                    utils.displayAlert(error.responseJSON.message).then(() => {

                    })
                });

            },

            requestSearch: function () {
                var self = this,
                payload = _.cloneDeep(self.TraceData)
                $.LoadingOverlay("show");

                encryptor.send("utrace", "save", {
                    method: "post",
                    data: payload
                }).then(function (resp) {
                    $.LoadingOverlay("hide");
                    utils.displayAlert(resp.message, "Your search request has been sent", "green");
                }).catch(function (resp) {
                    utils.displayAlert(resp.message, "An error occured", "red");
                }).finally(function () {
                    $.LoadingOverlay('hide');
                });
            }

        },
        beforeMount: function () {
            this.compId = Math.floor(Math.random() * 10000)
            this.getStockPrices();
            
        },
        mounted: function () {
            $('#' + this.modalId).modal({ backdrop: 'static', keyboard: false })
            $('#' + this.modalId).modal('show')
        },
        destroyed: function () {
        }
    });
})(jQuery, OaksEncryptor, utils)