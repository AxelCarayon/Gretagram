function idInListOfObj(list,e){
    for (var i = 0; i<list.length;i++){
        //console.log(likes[i]._id);
        if (list[i]._id == e) {
            return i
        }
    }
    return -1;
}

function addNameinListOfObj (list , id, e){
    for (var i = 0; i<list.length;i++){
        if (list[i].userID == id) {
            list[i].userName = e
        }
    }
    return list;
}

function addPPinListOfObj (list , id, e){
    if (e== null){
        e = "View/ressources/profile.svg.png";
    }
    for (var i = 0; i<list.length;i++){
        if (list[i].userID == id) {
            list[i].pp = e
        }
    }
    return list;
}


angular.module('app').controller("likeCommentCtrl", function ($location,$scope,servicePublicationAjax,serviceSession,serviceUserAjax) {

    var idUserCo = serviceSession.getValue('id');
    var token = serviceSession.getValue('token');
    var idProfil;

    if (getIdUrl()!=-1){
        idProfil = getIdUrl();
    }else {
        idProfil = idUserCo;
    }

    var pubs = function(){
        //Récupération des publications
        servicePublicationAjax.getPubUser({'id':idProfil}).
        then(function (publications) {
            console.log('publications : ',publications);
            $scope.pubs = publications;

        },function (rep) {
            //TODO Alert
            console.log('error',rep);
        });


    };

    $scope.like = ($event, $index) => {
        $event.preventDefault();
        var publication_id = $($event.target).attr("publication-id"); // L'ID de la publication
        var t = publication_id + 'liked';

        var publication_theme;

        if ($($event.target).is("div")) {
            publication_theme = $($event.target).parent().parent().parent().attr('publication-theme');
        } else if ($($event.target).is("svg")) {
            publication_theme = $($event.target).parent().parent().parent().parent().parent().attr('publication-theme');
        } else if ($($event.target).is("path")) {
            publication_theme = $($event.target).parent().parent().parent().parent().parent().parent().attr('publication-theme');
        }


        var publication = $scope[publication_theme][$index];
        var index = idInListOfObj(publication.likes,idUserCo);

        if (index > -1) {
            $scope[publication_theme][$index].likes.splice(index, 1);
            $scope[t] = false // TODO Coeur rouge
        }
        else {
            $scope[publication_theme][$index].likes.push({_id:idUserCo});
            $scope[t] = true
        }

        servicePublicationAjax.setLike({'id':publication._id, 'token': token });

    };

    $scope.verifComment = ($event, $index) => {

        if ($($event.target).val()) {
            $($event.target).next().attr('disabled', false);
        } else {
            $($event.target).next().attr('disabled', true);
        }
    };

    $scope.sendComment = ($event, $index) => {
        var publication_id = $($event.target).attr("publication-id"); // L'ID de la publication
        var comment = $($event.target).prev().val(); //Le message du commentaire

        servicePublicationAjax.setComment({token:token,id:publication_id,message:comment}); //data = token,id:pub,message
        pubs();

        $($event.target).prev().val("");
        $($event.target).attr('disabled', true);
    };

    $scope.showModal = ($event,$index) => {

        $scope.modal = $scope.pubs[$index].commentaires;

        var mem = [];
        for (var i = 0; i<$scope.modal.length;i++){
            var id = $scope.modal[i].userID;
            if (!mem.includes( id)){
                mem.push(id);

                serviceUserAjax.getUser({id:id}).then(function (user) {
                        var name = user.prenom +' '+user.nom;
                        $scope.modal = addNameinListOfObj($scope.modal,user.id,name);
                        $scope.modal = addPPinListOfObj($scope.modal,user.id,user.pp);
                    }
                );
            }
        }
    };
});



