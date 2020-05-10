var app = angular.module('app', []);

app.controller("infoUserCtrl", function ($scope,serviceIsConnect,serviceSession,serviceUserAjax,serviceTheme) {
    if (!serviceIsConnect) {
        window.location.href = "/login";
    } else {
        let token =serviceSession.getValue('token');
        serviceTheme.getTheme();

        serviceUserAjax.getUserPrivate(token).then(
            function (user) {
                $scope.user = user.data;
                $('#'+user.data.gender).selected = true;
                verifMail();
            },function () {
                createAlert('error','Erreur serveur:',"Rechargez la page s'il vous plait.")
            }
        )
        $("#file-1").val('');
        $('.fileSpan').text('Choisis une photo');

        $('#mdp1,#mdp2').focusout((e) => {
            verifMdp();
        })

        $("#file-1").change(function() {
            changePP(this);
            $('#blah[ alt]').show();
            $('#removePhoto').removeClass('d-none');
        });

        if ($(".avatar").attr("src") !=='View/ressources/avatar.svg'){
            $('#removePhoto').removeClass('d-none');
        }else{
            $('#removePhoto').addClass('d-none');
        }

        $('#removePhoto').click(function () {
            if ($(".avatar").attr("src")=== $scope.user.pp){
                $('#removePhoto').addClass('d-none');
                $(".avatar").attr("src", 'View/ressources/avatar.svg');

            }else{
                $(".avatar").attr("src", $scope.user.pp );
            }
            $("#file-1").val('');
            $('.fileSpan').text('Choisis une photo');
        })


        $scope.modifier = () => {
            let inputs = $("input").serializeArray();
            let data = new FormData();
            let user = $scope.user;
            let date = dateFormat(new Date($scope.user.age));
            let etat = false;

            data.append('token',token);

            //Données form
            $(inputs).each((k, v) => {
                if (user[v.name] != v.value && v.value!=''){
                    if (v.name === 'age' ){
                        if (v.value!==date){
                            data.append('age',v.value);
                            etat = true;
                        }
                    }else{
                        if(v.name === 'mdp1' ){
                            if (verifMdp()){
                                data.append('password',v.value);
                                etat = true;

                            }
                        }else {
                            data.append(v.name,v.value);
                            etat = true;
                        }
                    }
                }
            });

            // Test du genre
            if ($('#genre').val() !== user.gender){etat = true;data.append('gender',$('#genre').val());}

            // Test photo
           if ($('#file-1')[0].files && $('#file-1')[0].files[0] || $(".avatar").attr("src")=== 'View/ressources/avatar.svg'){
               etat = true;
               if ($(".avatar").attr("src")=== 'View/ressources/avatar.svg' && user.pp !== 'View/ressources/avatar.svg'){
                   //data.append('photo',null);
               }else {
                   data.append('photo',$('#file-1')[0].files[0]);
               }
           }

            console.log('data :',data, etat, data.get('photo'),data.get('nom'));

            if (etat){
                serviceUserAjax.setUser(data).then(
                    function (data) {
                        console.log(data);
                        $scope.user = data.data;
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
