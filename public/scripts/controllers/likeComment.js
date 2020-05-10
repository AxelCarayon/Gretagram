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


angular
.module('app')
.filter('trustAsHtml',['$sce', function($sce) {

    return function(text) {
  
      return $sce.trustAsHtml(text);
  
    };
  
  }])
.controller("likeCommentCtrl", function ($location,$scope,servicePublicationAjax,serviceSession,serviceUserAjax) {

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
    
    //Partager une publication
    $scope.share = ($event) => {
        const publicationString = $($event.target).attr("publication")
        const publication = JSON.parse(publicationString);

        let message =
            `
            - Allez voir cette <a href="/publication?id=${publication._id}"> publication </a> de <a href="/profil?id=${publication.userID}" style="cursor: pointer;" >${publication.userName}</a>
            `;

        let data = new FormData(); //on crée un formData

        data.append('token',token); //le token
        data.append('message', message); //le message

       /* if (publication.photo) {
                    data.append('photoString', publication.photo);
                    console.log('data apres photo ',data);
                    sharePub(data);
        }else sharePub(data);*/

        sharePub(data);

        function sharePub(data){
            console.log('sharePub',data.photo)
            servicePublicationAjax.newPub(data).then(
                function() {
                    createAlert('success',"YOUPI",'Votre publication a été partagée !');
                },
                function() {
                    createAlert('error','Erreur :',"Partage indisponnible.");
            });
        }
    }

    $scope.verifComment = ($event) => {

        if ($($event.target).val()) {
            $($event.target).next().attr('disabled', false);
        } else {
            $($event.target).next().attr('disabled', true);
        }
    };

    $scope.sendComment = ($event) => {
        let publication_id = $($event.target).attr("publication-id"); // L'ID de la publication
        let comment = $($event.target).prev().val(); //Le message du commentaire

        servicePublicationAjax.setComment({token:token,id:publication_id,message:comment}).then(
            function (rep) {
                 for (const i in $scope.pubs) {
                     if ($scope.pubs[i]._id == publication_id) {
                         $scope.pubs[i] = rep.data;
                         break;
                     }
                 }
            },function (rep) {
                createAlert('ERROR',rep,'Impossible de commenter la publication.');
            }
        );

        $($event.target).prev().val("");
        $($event.target).attr('disabled', true);
    };

    $scope.trashPub = ($event) => {
        let publication_id = $($event.target).attr("publication-id"); // L'ID de la publication
        servicePublicationAjax.trashPub({token:token,id:publication_id}).then(
            function () {
                for (const i in $scope.pubs) {
                    if ($scope.pubs[i]._id == publication_id) {
                        $scope.pubs.splice(i, 1);
                        break;
                    }
                }
            },function (msg) {
                createAlert('ERROR',msg,'Impossible de supprimer la publication.')
            }
        )
    }
});