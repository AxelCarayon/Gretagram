app.service('serviceRechercheAjax', function ($q) {
    return {
        getHPub: function (data) {
            //data = hashtag
            let deferred = $q.defer();
            $.ajax({
                url: "/api/recherche/hashtag",
                method: "GET",
                data: data,
                success: function (res) {
                    deferred.resolve(res);
                },
                error: function (res) {
                    deferred.reject(res);
                }
            });
            return deferred.promise;
        },

        getUsers: function (nom) {
            //data = hashtag
            let deferred = $q.defer();
            $.ajax({
                url: "/api/recherche/user",
                method: "GET",
                data: {nom:nom},
                success: function (res) {
                    deferred.resolve(res);
                },
                error: function (res) {
                    deferred.reject(res);
                }
            });
            return deferred.promise;
        },
    }
})