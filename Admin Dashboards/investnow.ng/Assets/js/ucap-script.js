var UcapUtil = (function ($, OEnc, _, Vue, moment) {
    "use strict";

    let encryptor = new OEnc($("#api_base_url").val(), "", "");

    let selAction = function (el, binding, vnode) {
        let placeholder = $.trim($(el).data("placeholder")),
            valueField = $.trim($(el).data("valueField")),
            displayField = $.trim($(el).data("displayField"));

        $(el).empty();
        if ($.trim(placeholder) !== "") {
            let option = $(["<option value=''>", placeholder, "</option>"].join(""));
            $(el).html(option);
        }

        binding.value.forEach(function (cur) {
            let option = document.createElement("option");
            option.value = valueField !== "" ? cur[valueField] : cur;
            option.innerText = displayField !== "" ? cur[displayField] : cur;
            $(el).append(option);
        });

        $(el).material_select();
    }

    Vue.directive("options", {
        bind: selAction,
        update: selAction
    })

    $.fn.actionLoading = function (action) {
        var self = $(this);
        if (self.length <= 0) {
            self = $(document.body);
        }

        var tagName = self.prop("tagName").toLowerCase();

        if (action === "hide") {
            self.children("div[role='overlay']").remove();
        } else {
            var loaderTemplate = $([
                '<div  class="preloader- wrapper big active">',
                '<div class="spinner-layer spinner-blue-only">',
                '<div class="circle-clipper left">',
                '<div class="circle"></div>',
                '</div><div class="gap-patch">',
                '<div class="circle"></div>',
                '</div><div class="circle-clipper right">',
                '<div class="circle"></div>',
                '</div>',
                '</div>',
                '</div>'
            ].join(""));

            loaderTemplate.css({
                width: "10%",
                "padding-bottom": "10%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%)"
            });

            var zIndices = self.find("*").map(function (i, curr) {
                return Number($(curr).css("z-index"));
            }).filter(function (i, curr) {
                return !_.isNaN(curr);
            });

            var zIndex = 9999999999
            if (zIndices.length > 0) {
                var zIndex = Math.max(...zIndices) + 100;
            }

            var overlayDiv = $("<div role='overlay'></div>");
            overlayDiv.css({
                position: tagName == "body" ? "fixed" : "absolute",
                width: "100%",
                height: "100%",
                "background-color": "#ffffff",
                "z-index": zIndex,
                opacity: "0.8",
                top: 0,
                left: 0
            });
            overlayDiv.append(loaderTemplate);

            self.css("position", "relative");
            self.append(overlayDiv);
        }

        return self;
    };

    $(".news_title").on("click", function () {
        var obj = $(this), id = obj.data("newsId");

        encryptor.send("utils", "get_news_item", {
            method: "get",
            data: {
                id: id
            }
        }).then(function (resp) {
            $.alert({
                title: resp.data["Headline"],
                content: (String(resp.data["Text"])).replace(/(?:\r\n|\r|\n)/g, "<br />"),
                boxWidth: '70%',
                type: "success",
                useBootstrap: false,
                theme: "material"
            });
        }).catch(function (resp) {
            $.alert({
                title: "Error",
                content: "There was an error loading this news item. Please check your connection",
                type: "red",
                useBootstrap: false,
                theme: "material"
            });
        });
    });

    var util = {
        /**
         * @param {string[]} array
         *
         * @returns {Date[]}
         */
        processDates: function (array) {
            var self = this;

            if (!_.isArray(array)) {
                return array;
            }

            var processed = array.map(function (currItem) {
                if (_.isObject(currItem)) {
                    for (var ppty in currItem) {
                        if (_.isString(currItem[ppty])) {
                            var match = currItem[ppty].match(/\/Date\([0-9]+\)\//);
                            if (_.isArray(match) && match.length > 0) {
                                currItem[ppty] = self.parseDate(currItem[ppty]);
                            }
                        }

                        if (_.isArray(currItem[ppty])) {
                            currItem[ppty] = self.processDates(currItem[ppty]);
                        }
                    }
                }

                return currItem;
            });

            return processed;
        },
        /**
         *
         *
         * @param {String} key
         */
        getQueryParam: function (key) {
            let params = new URLSearchParams(location.search);

            return params.get(key);
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
        getApiClient: function () {
            return new OaksEncryptor(
                document.getElementById("api_base_url").value
            )
        },
        /**
         * @param {string} dString
         *
         * @returns {Date}
         */
        parseDate: function (dString) {
            if (_.isEmpty(dString) || !_.isString(dString)) {
                return dString;
            }
            var validDateStr = dString.match(/\/Date\([0-9]+\)\//);
            if (!_.isArray(validDateStr) || validDateStr.length <= 0) {
                return dString;
            }

            var regex = /[0-9]+/, numArr = dString.match(regex);

            if (_.isEmpty(numArr) || !_.isArray(numArr)) {
                return null;
            }

            return new Date(Number(numArr[0]));
        },
        /**
         * @param {number | string} n
         *
         * @returns {string}
         */
        formatCurrency: function (n, symbol) {
            let parsed = Number.parseFloat(n);
            if (!isNaN(parsed)) {
                return numeral(parsed).format('(0,0.00)');
            }

            return "0.00";
        },
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
        formatNumber: function (n, format) {
            let parsed = Number.parseFloat(n);
            if (!isNaN(parsed)) {
                format = _.isString(format) && format.length > 0 ? format : '0,0.00'

                return numeral(parsed).format(format);
            }

            return "0.00";
        },
        /**
         * @param {number} count
         * @param {string} singular
         * @param {string} plural
         *
         * @returns {string}
         */
        pluralize: function (count, singular, plural) {
            return (Number(count) > 1) ? plural : singular;
        },
        /**
         * @returns {number}
         */
        generateRandomNumber: function () {
            return Math.floor((Math.random() * 1000000000) + 1);
        },
        numberValue: function (n) {
            let num = Number(n);

            return !_.isNaN(num) ? num : 0;
        },
        unescape: unescape,
        abs: Math.abs,
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
         * @param {Function} options.onContentReady
         * @param {Function} options.onClose
         * @param {Function} options.onDestroy
         */
        confirmAction: function (options) {
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
                onContentReady: function () {

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
                onClose: opts.onClose,
                onDestroy: opts.onDestroy,
            });
        },
        _confirmAction: function (_title, _content, action, close, actionOnNo) {
            if (_.isUndefined(close)) {
                close = true;
            }

            $.confirm({
                title: _title,
                content: _content,
                theme: "material",
                boxWidth: "30%",
                useBootstrap: false,
                buttons: {
                    yes: {
                        text: "Yes",
                        btnClass: "btn-green",
                        action: function () {
                            let self = this;

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
                            if (_.isFunction(actionOnNo)) {
                                actionOnNo();
                            }

                            return true;
                        }
                    }
                }
            });
        },
        /**
         * @param {string|JQuery|HTMLElement} content
         * @param {string} title
         * @param {'red'|'green'|'blue'|'purple'|'orange'|'dark'} type
         * @returns {Promise}
         */
        displayAlert: function (content, title, type) {
            return new Promise(function (fulfilled, rejected) {
                $.confirm({
                    title: title || "Message",
                    content: content,
                    type: type,
                    theme: "material",
                    useBootstrap: false,
                    boxWidth: "30%",
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
        fetchCompanyInfo: function (el, compCode) {
            return new Promise(function (fulfiled, rejected) {
                if (!_.isString(compCode) || _.isEmpty(compCode.trim())) {
                    rejected({
                        message: "Please provide a valid company code"
                    });
                }

                if (el.checked) {
                    $().actionLoading("show");

                    encryptor.send("utils", "get_company_info", {
                        method: "get",
                        data: {
                            company: compCode
                        }
                    }).then(function (resp) {
                        fulfiled(resp.data);
                    }).catch(function (resp) {
                        rejected({
                            message: resp.message
                        })
                    }).finally(function () {
                        $().actionLoading("hide");
                    });
                } else {
                    self.resetEntity();
                }
            });
        },
        /**
         * This function is same as PHP's nl2br() with default parameters.
         *
         * @param {string} str Input text
         * @param {boolean} replaceMode Use replace instead of insert
         * @param {boolean} isXhtml Use XHTML
         * @return {string} Filtered text
         */
        nl2br: function (str, replaceMode, isXhtml) {
            if (_.isUndefined(isXhtml))
                isXhtml = true;

            let breakTag = (isXhtml) ? '<br />' : '<br>';
            let replaceStr = (replaceMode) ? '$1' + breakTag : '$1' + breakTag + '$2';
            return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
        },
        /**
         * This function inverses text from PHP's nl2br() with default parameters.
         *
         * @param {string} str Input text
         * @param {boolean} replaceMode Use replace instead of insert
         * @return {string} Filtered text
         */
        br2nl: function (str, replaceMode) {

            let replaceStr = (replaceMode) ? "\n" : '';
            // Includes <br>, <BR>, <br />, </br>
            return str.replace(/<\s*\/?br\s*[\/]?>/gi, replaceStr);
        }

    };

    Handlebars.registerHelper("formatCurrency", function (amount) {
        return util.formatCurrency(amount);
    });
    Handlebars.registerHelper("displayDate", function (dString, format) {
        var date = util.parseDate(dString);
        if (!_.isString(format)) {
            format = "DD-MMM-YYYY ";
        }

        if (!moment(date).isValid()) {
            return "";
        }

        return moment(date).format(format);
    });

    Handlebars.registerHelper("printif", function (object) {
        // stringToPrint:boolean
        var out = [];
        for (var string in object) {
            var value = object[string];
            if (false === value || null === value || undefined === value) {
                continue;
            }
            out.push(string);
        }
        return out.join(' ');
    });

    return util;
})(jQuery, OaksEncryptor, _, Vue, moment)

const utils = UcapUtil;

Vue.filter('formatCurrency', utils.formatCurrency)
Vue.filter('formatNumber', utils.formatNumber)
Vue.filter('formatDate', utils.formatDate)
Vue.filter('formatTime', utils.formatTime)
Vue.filter('formatTime24', utils.formatTime24)
Vue.filter('formatTimeSeconds', utils.formatTimeSeconds)
Vue.filter('abs', utils.abs)
Vue.filter('numberValue', utils.numberValue)
Vue.filter('unescape', utils.unescape)
Vue.filter('boolToString', (n) => utils.stringToBoolean(n) ? 'Yes' : 'No')
Vue.filter('arrayLength', (arr) => Array.isArray(arr) ? arr.length : 0);
Vue.filter('nl2br', utils.nl2br);
Vue.filter('br2nl', utils.br2nl);