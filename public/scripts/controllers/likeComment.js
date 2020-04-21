function idInListOfObj(list,e){
    for (var i = 0; i<list.length;i++){
        //console.log(likes[i]._id);
        if (list[i]._id == e) {
            return i
        }
    }
    return -1;
}


angular.module('app').controller("likeCommentCtrl", function ($location,$scope,servicePublicationAjax,serviceSession,serviceUserAjax) {

    var idUserCo = serviceSession.getValue('id');
    var token = serviceSession.getValue('token');

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

        var publication_theme = $($event.target).parent().parent().parent().attr('publication-theme');

        $scope[publication_theme][$index].commentaires.push({
            "nom": idUserCo,
            "message": comment,
            "date": new Date()
        });

        $($event.target).prev().val("");
        $($event.target).attr('disabled', true);
    };

    $scope.showModal = ($event,$index) => {
        var commentaires = $scope.pubs[$index].commentaires;
        $scope.modal = commentaires;
        console.log(commentaires);

// "View/ressources/profile.svg.png"
        var mem;
        for (var i = 0; i<commentaires.length;i++){
            var id = commentaires[i].userID;
            if (mem != id){
                mem =id;
                console.log(id);

                serviceUserAjax.getUser({id:id}).then(function (user) {
                        console.log(user);
                        //console.log($('#'+user.id));
                        var name = user.id+'name';
                        var pp = user.id +'pp';

                        $scope[name] = user.prenom +' '+user.nom;



                        // $('#'+user.id+'name').each( function(){
                        //     console.log($(this));
                        //     $(this).innerText = user.prenom +' '+user.nom;
                        // } );
                        //
                        // if (user.pp != null){
                        //     $('#'+user.id+'pp').attr('src',user.pp);
                        // }


                    //commentaires[i].name = user.prenom +' '+user.nom;
                    }
                );
            }

        }



    };
});



