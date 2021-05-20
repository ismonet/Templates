(function ($, oEnc, Vue, _, util, oPayStack) {
    "use strict";
    var enc = new oEnc(
        document.getElementById("api_base_url").value,
        "",
        ""
    ), encryptor = enc;

    Vue.component("html-snippet", {
        template: [
            '<div v-if="!_.isEmpty(snippet.content)" :class="div_class" :style="div_style">',
            '{{snippet.content}}',
            '</div>'
        ].join(""),
        props: {
            content_id: String,
            display_title: Boolean,
            div_class: String,
            div_style: String
        },
        data: function () {
            return {
                snippet: {
                    title: "",
                    content: ""
                },
                _: _
            }
        },
        methods: {
            getContent: function () {
                var self = this;

                enc.send("content", "get", {
                    method: "get",
                    data: {
                        id: self.content_id
                    }
                }).then(function (resp) {
                    self.snippet = resp.data;
                }).catch(function (resp) {

                })
            }
        },
        mounted: function () {
            var self = this;
            self.getContent();
        }
    });
})(jQuery, OaksEncryptor, Vue, _, UcapUtil, OPayStack);