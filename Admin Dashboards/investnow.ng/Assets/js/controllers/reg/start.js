(function ($, oEnc) {
    "use strict";

    var encryptor = new oEnc(
        document.getElementById("api_base_url").value
    );

    $(function () {
        $('.account-opening-trigger').each(function (i, elem) {
            $(elem).on('click', function (event) {
                event.preventDefault()
                var acctType = $(elem).data('accountType')

                if (typeof acctType !== 'string' || acctType.length <= 0) {
                    utils.displayAlert('No valid account type selected')
                    return
                }

                var regInstance = new RegisterComp({
                    propsData: {
                        acctType: acctType
                    }
                }),

                    mountPoint = document.createElement('div');
                document.body.appendChild(mountPoint)
                regInstance.$mount(mountPoint)
            })
        })
    })
})(jQuery, OaksEncryptor)










