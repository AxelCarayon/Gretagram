'use strict';
angular.module('app')
    .service('serviceConnexionAjax', function ($http, $q) {
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
            },
            newUser: function(data){
                var deferred = $q.defer();
                $.ajax({
                    url: '/api/user',
                    method: "POST",
                    data: data,
                    success: function(res,state,msg){deferred.resolve(res);},
                    error : function(res,state,message){deferred.reject(message);}
                });
                return deferred.promise;
            }
        };
    });


