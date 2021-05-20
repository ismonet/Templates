
var RiskComp = (function ($, oEnc) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById('api_base_url').value
    );

    return Vue.component('riskassesment-modal-', {

        template: '#risk_tpl',
        data: function () {
            return {
                titleLogo: 'Resources/images/Vector.png',
                halfPageStartImage: '/Resources/images/MaskGroup.png',
                halfPageStartImage2: '/Resources/images/website.jpg',
                step: 1,
                questionOne: 'How would you describe your knowledge of investment?',
                questionTwo: 'How long do you think you can invest without withdrawing your fund?',
                questionThree: 'What type of investment do you currently own?',
                questionFour: 'Assume you own investments that has lost up to 20% in value due to a general decline in the market, what will you likely do?',
                questionFive: 'Assume you are offered 3 investment plans with 3 possible scenarios of gains and losses',

                totalPoints: 0,
                recommendedProducts: [],
                allProducts: [],
                productsDetails: null,
                products: [],
            }
        },

        computed: {
            modalId: function () {
                return 'riskassesment-modal-' + this.compId
            },

        },
        methods: {
            next() {
                this.step++;
                let $modal_body = $('.modal-body')
                $modal_body.scrollTop(0)
                //$('#' + this.modalId).scrollTop()
            },
          
            addPoint: function(point) {
                if (this.step === 6) {
                    this.totalPoints += point;
                    console.log("Total Point at the end " + this.totalPoints);
                    this.getRecommendedProducts();
                    this.getAccountTypes();
                    this.next();
                }
                else {
                    console.log("passed" + point);
                    this.totalPoints += point;
                    console.log("summed " + this.totalPoints);
                    this.next();              
                }
               
            },

            getRecommendedProducts: function () {
                var self = this;
                $.LoadingOverlay("show");

                encryptor.send("investnow", "risk-assessment", {
                    method: "post",
                    data: {
                        score: self.totalPoints
                    }
                }).then(function (resp) {
                    self.recommendedProducts = resp.data;
                }).catch(function (resp) {
                    console.log(resp)
                    utils.displayAlert(resp.message, "An error occured", "red");
                }).finally(function () {
                    $.LoadingOverlay('hide');
                });
            },


            getAccountTypes: function () {
                var self = this;
                $.LoadingOverlay("show");

                encryptor.send("account", "get_account_types", {
                    method: "get",
                    data: {}
                }).then(function (resp) {
                    self.allProducts = resp.data;    
                }).catch(function (resp) {
                    utils.displayAlert(resp.message, "Couldn't fetch accounts", "green");
                }).finally(function () {
                    $.LoadingOverlay('hide');
                });
            },

            toStep: function (stepNum) {
                this.step = stepNum;
                let $modal_body = $('.modal-body')
                $modal_body.scrollTop(0)
            },

            showDetails: function (details, step) {
                this.productsDetails = details;
                this.toStep(step);
            },

            showRegistrationModal: function (value) {
                var regInstance = new RegisterComp({
                    propsData: {
                      //  acctType: acctType
                        acctType: value
                    }
                }),
                mountPoint = document.createElement('div');
                document.body.appendChild(mountPoint)
                regInstance.$mount(mountPoint)
                this.close();
            },

            showAllProductsTab() {
                this.toStep(7)              

                if (this.step === 7) {
                    this.getAccountTypes()
                }
                $(function () {
                    $('#pills-tab li:last-child a').tab('show')
                })
            },

           

            close() {
              $('#' + this.modalId).modal('hide')
            },
        },
        created: function () {

        },
        beforeMount: function () {

            this.compId = Math.floor(Math.random() * 10000)
            this.getAccountTypes()

        },
        mounted: function () {
            this.getAccountTypes()
            $('#' + this.modalId).modal({ backdrop: 'static', keyboard: false })
            $('#' + this.modalId).modal('show')
        }
    });
})(jQuery, OaksEncryptor)

