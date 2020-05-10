angular.module('app',[])
    .controller('createUserCtrl',function ($scope,serviceConnexionAjax) {

        var drap2 = verifMail();
        var drap3 = verifChamps();
        var drap = drap2 && drap3;

        if (drap) {
            $('.btn-creer-compte').removeClass("disabled")
            $('.btn-creer-compte').prop("disabled", false);
            $('.btn-creer-compte').removeAttr("disabled");
        } else {
            $('.btn-creer-compte').addClass("disabled")
            $('.btn-creer-compte').prop("disabled", true);

        }

        $('#mdp1,#mdp2').focusout((e) => {
            verif();

        })
        $("#mail").focusout((e) => {
            verif();

        })

        $("input").each((i) => {
            var input = $("input").eq(i);
            if ($("input").eq(i).val() != "") {
                $("input").eq(i).parent().parent().addClass("focus");
            }

        })

        $("input").focus(function (e) {
            $(this).parent().parent().addClass("focus");
        })

        $("input").focusout(function () {
            if ($(this).val() == "") {
                $(this).parent().parent().removeClass("focus");
            }

        })
        $("#file-1").change(function() {
            changePP(this);
            $('#blah[ alt]').show();
            $('#removePhoto').removeClass('d-none');
        });
        $('#removePhoto').click(function () {
            $("#file-1").val('');
            $(".avatar").attr("src", 'View/ressources/avatar.svg');
            $('#removePhoto').addClass('d-none');
            $('.fileSpan').text('Choisis une photo');
        })

        $scope.newUserAct = function(){
            if (verif()){
                var datas = creerCompte();
                if (datas!={} && datas!=null){
                    serviceConnexionAjax.newUser(datas).then(function (data) {
                        if (data.message === 'New user created!'){
                            createAlert('success',data.message,"Ne perdez pas 1 minute connectez-vous !");
                            document.getElementById('formNewUser').reset();
                            $(".avatar").attr("src",'View/ressources/avatar.svg');

                        }else{
                            console.log(data.message);
                            createAlert('error','Oups quelque chose ne va pas ..',data.message);
                        }
                        console.log(data);
                    }, function () {
                        createAlert('error','Erreur serveur :','Impossible de créer ce compte');
                    });
                }else{
                    createAlert('error','Oups quelque chose ne va pas ..','Certaines de vos informations ne correspondent pas au format attendu, ou sont manquantes.');
                }
            }

        }
    });

var compte = new FormData();
// $('.datepicker').pickadate();
function creerCompte  ()  {
    var tab = $("input").serializeArray();
    try {
        $(tab).each((k, v) => {
            if (v.value == "") {
                console.log("vname vide : ",v.name);
               throw Error('error');
            }
            if (v.name=='prenom' ||v.name=='nom' || v.name=='email' ||v.name=='age' ){
                compte.append(v.name,  v.value);
            }
            if (v.name=='mdp2') {
                compte.append('password',  v.value);
            }
        });
        compte.append('gender',  $('#genre').val());

        if ($('#file-1')[0].files && $('#file-1')[0].files[0]){
            compte.append('photo',  $('#file-1')[0].files[0]);
        }
        return compte;

    } catch (e) {
        createAlert('error','Oups quelque chose ne va pas ..',"Tout les champs doivent être remplis "+e);
    }

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

function verifChamps() {
    var tab = $("input").serializeArray();
    var drap = true;
    $(tab).each((k, v) => {
        if (v.value == "") {
            drap = false;
        }
    });
    
    return drap;
}

function verif(){
    var drap1 = verifMdp();
    var drap2 = verifMail();
    var drap3 = verifChamps();
    var drap = drap1 && drap2 && drap3;
    
    if (drap) {
        $('.btn-creer-compte').removeClass("disabled")
        $('.btn-creer-compte').prop("disabled", false);
        $('.btn-creer-compte').removeAttr("disabled");
    } else {
        $('.btn-creer-compte').addClass("disabled")
        $('.btn-creer-compte').prop("disabled", true);

    }

    return drap1 && drap2 && drap3 ;
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

