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

                // coeur rouge
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
            console.log('cc',$scope.x.commentaires)
            $scope.modal = $scope.x.commentaires;
            serviceAddIdentity.pubs($scope.modal);
        };


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
