var app = angular.module('app');

app.service('servicePublicationAjax', function ($http,$q) {
    return{
        setLike: function (data){
            //data = token , id:pub
            $.ajax({
                url: "/api/publication/like",
                method: "POST",
                data: data,
                success: function(res){
                    console.log(res);

                },
                error : function(res){
                    console.log(res);
                }
            });
        },
        getLike: function (data){
            //data = id:pub
            $.ajax({
                url: "/api/publication/like",
                method: "GET",
                data: data,
                success: function(res){
                    console.log(res);

                },
                error : function(res){
                    console.log(res);
                }
            });
        },
        setComment: function (data) {
            //data = token,id:pub,message
            var deferred = $q.defer();
            $.ajax({
                url: "/api/publication/comment",
                method: "POST",
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
        getPubUser: function (data) {
            //data = id:user
            var deferred = $q.defer();
            $.ajax({
                url: '/api/publication/all',
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
        getPub: function (id) {
            //data = id:pub
            var deferred = $q.defer();
            $.ajax({
                url: '/api/publication',
                method: "GET",
                data: {id:id},
                success: function(res){
                    deferred.resolve(res);
                },
                error : function(res,state,msg){
                    deferred.reject(msg);
                }
            });
            return deferred.promise;
        },
        getAbonnements: function (token) {
            var deferred = $q.defer();
            $.ajax({
                url: '/api/publication/abonnes',
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
        getTrend: function (size) {
            var data;
            if (size){
                data = {size:size} ;
            }
            var deferred = $q.defer();
            $.ajax({
                url: '/api/publication/populaire',
                method: "GET",
                data: data,
                success: function(res){
                    deferred.resolve(res);
                },
                error : function(res){
                    deferred.reject(res);
                }
            });
            return deferred.promise;
        },
        getProche: function (data) {
            var deferred = $q.defer();
            $.ajax({
                url: '/api/publication/zone',
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
        newPub: function (data) {
            var deferred = $q.defer();
            $.ajax({
                url: '/api/publication',
                data: data,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function(res){
                    deferred.resolve(res);
                },
                error : function(res,state,msg){
                    console.log('service rep :',res);
                    deferred.reject(msg);
                }
            });
            return deferred.promise;
        },
    };
});