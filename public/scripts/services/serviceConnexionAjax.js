'use strict';
angular.module('app')
    .service('serviceConnexionAjax', function ($http, $q,serviceSession) {
        return{
            connexion: function(data){
                var deferred = $q.defer();
                $.ajax({
                    url: "/api/login",
                    method: "GET",
                    data: data,
                    success: function(res){ deferred.resolve(res); },
                    error : function(res,status,msg){ deferred.reject(msg); }
                });
                return deferred.promise;
            }
        };
    });



