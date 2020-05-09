var app = angular.module('app');

app.service('serviceLocation', function ($q) {
    return {
        getAPI: function (data) {
            var deferred = $q.defer();
            $.ajax({
                method: "GET",
                data : {
                    lat : data.lat,
                    lng : data.long,
                    username : 'gretagram'
                },
                url : "http://api.geonames.org/countryCodeJSON?",
                success : function (res) {
                    deferred.resolve(res);
                },
                error : function (err) {
                    console.log(err);
                    deferred.reject(err);
                }
            });
            return deferred.promise;
        },
        getLoc: function (list) {
            let deferred = $q.defer();

            let locations = {};
            let name = [];
            let data = []
            for (const i in list){
                this.getAPI(list[i].position).then(
                    function (res) {
                        if (res.countryName in locations) {
                            locations[res.countryName] ++;
                        } else {
                            name.push(res.countryName)
                            locations[res.countryName] = 1;
                        }
                    },function (err) {
                        console.log('err');
                    }
                )

            }
            deferred.resolve([locations,name.sort()]);

            return deferred.promise;



        }


    }
})