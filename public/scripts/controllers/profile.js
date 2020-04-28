function idIsInListOfObj(list,e){
    for (var i = 0; i<list.length;i++){
        //console.log(likes[i]._id);
        if (list[i]._id == e) {
            return true
        }
    }
    return false;
}

function getIdUrl (){
    var param = window.location.search.slice(1,window.location.search.length);
    var val = param.split('=');

    if (val[0]=='id' && val[1]!=''&& !val[1].includes('&')){
        return val[1]
    }
    return -1;
}




angular.module('app').controller("testCtrl", function ($location,$scope,serviceUserAjax,serviceSession,serviceIsConnect,servicePublicationAjax) {
    if (!serviceIsConnect){
        window.location.href = "/login";
    }else {

        var token = serviceSession.getValue('token');
        var idUser = serviceSession.getValue('id');
        var idProfil;
        var ppDefault = 'View/ressources/profile.svg.png';

        //follow-unfollow
        var follow = function () {
            console.log('followAct');
            serviceUserAjax.setFollow(token,idProfil).then(
                function (res) {
                    if (res.status == "abonnement supprimé"){
                        $('.follow').hasClass("followed");
                        $('.follow').removeClass("followed");
                        $('.follow').text("S'abonner");
                    } else {
                        $('.follow').addClass("followed");
                        $('.follow').text("Abonné");
                    }
                    //maj abo
                    serviceUserAjax.getUser({'id':idProfil}).
                    then(function (user) {
                        $scope.abonnes = user.abonnes;
                    },function (rep) {
                        //TODO Alert
                        console.log('error',rep);
                    });
                },function (res) {
                    console.log(res);
                }
            );
        };



        if (getIdUrl()!=-1){
            idProfil = getIdUrl();
        }else {
            idProfil = idUser;
        }

        if (idProfil == idUser){
            $('.follow').addClass('d-none');
        }


        $scope.idUserConnect = idUser;

        // infos membre profil
        serviceUserAjax.getUser({'id':idProfil}).
        then(function (user) {
            console.log(user);
            $scope.nbPublications = user.publications.length;
            $scope.prenomEtNom = user.prenom +' '+user.nom;
            $scope.abonnes = user.abonnes;
            $scope.abonnements = user.abonnements;

            if (user.pp ='' || user.pp == null){
                $scope.ppProfil = ppDefault;
            }else $scope.ppProfil = user.pp;

            console.log('abonné :',user.abonnes.includes(idUser));

            if (user.abonnes.includes(idUser)){
                $('.follow').addClass("followed");
                $('.follow').text("Abonné");

            }else {
                $('.follow').hasClass("followed");
                $('.follow').removeClass("followed");
                $('.follow').text("S'abonner");

            }

            $scope.followAct = follow;



        }, function (msg) {
            console.log('erreur serveur recupération user : '+msg);
        });

        //afficher publication
        $scope.pubFunction = function(){


            $scope.profilPubs = true;
            $scope.profilStats = false;
            $('.btnPub').addClass('active');
            $('.btnStat').removeClass('active');


            //Récupération des publications
            servicePublicationAjax.getPubUser({'id':idProfil}).
            then(function (publications) {
                console.log('publications : ',publications);
                $scope.pubs = publications;

                console.log($scope.pubs);

                //TODO : coeur rouge
                for (const index in ($scope.pubs)) {
                    var t =$scope.pubs[index]._id + "liked";
                   // console.log(t);
                    var likes = $scope.pubs[index].likes;
                    if (idIsInListOfObj(likes,idUser)){
                        $scope[t] = true;
                        //console.log('ici');
                    }
                }


            }, function (msg) {
                console.log('erreur serveur recupération user : '+msg);
            });

        };

        $scope.changeTheme = function () {
            $('*').toggleClass('sombre');
            $('*').toggleClass('clair');
        };

        $scope.redirectProfil = ($event) => {
            var link = $event.target;
            var id = link.getAttribute('userid');
            window.location.href = "/profil?id="+id;
        }

    }

    });