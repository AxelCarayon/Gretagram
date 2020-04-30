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

    $scope.like = ($event, $index) => {
        $event.preventDefault();
        var publication_id = $($event.target).attr("publication-id"); // L'ID de la publication
        var t = 'liked' + publication_id;
        var publication = $scope.pubs[$index];
        var index = idInListOfObj(publication.likes,idUserCo);

        if (index > -1) {
            $scope.pubs[$index].likes.splice(index, 1);
            $scope[t] = false
        }
        else {
            $scope.pubs[$index].likes.push({_id:idUserCo});
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

        servicePublicationAjax.setComment({token:token,id:publication_id,message:comment}).then(
            function (rep) {
                $scope.pubs[$index] = rep.data;
            },function (rep) {
                //TODO alert error
                console.log(rep);
            }
        );

        $($event.target).prev().val("");
        $($event.target).attr('disabled', true);
    };

    $scope.showModal = ($event,$index) => {

        $scope.modal = $scope.pubs[$index].commentaires;

        console.log('$scope.modal',$scope.modal,$index);
        console.log('$scope.modal.length',$scope.modal.length);

        var mem = [];
        for (var i = 0; i<$scope.modal.length;i++){
            console.log('coucou');
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
      //  console.log('$scope.modal 2 ',$scope.modal,$index);

    };
});



