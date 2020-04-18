function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

angular.module('app',[])
    .controller('connexionCtrl',['$scope','serviceConnexionAjax','serviceSession','serviceIsConnect',function ($scope,serviceConnexionAjax, serviceSession,serviceIsConnect) {

        if (serviceIsConnect){
            serviceSession.destroyItem('token');
        }
        $scope.connexionAct = function(){
            var datas = getFormData($('#codeForm'));
            console.log("datas", datas);
            if (datas.username != "" && datas.password != "") {
                serviceConnexionAjax.connexion(datas)
                    .then(function (a) {
                        serviceSession.setValue("token",a);
                        window.location.href = "/";
                    }, function (msg) {
                        console.log("Erreur serveur : ",msg);
                        //TODO: msg Erreur
                });
            }else{
                $('.error2').css("display","block");
            }
        }
    }]);


