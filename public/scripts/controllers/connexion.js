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
            serviceSession.destroyItem('id');
            serviceSession.destroyItem('theme');
        }
        $scope.connexionAct = function(){
            var datas = getFormData($('#codeForm'));
            if (datas.username != "" && datas.password != "") {
                serviceConnexionAjax.connexion(datas)
                    .then(function (a) {
                        serviceSession.setValue("token",a.token);
                        serviceSession.setValue("id",a.id);
                        serviceSession.setValue("theme",false);
                        window.location.href = "/";
                    }, function (msg) {
                        createAlert('error','Oups quelque chose ne va pas ..',msg.responseText);
                });
            }else{
                $('.error2').css("display","block");
            }
        }
    }]);


