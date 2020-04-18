function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n) {
        if (n['name']=='mdp2') {
            indexed_array['password'] = n['value'];
        }
        if (n['name']=='prenom' ||n['name']=='nom' || n['name']=='email' || n['name']=='gender' ||n['name']=='age'){
            indexed_array[n['name']] = n['value'];

        }
    });

    return indexed_array;
}
function verifMail  (mail){
    if ( mail === "" || !mail.includes("@") || mail.includes(" ") ||  mail.includes("é")) {
        return false;
    }else{
        var tabmail = mail.split("@");
        var tabmailpoint = tabmail[1].split('.');
        if (tabmail.length > 2 || tabmailpoint.length > 2 ||tabmailpoint[1]==''|| !tabmail[1].includes(".")) {
            return false;
        }

    }
    return true;
};

angular.module('app',[])
    .controller('userCtrl',function ($scope,serviceUserAjax, serviceSession) {
        $scope.newUserAct = function(e){
           // e.preventDefault();
            var datas = getFormData($('#formNewUser'));
            console.log(datas);
            if(datas.nom!=='' && datas.prenom!=='' && verifMail(datas.email) && datas.password!=="" ){
                serviceUserAjax.newUser(datas);

            }else{
                console.log("Erreur information non valide.")
                //TODO: msg Erreur
            }

        }
    });
