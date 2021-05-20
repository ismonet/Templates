(function ($, oEnc) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value
    );

    $(function () {
        $('.gift-trigger').each(function (i, elem) {
            $(elem).on('click', function (event) {
                event.preventDefault()
                var acctType = $(elem).data('accountType')

                if (typeof acctType !== 'string' || acctType.length <= 0) {
                    utils.displayAlert('No valid account type selected')
                    return
                }

                var giftInstance = new GiftComp({
                    propsData: {
                        acctType: acctType
                    }
                }),

                mountPoint = document.createElement('div');
                document.body.appendChild(mountPoint)
                giftInstance.$mount(mountPoint)
            })
        })
    })

    //var r = {
    //    el: '#',
    //    data: {    
    //    },
    //    methods: { 
    //        close() {
    //            $('#' + this.modalId).modal('hide')
    //        }
    //    },
    //    beforeDestroy: function () {
            
    //    }
    //};

})(jQuery, OaksEncryptor)