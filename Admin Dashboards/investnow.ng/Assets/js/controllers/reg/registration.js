//2.Registration Modal Component
var RegisterComp = (function ($, oEnc) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value
    );
    Vue.use(window.vuelidate.default)
    const { required, minLength, maxLength, email } = window.validators

    return Vue.component('register', {

        template: '#regModal_tpl',

        props: {
            acctType: {
                type: String,
                required: true
            }
        },

        data: function () {
            return {
                selfieImage: '/Resources/images/take Selfie.svg',
                IdCard: '/Resources/images/Rectangle 7.svg',
                UtilityImage: '/Resources/images/selfie img.svg',
                SignatureImage: '/Resources/images/insert sign.png',

                halfPageStartImage: '/Resources/images/website.jpg',
                validatBankImage: '/Resources/images/validate-bank.png',
                congratsImage: '/Resources/images/mark.png',

                selfieHalfImage: '/Resources/images/upload-selfie.png',
                rightarrow: '/Resources/images/right.png',
               
                step: 0,

                UserData: {
                    accepted_t_and_c: null, //Wire up this prop

                    bvn: null,
                    first_name: null,
                    last_name: null,
                    middle_name: null,
                    phone_number: null,
                    address_line_1: null,
                    date_of_birth: null,
                    email_address: null,
                    mothers_maiden_name: null,
                    bank: null,
                    bank_acct_no: null,
                    bank_acct_name: null,
                    gender: null,

                    nok_relationship: null,
                    nok_name: null,
                    nok_email: null,
                    nok_phone: null,
                    nok_gender: null,
                    pep_description: null,
                    source: null,
                    is_pep: null,
                    id_card_number: null,
                    id_card_issuance_date: null,
                    idCardType: null,
                    idCard: null,
                    passport: null,
                    signature: null,
                    utility_bill: null,


                    //NOT In API Spec
                    employementStatus: null,
                    annual_income: null,
                    staffName: null,
                    type: null, //type 
                    bankcode: null,
                    cscs_account_number:null,

                    referral: null,
                },

                canGetReferrerName: null,
                ReferrerFirstName: null,
                RewardPerReferral: 0,
                aor: null,
                metadata: {
                    gender_list: []
                },
                sources: ["Social Media", "Flyer", "Website", "Radio", "Newspaper", "Word of Mouth", "Referral", "Google search"],
                accountTypes: [],
                companies: [],
                accounts: [],
                isReferral: false,
                idCardTypes: null,
                accountType: null,
                u: utils,
                compId: null,
                paymentAttempt: null,
                selectedAccountType: "AM",
                nextofKin: [],
                ReferrerName: null

            }
        },

        validations: {
            UserData: {
                bvn: {
                    required: validators.required,
                    minLength: minLength(11),
                    maxLength: maxLength(11)
                },
                first_name: {
                    required: validators.required
                },
                last_name: {
                    required: validators.required
                },
                phone_number: {
                    required: validators.required,
                    minLength: minLength(11),
                    maxLength: maxLength(15)
                },
                address_line_1: {
                    required: validators.required
                },
                gender: {
                    required: validators.required
                },

                email_address: {
                    required: validators.required,
                    email
                },
                date_of_birth: {
                    required: validators.required
                },
                bank: {
                    required: validators.required
                },
                bank_acct_no: {
                    required: validators.required,
                    minLength: minLength(10),
                    maxLength: maxLength(10)
                },

                bank_acct_name: {
                required: validators.required
                },

                nok_relationship: {
                    required: validators.required,
                },
                nok_name: {
                    required: validators.required,
                },
                nok_email: {
                    required: validators.required,
                    email
                },
                nok_phone: {
                    required: validators.required,
                },
                nok_gender: {
                    required: validators.required,
                },
                passport: {
                    required: validators.required,
                },
                pep_description: {
                    required: validators.required,
                },
                //idCard: {
                //    required: validators.required,
                //},
                //utility_bill: {
                //    required: validators.required,
                //},
                signature: {
                    required: validators.required,
                },
                idCardType: {
                    required: validators.required,
                },
                id_card_number: {
                    required: validators.required,
                },
                id_card_issuance_date: {
                    required: validators.required,
                },
                employementStatus: {
                    required: validators.required,
                },
                annual_income: {
                    required: validators.required,
                },
                source: {
                    required: validators.required,
                },
                referral: {
                    required: validators.required,
                },
                is_pep: {
                    required: validators.required,
                },
                mothers_maiden_name: {
                    required: validators.required,
                },
                cscs_account_number: {
                    required: validators.required,
                }


            },
        },

        computed: {
            //accountType: function () {
            //    return this.accountTypes.filter(a => a.code === this.acctType).length > 0 ?
            //        this.accountTypes.filter(a => a.code === this.acctType)[0] : null
            //},
            //availableAccTypes: function () {
            //    return this.accountTypes.filter(a => a.code !== this.acctType)
            //},
            modalId: function () {
                return 'reg-modal-' + this.compId
            }
        },

        methods: {
            getModalId() {
                return this.modalId;
            },

            registerUser: function () {
                var self = this;
                    self.UserData.type = self.acctType;
                   var payload = _.cloneDeep(self.UserData)
                    

                $.LoadingOverlay("show");
                $.post("/api/registration/ref-signup", payload).done(function (resp) {

                    //Saving params for next steps ()
                    sessionStorage.setItem("accountCode", resp.data.account_code); //INV0174
                    sessionStorage.setItem("accountId", resp.data.account_id); //174
                    //sessionStorage.setItem("typesSelected", payload.TypesSelected);//AM_BF,AM_EURO,S etc
                    self.next();
                    $.LoadingOverlay("hide");
                    //utils.displayAlert("Congratulations! You've successfully signed up, an activation mail has been sent to the email provided", "Congratulations!", "green" );

                    //self.close();
                    //var depositInstance = new depositClass({
                    //    propsData: {
                    //        propsData: {}
                    //    }
                    //}),
                    //    mountPoint = document.createElement('div');
                    //document.body.appendChild(mountPoint)
                    //depositInstance.$mount(mountPoint)

                }).fail(function (resp) {
                    $.LoadingOverlay("hide");

                    utils.displayAlert(resp.responseJSON.message, "Signup Error", "red");
                });
            },

           
            getAccountTypes: function () {
                var self = this;
                $.LoadingOverlay("show");

                encryptor.send("account", "get_account_types", {
                    method: "get",
                    data: {}
                }).then(function (resp) {

                    //self.companies = []
                    //self.accounts = []
                    self.accountTypes = resp.data.map(at => {
                        at.selected = false
                        return at
                    })
                   // sessionStorage.setItem('product', JSON.stringify(self.accountType))
                }).catch(function (resp) {
                    utils.displayAlert(resp.message, "Couldn't fetch accounts", "green");
                }).finally(function () {
                    $.LoadingOverlay('hide');
                });
            },

            check: function (e) {
                if (e.srcElement.checked) {
                    this.UserData.TypesSelected.push(e.srcElement.id)
                } else if (e.srcElement.checked == false && this.UserData.TypesSelected.includes(e.srcElement.id)) {

                    var removeItem = e.srcElement.id;
                    var filteredItems;
                    filteredItems = this.UserData.TypesSelected.filter(item => item !== removeItem)
                    this.UserData.TypesSelected = filteredItems;
                }
            },

            checkExisting: function (elem) {
                var self = this;

                if (!_.isEmpty(_.trim(self.UserData.email_address))) {

                    $.LoadingOverlay("show");
                    encryptor.send("investnow", "email-exists", {
                        method: "get",
                        data: {
                            email: _.trim(self.UserData.email_address)
                        }
                    }).then(function (resp) {

                        utils.displayAlert("", "An account with this email already exists, kindly login", "green");

                        self.close()

                        var loginInstance = new loginClass({
                            propsData: {
                                email: self.UserData.email_address
                            }
                        }),
                            mountPoint = document.createElement('div');
                        document.body.appendChild(mountPoint)
                        loginInstance.$mount(mountPoint)

                    }).catch(function (resp) {
                        // utils.displayAlert(resp.message, "Your Email doesn't exist on InvestNow", "red");
                    }).finally(function () {
                        $.LoadingOverlay("hide");
                    })
                }
            },

            close() {
                $('#' + this.modalId).modal('hide')
            },

            //Copied form Index.js

            initializeFormFields() {
                $.LoadingOverlay("show");

                let url = `/customer/api/referral/init/${this.acctType}`;
                $.get(url).done((resp) => {
                    this.aor = resp.data;
                    this.accountType = resp.data.type
                    this.metadata = resp.metadata;
                    $.LoadingOverlay("hide");
                }).fail(error => {
                    $.LoadingOverlay("hide");
                });

            },

            getNextOfKin: function () {
                var self = this;
                $.LoadingOverlay("show");
                axios.get('https://api-sb.unitedcapitalplcgroup.com/investnow/get-all-next-of-kins')
                    .then(function (response) {
                        self.nextofKin = response.data.data;
                        $.LoadingOverlay("hide");
                    })
                    .catch(function (error) {
                        $.LoadingOverlay("hide");
                        console.log(error)
                    })
                    .then(function () {
                        $.LoadingOverlay("hide");
                    });
            },

            prev() {
                this.step--;
            },

            prevSelfie() {
                Vue.set(this.UserData, 'passport', null)
                this.step--;

            },

            next() {
                this.step++;
                let $modal_body = $('.modal-body')
                $modal_body.scrollTop(0)
            },

            toStep: function (stepNum) {
                this.step = stepNum;
                let $modal_body = $('.modal-body')
                $modal_body.scrollTop(0)
            },

            doSomething() {
                console.log("Here");
            },

            getBankID: function () {
                var self = this;
                const filteredID = self.metadata.banks.filter((item) => {
                    return item.id === self.UserData.bank
                })
                return filteredID[0].code;
            },

            //calculateFileSize: function () {

            //    //x = (n * (3/4)) - y
            //    //x = size of file in bytes
            //    //n = lenth of Base64string
            //    //y = 2 if Base64 ends with '==' and 1 if Base64 ends with '='

            //    var n = this.UserData.selfie.length;
            //    var nn = this.UserData.selfie;
            //    var last2 = nn.slice(-2);

            //    if (last2 === '==') {
            //        var y = 2;
            //        var x = (n * (3 / 4)) - y;
            //        var m = x / 1024 / 1024; 
            //        console.log(m.toFixed(2) + "MB")
            //        return x;
            //    }
            //    else {
            //        y = 1;
            //        x = (n * (3 / 4)) - y;
            //        m = x / 1024 / 1024;
            //        console.log(m.toFixed(2) + "MB")
            //        return x;
            //    }
            //},
            resolveAccountNumber: function () {
                $.LoadingOverlay("show");
                var self = this;
                self.UserData.bankcode = self.getBankID();
                axios.get(`/customer/api/bank/resolve-account-number/${self.UserData.bank_acct_no}/${self.UserData.bankcode}`)
                    .then(function (response) {
                        self.UserData.bank_acct_name = response.data.data.account_name;
                    })
                    .catch(function (error) {
                        $.LoadingOverlay('hide');
                        utils.displayAlert(error.response.data.message, "An error occured", "red");
                    })
                    .then(function () {
                        $.LoadingOverlay('hide');
                    });
            },

            validateReferralCode() {
                $.LoadingOverlay("show");
                let self = this;

                axios.get('/api/registration/validate-referral-code', {
                    params: {
                        ref_code: this.UserData.referral
                    }
                }).then(function (response) {
                    self.ReferrerName = response.data.referrer_name;
                    //if (self.ReferrerFirstName != null) {
                    //    self.canGetReferrerName = true;
                    //} else {
                    //    self.canGetReferrerName = false;
                    //}
                    $.LoadingOverlay("hide");
                }).catch(function (error) {
                    console.log(error);
                }).then(function () {
                    // always executed
                });
            },

            reload: function () {
                location.reload();
            },

            showSuccess() {
                var self = this;
                swal("Success!", "Your Request is being processed, you will get a notification email shortly!", "success").then((value) => {
                    self.reloadPage();
                });
            },

            showAllProductsTab() {
                $('.nav-tabs a:last').tab('show');
            }
        },

        created: function () {
            this.initializeFormFields()
            this.getNextOfKin()

        }, 

        beforeMount: function () {
            this.getAccountTypes();
          //  this.getinfoSources();
            this.compId = Math.floor(Math.random() * 10000)
        },

        mounted: function () {
            $('#' + this.modalId).modal({ backdrop: 'static', keyboard: false })
            $('#' + this.modalId).modal('show')

            //ProductCode = T_EDU
          //  sessionStorage.setItem('productCode', this.acctType)
        }
    });

})(jQuery, OaksEncryptor)