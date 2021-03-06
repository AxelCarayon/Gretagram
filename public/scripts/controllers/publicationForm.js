function resetPub() {
    $(".text-create-publication").html("");
    $('.hashtest').empty()
    $('#removePhoto').addClass('d-none');
    $('.fileSpan').text('Choisis une photo');
    $('.img-create-publication').attr('src', "").css("display", "none");
}


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $(".img-create-publication").attr("src", e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}



app.controller("publicationFormCtrl", function($q, $scope, serviceIsConnect, servicePublicationAjax, serviceSession, serviceUserAjax) {
    // TODO
    $(".geoImg").click((e) => {
        $(e.target).toggleClass('disabled');
    });

    //Affiche l'image
    $("#file-1").change(function() {
        readURL(this);
        $('#blah[ alt]').show();
        $('#removePhoto').removeClass('d-none');
    });

    $('#removePhoto').click(function () {
        $("#file-1").val('');
        $('.img-create-publication').attr('src', "");
        $('#removePhoto').addClass('d-none');
        $('.fileSpan').text('Choisis une photo');
    })

    //Ajout des hashtag dans la creation de publication
    var tab = [];
    $(".text-create-publication").keyup((e) => {
        tab = [];
        var text = $(".text-create-publication").text();

        if (e.keyCode == 51) {
            dieze = true;
        }
        var phrase = text.split(/,| /);
        $('.hashtest').html("");
        phrase.forEach((i) => {
            if (i[0] == "#" && i != "#") {
                $('.hashtest').append("<span class='badge badge-success'>" + i +
                    "</span> ");

            }
        });
        for (let index = 0; index < $('.hashtest').children().length; index++) {
            tab.push($('.hashtest').children().eq(index).text());
        }
    });

    //Publier
    $('.btn-publier').click(() => {
        $scope.recherche = false;
        let message = $(".text-create-publication").text()
        navigator.geolocation.getCurrentPosition(function(position) { // Je créé une fonction pour récupérer les données de géolocalisation
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            let data = new FormData(); //on crée un formData

            data.append('token', serviceSession.getValue('token')); //le token
            data.append('message', message); //le message
            data.append('lat', latitude); //la latitude
            data.append('long', longitude) //la longitude

            if ($(".img-create-publication").attr("src") != null) {
                data.append('photo', $("#file-1")[0].files[0]);
            }

            servicePublicationAjax.newPub(data).then(
                function() {
                    resetPub();
                    createAlert('success','Super !','Votre publication est en ligne.');
                },
                function() {
                    createAlert('error','Erreur :',"Votre publication n'a pas pu être publié, essayez de nouveau.");
                })

        }, function() {
            createAlert('error','Erreur :',"La géolocalisation est obligatoire pour utiliser nos services.");
        });
    });
})