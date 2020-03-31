var compte = {};

var creerCompte = () => {
    var tab = $("input").serializeArray();
    try {
        $(tab).each((k, v) => {
            if (v.value == "") {
                throw Error("error");
            }
            compte[v.name] = v.value;
        });


        //Requete Ajax avec l'objet compte en data
        console.log(compte);
        
    } catch (e) {
        alert("Tout les champs doivent être remplis");

    }

}

var verifMail = () => {
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



$(".btn-creer-compte").click((e) => {
    e.preventDefault();
    
    creerCompte();
})