var app = angular.module('app', []);

app.controller("publicationSoloCtrl", function ($scope,serviceIsConnect,serviceGetIdUrl,servicePublicationAjax,serviceSession,serviceUserAjax,serviceAddIdentity,serviceTheme) {
    if (!serviceIsConnect) {
        window.location.href = "/login";

    } else {
        serviceTheme.getTheme();

        let idPub = serviceGetIdUrl.get(window.location.search.slice(1,window.location.search.length));
        let idUser = serviceSession.getValue('id');

        //Ajout du nom et pp de l'user connecté
        serviceUserAjax.getUser({'id':idUser}).then(
            function (user){
                $scope.nameConnected = user.prenom +' '+user.nom;
            }
        )

        servicePublicationAjax.getPub(idPub).then(
            function (pub) {
                $scope.x = serviceAddIdentity.pub(pub);

                // TODO coeur rouge
                let t ='liked' + idPub  ;
                let likes = pub.likes;
                if (_idIsInListOfObj(likes,idUser)){
                    $scope[t] = true;
                }
                console.log( $scope[t])
            }
        )

        $(".change-theme").click(() => {
            serviceTheme.setTheme();
        })

        $scope.showModal = () => {
            servicePublicationAjax.getPub($scope.x._id).then(
                function (pub) {
                    $scope.modal = pub.commentaires;
                    serviceAddIdentity.pubs($scope.modal);
                }
            )
        };
        $scope.redirectProfil = ($event) => {
            var link = $event.target;
            var id = link.getAttribute('userid');
            window.location.href = "/profil?id="+id;
        }

    }
})

function _idIsInListOfObj(list,e){
    for (var i = 0; i<list.length;i++){
        if (list[i]._id == e) {
            return true
        }
    }
    return false;
}
