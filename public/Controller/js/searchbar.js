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