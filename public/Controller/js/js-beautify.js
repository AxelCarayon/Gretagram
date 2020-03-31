// Ici ce ne sont que des fonctions cosmétiques



function changeScreenSize() {        
    window.resizeTo(screen.width-300,screen.height-500)   
}

$(document).ready(() => {


    var sombre = true; // Meme variable que dans map.js
    if (sombre) { // Si sombre est false le theme est clair sinon dark
        $('*').removeClass('sombre');
        $('*').addClass('clair');
    } else {
        $('*').removeClass('clair');
        $('*').addClass('sombre');
    }
    document.body.style.zoom = "80%"; //Dézoom de la page juste pour que ça soit plus beau 
    $(".change-theme").click(() => { // Bouton de changement de theme 
        $('*').toggleClass('sombre');
        $('*').toggleClass('clair');
    });
    $('.btn-tabs').click((e) => { // changement de classe des boutons pour changer d'aspect
        var btn = e.target;
        $('.btn-tabs').removeClass('active');
        $(btn).toggleClass('active');
    });
    //Agrandissement de la barre de recherche
    $(".form-control").focusin(() => {
        $(".form-control").addClass('col-10');
        $(".form-control").addClass('searchbar-hover');
        $(".form-control").removeClass('col-6');
        $('.search-items').fadeIn();
        $('.searchbar').addClass('active');
    }).focusout(() => {
        $(".form-control").addClass('col-6');
        $(".form-control").removeClass('col-10');
        $(".form-control").removeClass('searchbar-hover');
        $('.search-items').fadeOut();
        $('.searchbar').removeClass('active');
    });
    //Ajout des hashtag dans la creation de publication
    var dieze = false;
    var cptText = 0;
    var tab = [];
    $(".text-create-publication").keyup((e) => {
        tab = [];
        var text = $(".text-create-publication").text();
        var textbrut = $(".text-create-publication").html();
        var textReplace;
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
    var placeholderTrigger = false;
    $(".text-create-publication").focus(() => {
        if (!placeholderTrigger) {
            placeholderTrigger = !placeholderTrigger;
            $(".text-create-publication").text("");
        }
    });
    $("#file-1").on('change', (e) => {
        $("#file-1").addClass("filled");
        $("label").addClass("filled");
        console.log(e.currentTarget.value);
        $('.imgtest').append($("<img></img>").attr("src", e.currentTarget.value));
    });
    $(".text-create-publication").text("Exprimez vous...");
    $(".text-create-publication").focusout(
        function() { // Gestion de l'entrée de commentaire pour créer l'illusion d'un placeholder
            var element = $(this);
            if (!element.text().replace(" ", "").length) {
                element.empty();
            }
        });
    $('.first-button').on('click', function() {
        $('.animated-icon1').toggleClass('open');
    });
});