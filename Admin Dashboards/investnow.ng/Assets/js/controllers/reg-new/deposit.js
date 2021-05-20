var depositClass = (function ($, oEnc, util) {
    "use strict";

    let encryptor = new oEnc(
        document.getElementById("api_base_url").value,
    );
    const oPStack = OPayStack;

    return Vue.component('deposit-mod', {
        template: `#depositModal_tpl`,
        computed: {
            //Gets Previously Saved Params for payment initiation 
            accountId: function () {
                return sessionStorage.getItem("accountId")
            },
            accountCode: function () {
                return sessionStorage.getItem("accountCode")
            },
            productCode: function () {
                return sessionStorage.getItem("productCode")
            },
            product: function () {
                return JSON.parse(sessionStorage.getItem("product"))
            },
            paymentPayload: function () {
                return this.frequencies !== null && this.accountId !== null ? {
                    aor_id: this.accountId,
                    product_code: this.productCode,
                    items: !this.frequencies.isRegular ? [
                        {
                            name: `Account Opening Request [${this.accountCode}] Payment`,
                            description: `Account Opening Request [${this.accountCode}] Payment`,
                            value: this.amount
                        }
                    ] : null,
                    amount: this.amount,
                    gateway_metadata: {
                        custom_fields: [
                            {
                                display_name: "Account Opening Request Code",
                                value: this.accountCode,
                                variable_name: "aor_code"
                            },
                            {
                                display_name: "Account Type to be opened",
                                value: this.product.name,
                                variable_name: "product_name"
                            }
                        ]
                    },
                    description: `Account Opening Request [${this.accountCode}] Payment`,
                    sub_account: this.product.bankAccount.paystackSubAccount.code,
                    recurrent_options: this.frequencies.isRegular ? {
                        start_date: moment(this.startDate).isValid() ? moment(this.startDate).format('YYYY-MM-DD') : null,
                        end_date: moment(this.endDate).isValid() ? moment(this.endDate).format('YYYY-MM-DD') : null,
                        amount: this.amount,
                        frequency_code: this.frequencies.code,
                        frequency_options: this.getFrequencyOptions()
                    } : null
                } : null
            },
            endpoint: function () {
                return this.frequencies !== null ?
                    this.frequencies.isRegular ? 'setup-recurrent' : 'initialize'
                    : null
            }
        },
        data: () => ({
            amount: null,
            frequencies: null,
            freq: [],
            currentYear: new Date().getFullYear(),
            currentMonth: null,
            currentDate: new Date().getDate(),
            startDate: null,
            endDate: null,
            paymentDay: null,
            aor_id: null,
            description: null,
            u: utils
        }),
        methods: {
            close() {
                $('#' + this.modalId).modal('hide')
            },
            getFrequencyOptions() {
                if (this.frequencies === null) {
                    return []
                } else {
                    var fields = []

                    this.frequencies.formFields.forEach(f => {
                        var el = $(`#${this.modalId}`).find(`[name="${f.element_id}"]`), val = null
                        if (el[0].tagName.toLowerCase() === 'select') {
                            //is checkboxes
                            val = el.val()
                        } else {
                            val = [];
                            $(`#${this.modalId}`).find(`[name="${f.element_id}"]:checked`)
                                .each(function (i, elem) {
                                    val.push($(elem).val())
                                })
                        }

                        console.log(val);
                        fields.push({
                            field_id: f.id,
                            value: val
                        })
                    })

                    return fields
                }
            },
            showLoginModal: function () {
                var loginInstance = new loginClass(),
                    mountPoint = document.createElement('div');
                document.body.appendChild(mountPoint)
                loginInstance.$mount(mountPoint)
            },
            getFrequencies: function () {
                encryptor.send("payment", "frequencies", {
                    methods: "get"
                }).then((resp) => {
                    this.freq = resp.data.map(f => {
                        if (Array.isArray(f.formFields)) {
                            let fields = f.formFields.map(_f => {
                                let container = document.createElement('div')
                                let label = document.createElement('label')
                                label.innerText = _f.name
                                container.appendChild(label)

                                let el = $(_f.html)
                                if (el[0].tagName.toLowerCase() === 'select') {
                                    el.addClass('form-control')
                                    container.appendChild(el[0])
                                } else {
                                    var pTags = el[0].getElementsByTagName('p'),
                                        newDiv = document.createElement('div')
                                    for (var i = 0; i < pTags.length; i++) {
                                        var p = pTags[i], div = document.createElement('div')
                                        div.classList.add('custom-control', 'custom-checkbox')
                                        div.innerHTML = p.innerHTML
                                        $(div).find('input').addClass('custom-control-input')
                                        $(div).find('label').addClass('custom-control-label')
                                        container.appendChild(div)
                                    }
                                }
                                _f.html = container.innerHTML
                                return _f
                            })

                            f.formFields = fields

                            return f
                        }
                    });

                    console.log(this.freq);
                }).catch(function (resp) {
                    utils.displayAlert(resp.message, "Could not initialize form", "red");
                });
            },
            onSkipPayment: function () {
                utils.displayAlert("Congratulations! Successfully Signed Up, an activation mail has been sent to the email provided", "Congratulations!", "green");
                let loginInstance = new loginClass({
                        propsData: {}
                    }),
                    mountPoint = document.createElement('div');
                document.body.appendChild(mountPoint)
                loginInstance.$mount(mountPoint)
            },
            formatDate: function () {
                const month = new Date().getMonth() + 1;
                if (month < 10) {
                    this.currentMonth = '0' + month;
                }
                const date = new Date().getDate();
                if (date < 10) {
                    this.currentDate = '0' + date;
                }
            },
            initPayment: function (event) {
                event.preventDefault();
                var self = this

                encryptor.send("payment", this.endpoint, {
                    methods: "post",
                    data: this.paymentPayload
                }).then((resp) => {
                    var pStk = new oPStack(
                        resp.data,
                        resp.data.gateway_metadata.custom_fields,
                        document.getElementById("api_base_url").value,
                        resp.metadata.paystack_public_key
                    );

                    pStk.init()
                        .then(function (resp) {
                            util.displayAlert(resp.message).then(function () {
                                self.showLoginModal()
                                self.close()
                            });
                        }).catch(function (resp) {
                        util.displayAlert(resp.message, resp.title);
                    }).finally(function () {

                    })
                }).catch(function (resp) {
                    utils.displayAlert(resp.message, "Initialize payment failed", "red");
                });
            }
        },
        beforeMount: function () {
            this.modalId = 'deposit-mod' + Math.floor(Math.random() * 10000)
            this.getFrequencies()
        },
        mounted: function () {
            $('#' + this.modalId).modal({backdrop: 'static', keyboard: false})
            $('#' + this.modalId).modal('show')
            this.formatDate()
        },
        destroyed: function () {
            $('#' + this.modalId).modal('hide')
        }
    });

})(jQuery, OaksEncryptor, utils)