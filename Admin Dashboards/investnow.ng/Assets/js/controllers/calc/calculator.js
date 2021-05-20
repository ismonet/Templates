var CalculatorComp = (function ($, oEnc, util) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value,
    );

    return Vue.component('calculator-mod', {
        template: "#calculator_tpl",
        computed: {
            modalId: function () {
                return 'calculator-modal-' + this.compId
            },
            roi: {
                cache: false,
                get: function () {
                    var recurrentPayment = Number(this.recurrentPayment),
                        intRate = Number(this.interestRate) / 100,
                        numOfMonths = Number(this.numberOfMonths),
                        initialPayment = Number(this.initialPayment)

                    var p1 = recurrentPayment * ((Math.pow((1 + (intRate / 12)), numOfMonths) - 1) / (intRate / 12)) * (1 + intRate / 12);
                    var p2 = initialPayment * Math.pow(1 + intRate, numOfMonths / 12) + initialPayment

                    return this.numberWithCommas((Math.round((p1 + p2) * 100) / 100).toFixed(2))  
                }
            },

            getTotalroi: {
                cache: false,
                get: function () {
                    var recurrentPayment = Number(this.recurrentPayment),
                        intRate = Number(this.interestRate) / 100,
                        numOfMonths = Number(this.numberOfMonths),
                        initialPayment = Number(this.initialPayment)

                    var p1 = recurrentPayment * ((Math.pow((1 + (intRate / 12)), numOfMonths) - 1) / (intRate / 12)) * (1 + intRate / 12);
                    var p2 = initialPayment * Math.pow(1 + intRate, numOfMonths / 12) + initialPayment
                    var p3 = (p1 + p2)
                    return p3 

                }
            },

            interest: {
                cache: false,
                get: function () {
                    return this.numberWithCommas(parseInt(this.getTotalroi - (parseInt(this.getTotalInvested))))
                }
            },

            totalinvestment: {
                cache: false,
                get: function () {
                    return this.numberWithCommas((Number(this.initialPayment) + (Number(this.recurrentPayment) * Number(this.numberOfMonths))).toFixed(2)) 
                }
            },
            getTotalInvested: {
                cache: false,
                get: function () {
                    return ((Number(this.initialPayment) + (Number(this.recurrentPayment) * Number(this.numberOfMonths))).toFixed(2))
                }
            }



        },
        data: function () {
            return {
                recurrentPayment: 0,
                interestRate: 0,
                numberOfMonths: 0,
                initialPayment: 0,
                totalAccruedInterest: 0,
                totalInvested: 0,

                compId: null
            }
        },
        methods: {
            close() {
                $('#' + this.modalId).modal('hide')
            },


            numberWithCommas: function (number) {
                var parts = number.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return parts.join(".");
            }

            //numberWithCommas: function (number) {
            //    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            //}

            //getCurrentROI() {
            //    var url = "https://api.unitedcapitalplcgroup.com/json/product/latest-fund-rate?fundId=MMR-MF-000001";
            //    $.get(url).done((resp) => {
            //        this.interestRate = resp.data.rate;
            //    }).fail(error => {
            //        utils.displayAlert(error.responseJSON.message).then(() => {

            //        })
            //    });
            //}
        },
        beforeMount: function () {
            this.compId = Math.floor(Math.random() * 10000)
           // this.getCurrentROI();
        },
        mounted: function () {
            $('#' + this.modalId).modal({ backdrop: 'static', keyboard: false })
            $('#' + this.modalId).modal('show')
        },
        destroyed: function () {
        }
    });
})(jQuery, OaksEncryptor, utils)