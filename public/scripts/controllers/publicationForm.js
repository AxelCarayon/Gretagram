function resetPub (){
    $(".text-create-publication").html("");
    console.log($('.fileSpan'));

    $('.fileSpan').text('Choisis une photo');
    $('.img-create-publication').attr('src', "").css("display","none");
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



app.controller("publicationFormCtrl", function ($q,$scope,serviceIsConnect,servicePublicationAjax,serviceSession,serviceUserAjax) {
    // TODO
    $(".geoImg").click((e) => {
        $(e.target).toggleClass('disabled');
    });

    //Affiche l'image
    $("#file-1").change(function() {
        readURL(this);
        $('#blah[ alt]').show();
    });

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
        console.log('tab # : ',tab);
    });

    //Publier
    $('.btn-publier').click(() => {
        navigator.geolocation.getCurrentPosition(function (position) { // Je créé une fonction pour récupérer les données de géolocalisation
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            var publication = {};

            let data = new FormData(); //on crée un formData

            data.append('token', serviceSession.getValue('token')); //le token
            data.append('message',$(".text-create-publication").text()); //le message
            data.append('lat', latitude); //la latitude
            data.append('long', longitude) //la longitude
//TODO hashtags
            publication.hashtags = tab;

            console.log('message : ', $(".text-create-publication").text());
            console.log('data check ',data.get('message'));

            if ($(".img-create-publication").attr("src") != null ){
                    data.append('photo', $("#file-1")[0].files[0]); //la photo
            }

            console.log('data avant requete :',data.get('message'), data.get('photo'));

            servicePublicationAjax.newPub(data).then(
                function(rep){
                    console.log('rep newPub ',rep);
                    resetPub();

                },function (msg) {
                    //TODO alert error
                    console.log('rep error newPub ',msg);
                })

        }, function () {
            //TODO alert error
            alert('La géolocalisation est obligatoire pour utilisé nos services.');
        });
    });
})
