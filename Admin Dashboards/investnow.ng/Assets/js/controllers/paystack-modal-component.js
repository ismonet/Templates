(function ($) {
    'use strict'

    const PAYSTACK_PKEY_STORAGE_KEY = "paystack-pkey";

    Vue.component('paystack-popup', {
        template: `#paystack-modal-trigger`,
        props: {
            paymentAttempt: {
                type: Object,
                required: true,
                validator: function (value) {
                    if (!_.isObject(value)) {
                        return false;
                    }

                    if (typeof value.ref_number !== 'string' || value.ref_number.length <= 0) {
                        utils.displayAlert(`Payment attempt has no reference number.`)
                        return false;
                    }

                    if (typeof value.email !== 'string' || value.email.length <= 0) {
                        utils.displayAlert(`Payment attempt has no email address`)
                        return false;
                    }

                    let gross = Number(value.gross_value);
                    if (isNaN(gross) || gross <= 0) {
                        utils.displayAlert(`Payment attempt has no value`)
                        return false;
                    }

                    return true;
                }
            }
        },
        computed: {
            verifyRoute: function () {
                return this.$refs.verifyRoute.value
            },
            cancelRoute: function () {
                return this.$refs.cancelRoute.value
            },
            paystackPKeyRoute: function () {
                return this.$refs.paystackPKeyRoute.value
            },
            paystackPublicKey: {
                cache: false,
                get: function () {
                    let val = localStorage.getItem(PAYSTACK_PKEY_STORAGE_KEY)

                    return _.trim(val).length > 0 ? val : null
                }
            }
        },
        methods: {
            loadPaystackModal() {
                let handler = PaystackPop.setup({
                    key: this.paystackPublicKey,
                    email: this.paymentAttempt.email,
                    amount: Math.ceil(this.paymentAttempt.gross_value * 100),
                    ref: this.paymentAttempt.ref_number,
                    metadata: this.paymentAttempt.gateway_metadata,
                    subaccount: this.paymentAttempt.gateway_sub_account,
                    callback: response => {
                        this.verify();
                    },
                    onClose: () => {
                        this.cancel()
                    }
                })

                handler.openIframe()
            },
            verify() {
                $.LoadingOverlay('show')

                axios.put(this.verifyRoute).then(response => {
                    if (response.status === 200)
                        utils.displayAlert(response.data.message, `Payment Verified`, `green`).then(() => {
                            this.$emit('verified')
                        })
                    else
                        utils.displayAlert(response.data.message, `Payment Verification Failed`, `red`).then(() => {
                            this.$emit('failed-verify')
                        })
                }).catch(error => {
                    utils.displayAlert(error.response.data.message, `Payment Verification Failed`, `red`).then(() => {
                        this.$emit('failed-verify')
                    })
                }).finally(() => {
                    $.LoadingOverlay('hide')
                })
            },
            cancel() {
                $.LoadingOverlay('show')

                axios.delete(this.cancelRoute).then(response => {
                    if (response.status === 200)
                        utils.displayAlert(response.data.message, `Payment Cancelled`, `green`)
                    else
                        utils.displayAlert(error.response.data.message, `Payment Cancellation Failed`, `red`)
                }).catch(error => {
                    utils.displayAlert(error.response.data.message, `Payment Cancelled`, `red`)
                }).finally(() => {
                    $.LoadingOverlay('hide')
                    this.$emit('cancelled')
                })
            },
            init() {
                if (this.paystackPublicKey !== null) {
                    this.loadPaystackModal();
                    return
                }

                $.LoadingOverlay('show')

                axios.get(this.paystackPKeyRoute).then(response => {
                    localStorage.setItem(PAYSTACK_PKEY_STORAGE_KEY, response.data.data)
                    this.loadPaystackModal();
                }).catch(error => {
                    utils.displayAlert(`Failed to initialize paystack payment popup. Please try again later`)
                        .then(() => {
                            this.$emit('init-failed');
                        })
                }).finally(() => {
                    $.LoadingOverlay('hide')
                })
            }
        },
        beforeMount() { },
        mounted() {
            this.$nextTick(() => {
                this.init()
            })
        }
    })
})(jQuery)