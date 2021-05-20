//3. Login Modal Component
var loginClass = (function ($, oEnc) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value,
    );

    return Vue.component('login-mod', {
        template: "#loginModal_tpl",

        props: {
            email: String
        },
        computed: {
            formId: function () {
                return `login-form-${this.compId}`
            },
            modalId: function () {
                return `login-mod-${this.compId}`
            }
        },
        data: function () {
            return {
                compId: null
            };
        },
        methods: {
            close() {
                $('#' + this.modalId).modal('hide')
            },
            submitForm() {
                $('#' + this.formId).submit()
            }
        },
        beforeMount: function () {
            this.compId = utils.generateRandomNumber()
        },
        mounted: function () {
            $('#' + this.modalId).modal({ backdrop: 'static', keyboard: false })
            $('#' + this.modalId).modal('show')
        }
    });

})(jQuery, OaksEncryptor)