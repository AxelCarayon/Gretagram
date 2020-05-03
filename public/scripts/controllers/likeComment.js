function idInListOfObj(list,e){
    for (var i = 0; i<list.length;i++){
        //console.log(likes[i]._id);
        if (list[i]._id == e) {
            return i
        }
    }
    return -1;
}

function getPublicationWithId ($scope,obj) {
    let pub;
    
    for (const i in $scope.pubs) {     
        if ($scope.pubs[i]._id == obj) {
            pub = $scope.pubs[i];
            break;
        }
    }   
    return pub
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

    $scope.like = ($event) => {
        var publication_id = $($event.target).attr("publication-id"); // L'ID de la publication
        var t = 'liked' + publication_id;
        var publication = getPublicationWithId($scope,publication_id);

        var index = idInListOfObj(publication.likes,idUserCo);

        if (index > -1) {
            publication.likes.splice(index, 1);
            $scope[t] = false
        }
        else {
            publication.likes.push({_id:idUserCo});
            $scope[t] = true
        }
        servicePublicationAjax.setLike({'id':publication._id, 'token': token });
    };

    $scope.verifComment = ($event) => {

        if ($($event.target).val()) {
            $($event.target).next().attr('disabled', false);
        } else {
            $($event.target).next().attr('disabled', true);
        }
    };

    $scope.sendComment = ($event) => {
        var publication_id = $($event.target).attr("publication-id"); // L'ID de la publication
        var comment = $($event.target).prev().val(); //Le message du commentaire

        servicePublicationAjax.setComment({token:token,id:publication_id,message:comment}).then(
            function (rep) {
                 for (const i in $scope.pubs) {
                     if ($scope.pubs[i]._id == publication_id) {
                         $scope.pubs[i] = rep.data;
                         break;
                     }
                 }
            },function (rep) {
                //TODO alert error
                console.log(rep);
            }
        );

        $($event.target).prev().val("");
        $($event.target).attr('disabled', true);
    };
});