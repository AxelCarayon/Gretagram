var app = angular.module('app');

app.factory('serviceUserAjax', function ($http,$q) {
        return{

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
            getUserPrivate: function (token) {
                var deferred = $q.defer();
                $.ajax({
                    url: '/api/private',
                    method: "GET",
                    data: {token:token},
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
            },
            setUser : function (data){
                var deferred = $q.defer();
                $.ajax({
                    url: '/api/user',
                    method: "PATCH",
                    data: data,
                    processData: false,
                    contentType: false,
                    success: function(res){
                        deferred.resolve(res);
                    },
                    error : function(res,state,msg){
                        console.log(res);
                        deferred.reject(msg);
                    }
                });

                return deferred.promise;
            }

        };
    });