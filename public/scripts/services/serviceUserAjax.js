var url = "/api/user";
angular.module('app')
    .service('serviceUserAjax', function () {
        return{
            newUser: function(data){
                $.ajax({
                    url: url,
                    method: "POST",
                    data: data,
                    success: function(res){
                       // window.location.href = "/login";
                        console.log(res);

                    },
                    error : function(res){
                        console.log("Erreur serveur.");
                        //TODO: msg Erreurconsole.log(res)
                        }
                });

            }
        };


    });;



