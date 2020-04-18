'use strict';
angular.module('app')
    .service('serviceConnexionAjax', function ($http, $q,serviceSession) {
        return{
            connexion: function(data){

                $.ajax({
                    url: "/api/login",
                    method: "GET",
                    data: data,
                    success: function(res,status){
                        serviceSession.setValue("token",res);
                        window.location.href = "/";},
                    error : function(res,status){
                        console.log("erreur:",status);
                        console.log(res);}
                });

            }
        };


    });;



