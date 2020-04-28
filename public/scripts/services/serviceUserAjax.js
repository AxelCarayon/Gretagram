var url = "/api/user";
var app = angular.module('app');

app.factory('serviceUserAjax', function ($http,$q,User) {
        return{

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

            },

            setFollow : function (token,id){
                var deferred = $q.defer();
                $.ajax({
                    url: '/api/user',
                    method: "PUT",
                    data: {token:token,id:id},
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