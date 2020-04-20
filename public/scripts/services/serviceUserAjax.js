var url = "/api/user";
var app = angular.module('app');

app.factory('serviceUserAjax', function ($http,$q,User) {
        return{
            newUser: function(data){
                var deferred = $q.defer();
                $.ajax({
                    url: url,
                    method: "POST",
                    data: data,
                    success: function(res){
                        deferred.resolve(true);
                        console.log(res);

                    },
                    error : function(res){
                        deferred.reject(res);
                        console.log(res);
                    }
                });

                return deferred.promise;

            },
            getUserPrivate: function(data){
                return $http.get('/api/private?token='+ data).then(function(data) {
                    return new User(data.data);
            });},

            getUser: function (data) {
                //data = id:user
                var deferred = $q.defer();
                $.ajax({
                    url: '/api/user',
                    method: "GET",
                    data: data,
                    success: function(res){
                        deferred.resolve(res);

                    },
                    error : function(res,state,msg){
                        deferred.reject(msg);
                    }
                });

                return deferred.promise;

            }

        };
    });