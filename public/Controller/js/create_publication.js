

var resetPub = function(){
    $(".text-create-publication").html("");
    $('.fileSpan').text('Choisis une photo');
    $('#blah').attr('src', "").css("display","none");
}

$(".geoImg").click((e) => {
    $(e.target).toggleClass('disabled');

});


function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        $('#blah').attr('src', e.target.result);
      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }
  
  $("#file-1").change(function() {
    readURL(this);
    $('#blah[ alt]').show();
  });

//Ajout des hashtag dans la creation de publication
var cptText = 0;
var tab = [];
var test = "oui";
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

navigator.geolocation.getCurrentPosition(function (position) { // Je créé une fonction pour récupérer les données de géolocalisation
    var latitude = position.coords.latitude; // Je récupère la latitude
    var longitude = position.coords.longitude;

    $('.btn-publier').click(() => {
        var publication = {};
        var pos;

        //position
        if (!$(".geoImg").hasClass('disabled')) {
            pos = {
                latitude: latitude,
                longitude: longitude
            };
        }

        publication.pos = pos;
        publication.msg = $(".text-create-publication").text();
        publication.date = new Date();
        publication.hashtags = tab;

        //TODO: Il faut traiter l'image encore
        //Requete Ajax
        resetPub();
        
        console.log(publication);
        
        


    });
});