var app = angular.module('app', []);

app.controller("infoUserCtrl", function ($scope,serviceIsConnect,serviceSession,serviceUserAjax) {
    if (!serviceIsConnect) {
        window.location.href = "/login";
    } else {
        let token =serviceSession.getValue('token');

        serviceUserAjax.getUserPrivate(token).then(
            function (user) {
                $scope.user = user.data;
                verifMail();
            },function () {
                createAlert('error','Erreur serveur:',"Rechargez la page s'il vous plait.")
            }
        )

        $('#mdp1,#mdp2').focusout((e) => {
            verifMdp();

        })
        $("#file-1").change(function() {
            changePP(this);
            $('#blah[ alt]').show();
        });

        $scope.modifier = () => {
            let inputs = $("input").serializeArray();
            let data = {token:token};
            let user = $scope.user;
            let date = dateFormat(new Date($scope.user.age));
            let etat = false;

            //Données form
            $(inputs).each((k, v) => {
                if (user[v.name] != v.value && v.value!=''){
                    if (v.name === 'age' ){
                        if (v.value!==date){
                            data.age = v.value;
                            etat = true;
                        }
                    }else{
                        if(v.name === 'mdp1' ){
                            if (verifMdp()){
                                data.password = v.value;
                                etat = true;

                            }
                        }else {
                            data[v.name]=v.value;
                            etat = true;
                        }
                    }
                }
            });

            // Test du genre
            if ($('#genre').val() !== user.gender){etat = true;data.gender = $('#genre').val();}

            // Test photo
           //if ($('#file-1')[0].files && $('#file-1')[0].files[0]){etat = true; data.pp = $('#file-1')[0].files[0];}

            console.log('data :',data, etat);

            if (etat){
                serviceUserAjax.setUser(data).then(
                    function (data) {
                        console.log(data);
                        createAlert('success', 'Information mise à jours.')
                    },function (data) {
                        console.log(data);
                        createAlert('error', 'Une erreur est subvenu.')
                    }
                )

            } else createAlert('info','Info :',"vous n'avez pas modifié vos informations.")


        }
    }
})

function dateFormat(date) {
    let m = date.getMonth()+1
    let d = date.getDate();
    let a = date.getFullYear();
    if (m<10){m = '0'+m}
    if (d<10){ d = '0'+d;}
    return a+'-'+m+'-'+d;

}
function verifMdp() {
    var drap = false;
    var drap2 = false;
    if ($("#mdp1").val() != $("#mdp2").val()) {
        $(".mdp-false").fadeIn();
        drap = false;
    } else {
        $(".mdp-false").fadeOut();
        drap = true;
    }

    if ( $("#mdp1").val().length < 5 || ($("#mdp1").val() == "" )) {
        $(".mdp-false2").fadeIn();
        drap2 = false;
    }else{
        $(".mdp-false2").fadeOut();
        drap2 = true;
    }

    if ((!drap) || (!drap2) ) {
        $("#mdp1").parent().parent().addClass("invalid");
        $("#mdp2").parent().parent().addClass("invalid");
        $('.fa-key').addClass('invalid');
        $('.mdps').addClass('invalid');
    }else{
        $("#mdp1").parent().parent().removeClass("invalid");
        $("#mdp2").parent().parent().removeClass("invalid");
        $('.fa-key').removeClass('invalid');
        $('.mdps').removeClass('invalid');
    }
    return drap && drap2;
}
function verifMail ()  {
    var drap = true;
    var mail = $("#mail").val();
    if (!mail.includes("@") || mail.includes(" ") || mail.includes("é")) {
        $("#mail").parent().parent().addClass("invalid");
        drap = false;
    } else {
        $("#mail").parent().parent().removeClass("invalid");
        var tabmail = mail.split("@");
        if (tabmail.length > 2) {
            drap = false;
        }
        var tabmailpoint = tabmail[1].split('.');
        if (tabmailpoint.length > 2) {
            drap = false;
        }
        if (!tabmail[1].includes(".")) {
            drap = false
        }
    }

    if (mail == "") {
        drap = true;
    }
    if (drap) {
        $("#mail").parent().parent().removeClass("invalid");
        $('.fa-at').removeClass("invalid");
        $('.h5mail').removeClass("invalid");
        $(".mail-false").fadeOut();
    } else {
        $("#mail").parent().parent().addClass("invalid");
        $('.fa-at').addClass("invalid");
        $('.h5mail').addClass("invalid");
        $(".mail-false").fadeIn();
    }

    return drap;

}
function changePP(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $(".avatar").attr("src", e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
