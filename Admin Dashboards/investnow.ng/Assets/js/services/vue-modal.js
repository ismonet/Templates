(function ($) {
    "use strict";

    Vue.component("modal", {
        template: [
            '<button v-cloak :class="btn_class" type="button" :id="btnId" :data-target="\'#\' + id">',
            '<slot></slot>',
            '</button>'
        ].join(''),
        props: {
            btn_title: String,
            btn_class: String,
            modal_class: String,
            modal_title: String,
            modal_width: String,
            id: String,
            btnId: String,
            content_template: String,
            content_params: Object,
            ok_btn_text: String,
            cancel_btn_text: String
        },
        data: function () {
            return {
                modalShown: false,
                vueInstance: null
            }
        },
        beforeMount: function () {
            var self = this, num = formUtils.generateRandomNumber()
            self.id = "modal-" + num;
            self.btnId = "btn-" + num;
        },
        mounted: function () {
            var self = this;

            $("#" + self.btnId).on("click", function (e) {
                e.preventDefault();

                var res = $(self.content_template).text(),
                    modContId = "mod-content-" + self.id, div = document.createElement("div"),
                    r = Vue.compile(res);
                div.id = modContId;

                var opts = {
                    title: self.modal_title,
                    content: div,
                    theme: "material",
                    useBootstrap: false,
                    boxWidth: self.modal_width,
                    alignMiddle: true,
                    buttons: {
                        ok: {
                            text: !_.isEmpty(self.ok_btn_text) ? self.ok_btn_text : "Ok",
                            btnClass: "btn-green",
                            action: function () {
                                var jc = this;

                                var promise = new Promise(function (toClose) {
                                    self.$emit("on-ok", {
                                        vueInstance: self.vueInstance,
                                        close: toClose
                                    });
                                });

                                promise.then(function (close) {
                                    if (formUtils.stringToBoolean(close || false)) {
                                        jc.close();
                                    }
                                });

                                return false;
                            }
                        },
                        cancel: {
                            text: !_.isEmpty(self.cancel_btn_text) ? self.cancel_btn_text : "Cancel",
                            btnClass: "btn-red",
                            action: function () {
                                var jc = this;

                                var promise = new Promise(function (notToClose) {
                                    self.$emit("on-cancel", jc, notToClose);
                                });

                                promise.then(function (notToClose) {
                                    if (!formUtils.stringToBoolean(notToClose)) {
                                        jc.close();
                                    }
                                });

                                if (!self.$listeners["on-cancel"]) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    },
                    onContentReady: function () {
                        var jc = this;

                        self.vueInstance = new Vue({
                            data: self.content_params,
                            components: {
                                datepicker: vuejsDatepicker
                            },
                            render: r.render,
                            staticRenderFns: r.staticRenderFns,
                            methods: {
                                setFileBase64: function (event, prop) {
                                    var __self = this,
                                        file = event.target
                                        , reader = new FileReader(), res = [];

                                    if (!_.isString(prop)) {
                                        return;
                                    }
                                    var pParts = prop.split(".");

                                    reader.addEventListener("load", function () {
                                        res.push(reader.result);
                                        var val = file.multiple == "multiple" || file.multiple == true
                                            ? res : res[0];
                                        var _val = val.split(",");

                                        switch (pParts.length) {
                                            case 1:
                                                __self[pParts[0]] = _val[1];
                                                break;
                                            case 2:
                                                __self[pParts[0]][pParts[1]] = _val[1];
                                                break;
                                            case 3:
                                                __self[pParts[0]][pParts[1]][prop[2]] = _val[1];
                                                break;
                                            default:

                                                break;
                                        }
                                    }, false);

                                    if (file.files.length > 0) {
                                        _.forEach(file.files, function (f) {
                                            reader.readAsDataURL(f);
                                        });
                                    }
                                }
                            },
                            mounted: function () {
                                var __self = this;
                                //$('input[type="checkbox"]').bootstrapToggle();
                                self.$emit("modal-mounted", __self);
                            }
                        }).$mount("#" + modContId);

                        self.modalShown = true;
                    }
                };

                if (!_.isEmpty($.trim(self.modal_class))) {
                    opts.columnClass = self.modal_class;
                }

                $.confirm(opts);
            });
        }
    })
})(jQuery);