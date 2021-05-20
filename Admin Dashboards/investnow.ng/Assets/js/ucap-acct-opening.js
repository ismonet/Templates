var formUtils = (function ($, OEnc, PDFJS) {
    "use strict";

    var encryptor = new OEnc($("#ucap_api_url").val(), "", "");

    return {
        formatTimeSeconds: function (str, format, formatAs) {
            format = !_.isUndefined(format) ? format : moment.ISO_8601;
            var date = moment(str, format), value = "";
            if (!date.isValid()) {
                value = str;
            } else {
                value = formatAs == "date" ? date.format("ddd D MMM, YYYY") : date.format("ddd D MMM, YYYY @ hh:mm:ss.SSS a");
            }

            return value;
        },
        isImage: function (mimeType) {
            return [
                "image/jpeg", "image/jpg", "image/gif", "image/png"
            ].indexOf(mimeType) > -1;
        },
        openFileInModal: function (title, fileUrl, mimeType) {
            var self = this;
            $.LoadingOverlay("show");

            if (self.isImage(mimeType)) {
                $.confirm({
                    title: title,
                    content: '<img src="' + fileUrl + '" />',
                    boxWidth: "50%",
                    useBootstrap: false,
                    buttons: {
                        cancel: {
                            text: "Close",
                            action: function () {

                            }
                        }
                    },
                    onContentReady: function () {
                        $.LoadingOverlay("hide");
                    }
                });
            } else if (mimeType == "application/pdf") {
                PDFJS.getDocument(fileUrl).then(function (pdf) {
                    $.confirm({
                        title: title,
                        context: "",
                        columnClass: "col-md-9",
                        buttons: {
                            //prev: {
                            //    text: "Previous Page",
                            //    btnClass: "blue",
                            //    action: function () {

                            //    }
                            //},
                            //next: {
                            //    text: "Next Page",
                            //    btnClass: "blue",
                            //    action: function () {

                            //    }
                            //},
                            close: {
                                text: "Close",
                                btnClass: "btn-red",
                                action: function () {

                                }
                            }
                        },
                        onContentReady: function () {
                            var jc = this;

                            pdf.getPage(1).then(function (page) {
                                var scale = 1,
                                    viewport = page.getViewport(scale),
                                    canvas = document.createElement("canvas"),
                                    context = canvas.getContext("2d");

                                canvas.height = viewport.height;
                                canvas.width = viewport.width;

                                var div = document.createElement("div");
                                div.classList.add("w-100");
                                div.appendChild(canvas);
                                $(div).css({
                                    "height": "370px",
                                    "overflow-y": "auto"
                                });
                                page.render({
                                    canvasContext: context,
                                    viewport: viewport
                                });

                                jc.setContent(div);
                            }).catch(function (resp) {
                                $.alert("There was an error rendering the PDF file");
                            }).finally(function () {
                                $.LoadingOverlay("hide");
                            });
                        }
                    });
                }).catch(function (resp) {
                    $.alert("There was an error retrieving PDF file");
                });
            }
        },
        formatTime: function (str, format, formatAs, displayFormat) {
            format = !_.isUndefined(format) && !_.isNull(format) ? format : moment.ISO_8601;
            var date = moment(str, format), value = "";
            if (!date.isValid()) {
                value = str;
            } else if (!_.isEmpty(displayFormat)) {
                value = date.format(displayFormat);
            } else {
                value = formatAs == "date" ? date.format("ddd D MMM, YYYY") : date.format("ddd D MMM, YYYY @ hh:mm a");
            }

            return value;
        },
        formatTime24: function (str, format, formatAs, displayFormat) {
            format = !_.isUndefined(format) && !_.isNull(format) ? format : moment.ISO_8601;
            var date = moment(str, format), value = "";
            if (!date.isValid()) {
                value = str;
            } else if (!_.isEmpty(displayFormat)) {
                value = date.format(displayFormat);
            } else {
                value = formatAs == "date" ? date.format("ddd D MMM, YYYY") : date.format("D MMM, YYYY @ HH:mm");
            }

            return value;
        },
        formatDate: function (str, format, formatAs, displayFormat) {
            format = !_.isUndefined(format) && !_.isNull(format) ? format : moment.ISO_8601;
            var date = moment(str, format), value = "";
            if (!date.isValid()) {
                value = str;
            } else if (!_.isEmpty(displayFormat)) {
                value = date.format(displayFormat);
            } else {
                value = formatAs == "date" ? date.format("ddd D MMM, YYYY") : date.format("D MMM, YYYY");
            }

            return value;
        },
        formatCurrency: function (n) {
            var n = Number.parseFloat(n);
            if (_.isNumber(n)) {

                var num = n.toFixed(2).replace(/./g, function (c, i, a) {
                    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                });

                return num;
            }

            return "0.00";
        },
        formatNumber: function (n) {
            var n = Number.parseFloat(n);
            if (_.isNumber(n)) {

                var num = n.toFixed(0).replace(/./g, function (c, i, a) {
                    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                });

                return num;
            }

            return "0.00";
        },
        stringToBoolean: function (string) {
            if (string === true || string === false) {
                return string;
            }
            try {
                switch (string.toLowerCase()) {
                    case "true":
                    case "yes":
                    case "1":
                        return true;
                    case "false":
                    case "no":
                    case "0":
                    case null:
                    case undefined:
                        return false;
                    default:
                        return Boolean(string);
                }
            } catch (e) {
                return false;
            }
        },
        generateRandomNumber: function () {
            return Math.floor((Math.random() * 1000000000) + 1);
        },
        /**
         * 
         * 
         * @param {String} key
         */
        getQueryParam: function (key) {
            var params = new URLSearchParams(location.search);

            return params.get(key);
        },
        /**
         * 
         * @param {any} key
         * @param {any} value
         */
        setQueryParam: function (key, value) {
            var params = new URLSearchParams(location.search),
                url = location.href.split("?");

            params.set(key, value);
            var newUrl = url[0] + "?" + params.toString();
            history.pushState({
                title: document.title,
                url: newUrl
            }, document.title, newUrl);
        },
        /**
         * @param {string} _title
         * @param {string} _content
         * @param {Function} action
         * @param {Function} close
         */
        confirmAction: function (_title, _content, action, close) {
            if (_.isUndefined(close)) {
                close = true;
            }

            $.confirm({
                title: _title,
                content: _content,
                buttons: {
                    yes: {
                        text: "Yes",
                        btnClass: "btn-green",
                        action: function () {
                            var self = this;

                            if (_.isFunction(action)) {
                                action(self);
                            }

                            return close;
                        }
                    },
                    no: {
                        text: "No",
                        btnClass: "btn-red",
                        action: function () {

                        }
                    }
                }
            });
        },
        /**
         * @param {object} options
         * @param {string} options.title
         * @param {string|JQuery|HTMLElement} options.content
         * @param {object} options.yesBtn
         * @param {string} options.yesBtn.text
         * @param {string} options.yesBtn.btnClass
         * @param {Function} options.yesBtn.action
         * @param {object} options.noBtn
         * @param {string} options.noBtn.text
         * @param {string} options.noBtn.btnClass
         * @param {Function} options.noBtn.action
         * @param {string} options.width
         * @param {boolean} options.closeIcon
         * @param {boolean} options.closeAfterAction
         * @param {Function} options.onOpen
         * @param {Function} options.onContentReady
         * @param {Function} options.onOpenBefore
         * @param {Function} options.onAction
         * @param {Function} options.onClose
         * @param {Function} options.onDestroy
         */
        showModal: function (options) {
            var opts = $.extend(true, {
                title: "Confirm Action",
                content: "Please confirm action",
                yesBtn: {
                    text: "Yes",
                    btnClass: "btn-green",
                    action: function () {

                    }
                },
                noBtn: {
                    text: "No",
                    btnClass: "btn-red",
                    action: function () {

                    }
                },
                width: "30%",
                closeIcon: true,
                closeAfterAction: false,
                onOpen: function () {

                },
                onContentReady: function () {

                },
                onOpenBefore: function () {

                },
                onAction: function () {

                },
                onClose: function () {

                },
                onDestroy: function () {

                }
            }, options);

            var btns = {};
            if (_.isObject(opts.yesBtn)) {
                btns.yes = opts.yesBtn;
            }
            if (_.isObject(opts.noBtn)) {
                btns.no = opts.noBtn;
            }

            $.confirm({
                title: opts.title,
                content: opts.content,
                theme: "material",
                useBootstrap: false,
                scrollToPreviousElement: true,
                boxWidth: opts.width,
                buttons: btns,
                closeIcon: opts.closeIcon,
                onContentReady: opts.onContentReady,
                onOpen: opts.onOpen,
                onOpenBefore: opts.onOpenBefore,
                onClose: opts.onClose,
                onAction: opts.onAction,
                onDestroy: opts.onDestroy
            });
        },
        displayAlert: function (content, title, type) {
            return new Promise(function (fulfilled) {
                $.confirm({
                    title: title || "Message",
                    content: content,
                    type: type,
                    theme: "bootstrap",
                    columnClass: "col-4",
                    buttons: {
                        ok: {
                            text: "Ok",
                            action: function () {
                                fulfilled();
                            }
                        }
                    }
                });
            });
        },
        setFileBase64: function (event, __self, prop) {
            var file = event.target
                , reader = new FileReader(), res = [];

            if (!_.isString(prop)) {
                return;
            }
            var pParts = prop.split(".");

            reader.addEventListener("load", function () {
                var result = reader.result;
                res.push(result.substring(result.indexOf("base64,") + "base64,".length));

                var val = file.multiple == "multiple" || file.multiple == true
                    ? res : res[0];

                switch (pParts.length) {
                    case 1:
                        __self[pParts[0]] = val;
                        break;
                    case 2:
                        __self[pParts[0]][pParts[1]] = val;
                        break;
                    case 3:
                        __self[pParts[0]][pParts[1]][prop[2]] = val;
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
    }

})(jQuery, OaksEncryptor, pdfjsLib);