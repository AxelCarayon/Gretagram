console.log("test");

const alert = {
    INFO: "info",
    ERROR: "error",
    SUCCESS: "success"
}
function createAlert(alertType,title, message) {

    switch (alertType) {
        case alert.INFO:

                $(".bloc-alert").css("background","#45aaf2")
                .css("box-shadow","4px 6px 36px 7px #45aaf2d7")
            
            break;
        case alert.SUCCESS:

                $(".bloc-alert").css("background","#20bf6b")
                .css("box-shadow","4px 6px 36px 7px #20bf6bd7")
            
            break;
        case alert.ERROR:

                $(".bloc-alert").css("background","#fc5c65")
                .css("box-shadow","4px 6px 36px 7px #fc5c65d7")
            
            break;
    
        default:
            break;
    }
    
    $(".bloc-alert-title").text(title);
    $(".bloc-alert-para").text(message);
    $(".bloc-alert").fadeIn()
    setTimeout(function(){ $(".bloc-alert").fadeOut(); }, 3000);
}