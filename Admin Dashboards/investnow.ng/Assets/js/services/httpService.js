var httpService = (function () {

    var makeHttpPost = function (url, data) {
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                data: data,
                url: url,
                processData: false,
                cache: false,
                contentType: 'application/json',
                dataType: 'json',
                type: 'post',
                success: function (response) {
                    resolve(response);
                },
                error: function (error) {
                    reject(error);
                }
            });
        })
        return promise;
    }
    var makeHttpGet = function (url) {
        var promise = new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                processData: false,
                cache: false,
                accept: 'application/json',
                dataType: 'json',
                type: 'GET',
                success: function (response) {
                    resolve(response);
                },
                error: function (error) {
                    reject(error);
                }
            });
        })
        return promise;
    }

    var postFiles = function (url,data) {
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                data: data,
                url: url,
                processData: false,
                cache: false,
                contentType: false,
                type: 'post',
                success: function (response) {
                    resolve(response);
                },
                error: function (error) {
                    reject(error);
                }
            });
        })
        return promise;
    }

    return {
        Post: makeHttpPost,
        Get: makeHttpGet,
        PostFile:postFiles
    }
}());

