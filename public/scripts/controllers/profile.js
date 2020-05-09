function _idIsInListOfObj(list,e){
    for (var i = 0; i<list.length;i++){
        //console.log(likes[i]._id);
        if (list[i]._id == e) {
            return true
        }
    }
    return false;
}
function idIsInListOfObj(list,e){
    for (var i = 0; i<list.length;i++){
        //console.log(likes[i]._id);
        if (list[i].id == e) {
            return true
        }
    }
    return false;
}
function getIdUrl (){
    var param = window.location.search.slice(1,window.location.search.length);
    var val = param.split('=');

    if (val[0]=='id' && val[1]!='' && val[1]!='null' && !val[1].includes('&')){
        return val[1]
    }
    return -1;
}
function listToObjList (list){
    for (var i = 0; list.length>i;i++){
        list[i]={id:list[i]};
    }
    return list;
}

angular.module('app').controller("testCtrl", function ($location,$scope,serviceUserAjax,serviceSession,serviceIsConnect,servicePublicationAjax,serviceAddIdentity,serviceTheme) {
    if (!serviceIsConnect){
        window.location.href = "/login";
    }else {
        $scope.btnLoadMore = "Charger plus..."
        $scope.totalPubs = 5;
        var token = serviceSession.getValue('token');
        var idUser = serviceSession.getValue('id');
        var idProfil;
        var ppDefault = 'View/ressources/avatar.svg';
        serviceTheme.getTheme();



        $scope.loadMorePubs = () =>{
           
            if ($scope.totalPubs >= $scope.pubs.length - 5   ) {
                $scope.btnLoadMore = "Pas de publications supplémentaires"
            } 
            if ($scope.totalPubs >= $scope.pubs.length) {
                window.scrollTo(0,0)
            }
            else{
                $scope.totalPubs = $scope.totalPubs + 5
            }
            
        }

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
                        createAlert('ERROR',rep,"Impossible de mettre à jours les abonnés, rechargé la page pour résoudre le problème.");
                    });
                },function (res) {
                    createAlert('ERROR',rep,"Impossible de s'abonner à cet utilisateur.");
                }
            );
        };
        // file de l'user
        var feel = function (pp) {
                $scope.profilPubs = true;
                $scope.profilStats = false;
                $('.btnPub').addClass('active');
                $('.btnStat').removeClass('active');

                //Récupération des publications
                servicePublicationAjax.getPubUser({'id':idProfil}).
                then(function (publications) {
                    $scope.pubs = serviceAddIdentity.pubs(publications);

                    // console.log('publications : ',publications);

                    for (const index in ($scope.pubs)) {
                        var t ='liked' + $scope.pubs[index]._id  ;
                        var likes = $scope.pubs[index].likes;
                        if (_idIsInListOfObj(likes,idUser)){
                            $scope[t] = true;
                        }
                    }
                    serviceTheme.getTheme();
                }, function (msg) {
                    createAlert('ERROR',msg,"Impossible de récupérer les publications.");
                });
        };

        //Statistique user
        var stat = function () {
            $scope.profilPubs = false;
            $scope.profilStats = true;
            $('.btnPub').removeClass('active');
            $('.btnStat').addClass('active');
            serviceTheme.getTheme();

            var likes = 0;
            var commentaires = 0;
            var pubLaPlusLike;
            var pubLaPlusComment;
            var maxLike = 0;
            var maxComment = 0;
            var list_likes = [];
            var date = {};
            var labelsTab = [];
            var datasetLike = [];
            var datasetComment = [];
            $scope.paysStats = {
                
            }

            

            for (const i in Object.entries($scope.pubs)) {
                likes = likes + $scope.pubs[i].likes.length; //Nb total de likes
                commentaires = commentaires + $scope.pubs[i].commentaires.length; //Nb total de commentaires
                list_likes = list_likes.concat($scope.pubs[i].likes);
                if (maxLike < $scope.pubs[i].likes.length) {
                    pubLaPlusLike = $scope.pubs[i]
                    maxLike = $scope.pubs[i].likes.length;
                }
                if (maxComment < $scope.pubs[i].commentaires.length) {
                    pubLaPlusComment = $scope.pubs[i]
                    maxComment = $scope.pubs[i].commentaires.length;
                }

                if (i < 50) {
                    date[i] = { "likes" : $scope.pubs[i].likes.length, "comments" : $scope.pubs[i].commentaires.length }
                    labelsTab.unshift($scope.pubs[i].date)
                    datasetLike.unshift($scope.pubs[i].likes.length)
                    datasetComment.unshift($scope.pubs[i].commentaires.length)
                }
            }

            $scope.nbLike = likes;
            $scope.nbComment = commentaires;
            $scope.moyLikeParPub = Math.round(((likes / $scope.nbPublications) + Number.EPSILON) * 100) / 100 
            $scope.moyCommentParPub = Math.round(((commentaires / $scope.nbPublications) + Number.EPSILON) * 100) / 100 
            $scope.nbDifLikes = new Set(list_likes).size;
            $scope.laPlusLike = [pubLaPlusLike]
            $scope.laPlusComment = [pubLaPlusComment]

            var ctx = document.getElementById('myChart').getContext('2d');
            var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
            gradientFill.addColorStop(0, "rgba(133, 250, 176, 0.7)");
            gradientFill.addColorStop(1, "rgba(143, 211, 244, 0.7)");

            var gradientFill2 = ctx.createLinearGradient(500, 0, 100, 0);
            gradientFill2.addColorStop(0, "rgba(255, 236, 210, 0.7)");
            gradientFill2.addColorStop(1, "rgba(252, 182, 159, 0.7)");
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labelsTab,
                    datasets: [{
                        label: 'likes',
                        data: datasetLike,
                        backgroundColor: gradientFill,
                        borderColor: "rgba(252, 223, 87, 1)",
                        borderWidth: 5,

                    },
                        {
                            label: 'commentaires',
                            data: datasetComment,
                            backgroundColor: gradientFill2,
                            borderColor: "rgba(252, 182, 159, 1)",
                            borderWidth: 5
                        }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    responsive:true
                }
            });
        }

        if (getIdUrl()!=-1){
            idProfil = getIdUrl();
        }else {
            idProfil = idUser;
        }

        //Test si userprofil = user
        let valTrash = 'trashPub'+idProfil;
        if (idProfil == idUser){
            $('.follow').addClass('d-none');
            $scope.statFunction = stat;
            $scope.pubFunction = feel;
            $scope[valTrash] = true ;
        }else {
            $('.btnStat').addClass('d-none');
            $scope.followAct = follow;
            $scope[valTrash] = false ;
        }

        serviceUserAjax.getUser({'id':idUser}).then(
            function (user){
                $scope.nameConnected = user.prenom +' '+user.nom;
            }
        )

        // infos membre profil
        serviceUserAjax.getUser({'id':idProfil}).
        then(function (user) {
            // console.log('user',user);
            $scope.nbPublications = user.publications.length;
            $scope.prenomEtNom = user.prenom +' '+user.nom;
            $scope.abonnes = listToObjList(user.abonnes);
            $scope.abonnements = listToObjList(user.abonnements);

            //ajout des nom des abonnements
            serviceAddIdentity.abo($scope.abonnements);
            //ajout des nom des abonnés
            serviceAddIdentity.abo($scope.abonnes);

            //photo de profil
            if (user.pp =='' || user.pp == null){
                $scope.ppProfil = ppDefault;
            }else $scope.ppProfil = user.pp;

            //Bouton s'abonner
            if (idIsInListOfObj(user.abonnes,idUser)){
                $('.follow').addClass("followed");
                $('.follow').text("Abonné");

            }else {
                $('.follow').hasClass("followed");
                $('.follow').removeClass("followed");
                $('.follow').text("S'abonner");
            }

            feel(user.pp);

        }, function (msg) {
            createAlert('ERROR',msg,"Impossible de récupérer les informations de l'utilisateur.");
        });

        $scope.changeTheme = function () {serviceTheme.setTheme();};

        $scope.redirectProfil = ($event) => {
            var link = $event.target;
            var id = link.getAttribute('userid');
            window.location.href = "/profil?id="+id;
        }

        $scope.showModal = ($event) => {
            let publication_id = $event.target.getAttribute("publication-id")
            let pub = getPublicationWithId($scope,publication_id);
            $scope.modal = pub.commentaires;
            serviceAddIdentity.pubs($scope.modal);
        };
    }
    });

