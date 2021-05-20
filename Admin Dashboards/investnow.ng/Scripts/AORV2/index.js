(function ($, oEnc) {
    "use strict";
    var OaksEncryptor = new oEnc(
        document.getElementById("api_base_url").value
    );
    Vue.use(window.vuelidate.default)
    const { required, minLength, maxLength, email } = window.validators
    new Vue({
        el: '#app',
        data: () => ({
            step: 1,
            UserData: {
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
                account_number: null,
                account_name: null,
                nok_relationship: null,
                nok_name: null,
                nok_email: null,
                nok_phone: null,
                selfie: null,
                pep_position: null,
                idCard: null,
                utilityBill: null,
                signature: null,
                IdCardNumber: null,
                IdIssuanceDate: null,
                employementStatus: null,
                incomeBand: null,
                staffName: null,



                type: null, //type 
                gender: null,
                is_pep: null,
                bankcode: null,


                nok_gender: null,
                source: null,
                idCardType: null,

                passport: null,
                referral: null,
            },

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
            selectedAccountType: "AM",
            nextofKin: []
        }),

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
                account_number: {
                    required: validators.required,
                    minLength: minLength(10),
                    maxLength: maxLength(10)
                },
                //  account_name: {
                //    required: validators.required
                //}

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
                selfie: {
                    required: validators.required,
                },
                pep_position: {
                    required: validators.required,
                },
                idCard: {
                    required: validators.required,
                },
                utilityBill: {
                    required: validators.required,
                },
                signature: {
                    required: validators.required,
                },
                idCardType: {
                    required: validators.required,
                },
                IdCardNumber: {
                    required: validators.required,
                },
                IdIssuanceDate: {
                    required: validators.required,
                },
                employementStatus: {
                    required: validators.required,
                },
                incomeBand: {
                    required: validators.required,
                },
                source: {
                    required: validators.required,
                },
                staffName: {
                    required: validators.required,

                }

            },
        },

        watch: {
           
        },
        methods: {
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
                Vue.set(this.UserData, 'selfie', null)
                this.step--;
            },

            next() {
                this.step++;
            },

            toStep: function(stepNum) {
                this.step = stepNum;
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
          
            reload: function () {
                location.reload();
            },

            showSuccess() {
                var self = this;
                swal("Success!", "Your Request is being processed, you will get a notification email shortly!", "success").then((value) => {
                    self.reloadPage();
                });
            },
         
        },
        created: function () {
            this.initializeFormFields()
            this.getNextOfKin()

        }, 
        beforeMount: function () {
        },
        mounted: function () {
           
            this.$nextTick(() => {
               
            });
        }
    });

})(jQuery, OaksEncryptor)