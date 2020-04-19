var app = angular.module('app');

app.service('servicePublicationAjax', function ($http,$q) {
    return{
        setLike: function (data){
            //data = token , id:pub
            $.ajax({
                url: url+"/like",
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
        setComment: function (data) {
            //data = token,id:pub,message
            $.ajax({
                url: url+"/comment",
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

        }

    };
});