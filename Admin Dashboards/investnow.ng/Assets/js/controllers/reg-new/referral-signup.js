(function ($, oEnc) {
    "use strict";
    var encryptor = new oEnc(
        document.getElementById("api_base_url").value
    );
    new Vue({
        el: '#regModal_tpl',
        data: () => ({
            UserData: {
                first_name: null,
                last_name: null,
                bvn: null,
                phone_number: null,
                address_line_1: null,
                date_of_birth:null,
                account_name: null,
                email_address: null,
                type: null, //type 
                gender: null,
                bank: null,
                bankcode: null,
                account_number: null,
                nok_name: null,
                nok_gender: null,
                source: null,
                idCardType: null,
                idCard: null,
                passport: null,
                referral: null,
            },
            selectedAccountDescription: null,
            SelectedAccountName: null,
            canGetReferrerName: null,
            ReferrerFirstName: null,
            RewardPerReferral: 0,
            aor: null,
            metadata: {
                gender_list: []
            },
            sources: ["Social Media", "Flyer", "Website", "Radio", "Newspaper", "Word of Mouth", "Staff Referral", "Google search"],
            accountTypes: [],
            companies: [],
            accounts: [],
            isReferral: false,
            idCardTypes: null,
            accountType: null,
            u: utils,
            compId: null,
            paymentAttempt: null,
        }),
        computed: {
            initialized: function () {

            },
            availableAccTypes: function () {
                return this.accountTypes.filter(a => a.code !== this.acctType)
            },
            modalId: function () {
                return 'reg-page-' + this.compId
            },
            paymentAttemptRetrieved: function () {
                return _.isObject(this.paymentAttempt)
            },
            selectedAccountType: function () {
                let code = $(this.$refs.accountTypeCode).val();

                return _.trim(code).length > 0 ? code : null;
            },
            referralCode: {
                cache: false,
                get: function () {
                    let code = $(this.$refs.referralCode).val();

                    return _.trim(code).length > 0 ? code : null;
                }
            }
        },
        methods: {
            getModalId() {
                return this.modalId;
            },
            close() {
                $('#' + this.modalId).modal('hide')
            },
            registerReferralInvitee: function () {
                let self = this,
                    payload = _.cloneDeep(self.UserData)

                payload.type = this.selectedAccountType
                payload.referral = this.referralCode

                $.LoadingOverlay("show");
                axios.post('/api/registration/ref-signup', payload)
                    .then(resp => {
                        //Saving params for next steps
                        sessionStorage.setItem("accountCode", resp.data.data.account_code); //INV0174
                        sessionStorage.setItem("accountId", resp.data.data.account_id); //174
                        sessionStorage.setItem("typesSelected", payload.TypesSelected);//AM_BF,AM_EURO,S etc
                        sessionStorage.setItem('productCode', this.selectedAccountType)
                        sessionStorage.setItem('product', JSON.stringify(this.accountType))

                        $.LoadingOverlay("hide");
                        utils.displayAlert("Congratulations! You've successfully signed up, an activation mail has been sent to the email provided", "Congratulations!", "green");

                        this.close();
                        let depositInstance = new depositClass({
                                propsData: {}
                            }),
                            mountPoint = document.createElement('div');
                        document.body.appendChild(mountPoint)
                        depositInstance.$mount(mountPoint)
                    }).catch(function (error) {
                    $.LoadingOverlay("hide");
                    utils.displayAlert(error.response.data.message, "Signup Error", "red");
                }).then(function () {
                    $.LoadingOverlay("hide");
                });
            },
            checkExisting: function (elem) {
                let self = this;

                if (!_.isEmpty(_.trim(self.UserData.email_address))) {
                    $.LoadingOverlay("show");
                    encryptor.send("investnow", "email-exists", {
                        method: "get",
                        data: {
                            email: _.trim(self.UserData.email_address)
                        }
                    }).then(function (resp) {

                        utils.displayAlert("", "An account with this email already exists, kindly login", "green");
                        let loginInstance = new loginClass({
                                propsData: {
                                    email: self.UserData.email_address
                                }
                            }),
                            mountPoint = document.createElement('div');
                        document.body.appendChild(mountPoint)
                        loginInstance.$mount(mountPoint)
                    }).catch(function (resp) {
                        $.LoadingOverlay("hide");
                    }).finally(function () {
                        $.LoadingOverlay("hide");
                    })
                }
            },

            checkExisting2: function (elem) {
                var self = this;
                if (!_.isEmpty(_.trim(self.UserData.email_address))) {
                    $.LoadingOverlay("show");
                    axios.get('/api/registration/email-exists', {
                        params: {
                            email: _.trim(self.UserData.email_address)
                        }
                    })
                        .then(function (response) {

                            utils.displayAlert("", "An account with this email already exists, kindly login", "green");
                            var loginInstance = new loginClass({
                                    propsData: {
                                        email: self.UserData.email_address
                                    }
                                }),
                                mountPoint = document.createElement('div');
                            document.body.appendChild(mountPoint)
                            loginInstance.$mount(mountPoint)

                        })
                        .catch(function (error) {
                            $.LoadingOverlay("hide");
                        })
                        .then(function () {
                            $.LoadingOverlay("hide");
                        });
                }
            },

            getBankID: function () {
                var self = this;
                const filteredID = self.metadata.banks.filter((item) => {
                    return item.id === self.UserData.bank
                })
                return filteredID[0].code;
            },

            resolveAccountNumber: function () {
                $.LoadingOverlay("show");
                var self = this;
                self.UserData.bankcode = self.getBankID();
                axios.get(`/customer/api/bank/resolve-account-number/${self.UserData.account_number}/${self.UserData.bankcode}`)
                    .then(function (response) {
                        self.UserData.account_name = response.data.data.account_name;
                    })
                    .catch(function (error) {
                        $.LoadingOverlay('hide');
                        utils.displayAlert(error.response.data.message, "An error occured", "red");
                    })
                    .then(function () {
                        $.LoadingOverlay('hide');
                    });
            },

            initializeFormFields() {
                $.LoadingOverlay("show");

                let url = `/customer/api/referral/init/${this.selectedAccountType}`;
                $.get(url).done((resp) => {
                    this.aor = resp.data;
                    this.accountType = resp.data.type
                    this.metadata = resp.metadata;
                    $.LoadingOverlay("hide");
                }).fail(error => {
                    $.LoadingOverlay("hide");
                });

            },

            getReferralCodeFromUrl: function () {

            },

            isReferralSignup: function () {
                return this.referralCode !== null
            },
            getReferralBonusAmount() {
                let self = this;

                if (this.referralCode === null)
                    return;

                $.LoadingOverlay("show");
                axios.get(`/customer/api/referral/get-stats/${self.referralCode}/${self.selectedAccountType}`)
                    .then(function (response) {
                        self.RewardPerReferral = response.data.data.invitee_reward;
                        $.LoadingOverlay("hide");
                    }).catch(function (error) {
                    $.LoadingOverlay('hide');
                    console.log(error);
                }).finally(function () {
                    $.LoadingOverlay('hide');
                });
            },
            validateReferralCode2() {
                $.LoadingOverlay("show");
                let self = this;

                axios.get('/api/registration/validate-referral-code', {
                    params: {
                        ref_code: this.referralCode
                    }
                }).then(function (response) {
                    self.ReferrerFirstName = response.data.referrer_name;
                    if (self.ReferrerFirstName != null) {
                        self.canGetReferrerName = true;
                    } else {
                        self.canGetReferrerName = false;
                    }
                    $.LoadingOverlay("hide");
                }).catch(function (error) {
                    console.log(error);
                }).then(function () {
                    // always executed
                });
            },

            //TODO: Test and re-write to use Axios 
            getIdCardtypes: function () {
                $.LoadingOverlay("show");
                axios.get('/api/registration/get_id_card_types', {
                    params: {
                        data: null
                    }
                })
                    .then(function (response) {
                        $.LoadingOverlay("hide");
                        console.log(response);
                        self.idCardTypes = response.data;
                        if (response.data.length == 0) {
                            utils.displayAlert("Please try again later, could not fetch list of card types")
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            },
        },
        created() {
            if (this.isReferralSignup() === true) {
                this.validateReferralCode2()
                this.getReferralBonusAmount();
            }
        },
        mounted() {
            this.initializeFormFields()
        }
    });
})(jQuery, OaksEncryptor)


