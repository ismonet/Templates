(function ($) {
    'use strict'

    $(function () {
        $('a[data-toggle="dropdown"]').each((i, elem) => {
            $(elem).on('click', event => {
                event.preventDefault()
                var href = $(event.target).attr('href')
                $('a[data-toggle="dropdown"]').filter((i, elem) => $(elem).attr('href') !== href).map((i, elem) => $(elem).attr('href')).each((i, href) => {
                    $(href).hide()
                })

                $(href).fadeToggle()
            })
        })

        $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
            $($(e.relatedTarget).attr('href')).removeClass("d-flex align-items-stretch")
            $($(e.target).attr('href')).addClass("d-flex align-items-stretch")
        })
    })
})(jQuery)