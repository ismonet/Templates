var GiftComp = (function ($, oEnc, util) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value,
    );

    return Vue.component('gift-mod', {
        template: `#gift_tpl`,
        props: {
            acctType: {
                type: String,
                required: true
            }
        },
        computed: {
            modalId: function () {
                return 'gift-modal-' + this.compId
            },
            accountType: function () {
                return this.accountTypes.filter(a => a.code === this.acctType).length > 0 ?
                    this.accountTypes.filter(a => a.code === this.acctType)[0] : null
            }
        },

        data: function () {
            return {

                GiftData: {
                    giverFirstName: null,
                    giverLastName: null,
                    giverEmailAddress: null,
                    giverBvn: null,
                    giverPhoneNumber: null,
                    amount: null,
                    receiverFirstName: null,
                    receiverLastName: null,
                    receiverEmailAddress: null,
                    receiverPhoneNumber: null,
                    isGiverAnonymous: null,
                    accountType: null,
                    paymentGateway: null
                },
                u: utils,
                accountTypes: [],
                compId: null
            }
        },
        methods: {
            close() {
                $('#' + this.modalId).modal('hide')
            },


            getAccountTypes: function () {
                var self = this;
                $.LoadingOverlay("show");

                encryptor.send("account", "get_account_types", {
                    method: "get",
                    data: {}
                }).then(function (resp) {
                    self.companies = []
                    self.accounts = []
                    self.accountTypes = resp.data.map(at => {
                        at.selected = false
                        return at
                    })

                    sessionStorage.setItem('product', JSON.stringify(self.accountType))
                }).catch(function (resp) {
                    utils.displayAlert(resp.message, "Couldn't fetch accounts", "green");
                }).finally(function () {
                    $.LoadingOverlay('hide');
                });
            },

            createNewGift: function () {
                payload = _.cloneDeep(self.GiftData)
                payload.accountType = sessionStorage.getItem('productCode')

                $.LoadingOverlay("show");
                $.post("/customer/api/aor/gift-aor", {
                    data: JSON.stringify(this.payload)
                }).done(function (resp) {
                    $.LoadingOverlay("hide");
                    utils.displayAlert(resp.message, "Congratulations! Your gift has been sent", "green");
                }).fail(function (xhr) {
                    utils.displayAlert(xhr.responseJSON.message, "Error", "red");
                });
            }

        },
        beforeMount: function () {
            this.getAccountTypes();
            this.compId = Math.floor(Math.random() * 10000)
            
        },
        mounted: function () {
            $('#' + this.modalId).modal({ backdrop: 'static', keyboard: false })
            $('#' + this.modalId).modal('show')

            sessionStorage.setItem('productCode', this.acctType)

        },
        destroyed: function () {
        }
    });
})(jQuery, OaksEncryptor, utils)



