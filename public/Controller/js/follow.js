console.log("test");


$('.follow').click(()=>{
    console.log("test");
    if ($('.follow').hasClass("followed")) {
        $('.follow').removeClass("followed")
        $('.follow').text("S'abonner")
        //Traitement du désabonnement
        
    } else {
        $('.follow').addClass("followed")
        $('.follow').text("Abonné")

        //Traitement de l'abonnement
    }
    
})