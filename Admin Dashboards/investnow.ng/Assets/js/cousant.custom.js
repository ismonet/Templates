$(document).ready(function () {
    
  

    $('#mytable').on("click", "a.enableDisable", function (e) {
        e.preventDefault();
        var name = $(this).attr('data-name');
        var href = $(this).attr('data-href');
        var action = $(this).attr('data-action');
        var intention = $(this).attr('data-intention');

        if (intention == null)
        {
            intention = action + " " + name;
        }
        $("span.reference").text(name);
        $("span.intendedAction").text(action);
        $("span.intention").text(intention);
        $("button.yesEnableDisable").attr("data-href", href);

    });

   

    $(document).on("click", "button.yesEnableDisable", function () {
        var href = $(this).attr('data-href');
        $("#md-normal").modal('toggle');
        document.getElementById('temp').href = href;
        document.getElementById('temp').click();

       
    });

    $(document).on("click", "a.signout", function () {
        $("form.signout").submit();

    });

    //$(document).on("change", "input[type=radio][name=Frequency]", function () {

    //    if (this.value == 'Weekly') {
    //        $('div.day-of-month').hide();
    //        $('div.day-of-week').show();
    //    }

    //    else if (this.value == 'Monthly') {
    //        $('div.day-of-week').hide();
    //        $('div.day-of-month').show();
    //    }

    //});

    $(document).on("click", "a.resend", function (e) {
        e.preventDefault();
        var tokenId = $('input[type=hidden][name=ID]').val();
        $.get("/Token/Resend?tokenId=" + tokenId);
    });

    
//            var options = {
//                legend: {
//                    show: true,
//                    margin: 10,
//                    backgroundOpacity: 0.9
//                },
//                points: {
//                    show: true,
//                    radius: 3
//                },
//                lines: {
//                    show: true
//                },
//                grid: { hoverable: true, clickable: true },
//               // yaxis: { min: 0,tickFormatter:formatter },
//                xaxis: { ticks: [[1, "Jan"], [2, "Feb"], [3, "Mar"], [4, "Apr"], [5, "May"], [6, "Jun"], [7, "Jul"], [8, "Aug"], [9, "Sep"], [10, "Oct"], [11, "Nov"], [12, "Dec"]] }
//            };
////
//            var seriesData =
//            {
//                data : data
////                xaxis: {
////                    mode: "time",
////                    timeformat: "%b"
////                }
//            };
//            $("#transactionChart").plot(data, options);
//        }
    });


