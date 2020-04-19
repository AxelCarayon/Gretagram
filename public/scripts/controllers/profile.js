angular.module('app').controller("testCtrl", function ($location,$scope,serviceUserAjax,serviceSession,serviceIsConnect,servicePublicationAjax) {
    if (!serviceIsConnect){
        window.location.href = "/";
    }else {


        console.log('URL : ', $location.search);
        var token = serviceSession.getValue('token');
        var id = serviceSession.getValue('id');

        // infos utilisateur
        serviceUserAjax.getUser({'id':id}).
        then(function (user) {
            console.log(user);
            $scope.nbPublications = user.publications.length;
            $scope.prenomEtNom = user.prenom +' '+user.nom;
            $scope.abonnes = user.abonnes;
            $scope.abonnements = user.abonnements;

        }, function (msg) {
            console.log('erreur serveur recupération user : '+msg);
        });

        //afficher publication
        $scope.pubFunction = function(){
            $scope.profilPubs = true;
            $scope.profilStats = false;
            $('.btnPub').addClass('active');
            $('.btnStat').removeClass('active');

            console.log('actionpub');

            servicePublicationAjax.getPubUser({'id':id}).
            then(function (publications) {
                console.log('publications : ',publications);
                $scope.pubs = publications;


            }, function (msg) {
                console.log('erreur serveur recupération user : '+msg);
            });

        };


      /* */
    }

    });
app.controller("profilCtrl2", function ($scope, $http, dataFactory, profilFactory) {
    if (!serviceIsConnect){
        window.location.href = "/";
    }else {
        console.log("testCtrl");
        var token = serviceSession.getValue('token');
        var id = serviceSession.getValue('id');
        console.log("token", token);
        console.log("id", id);


        $scope.loading = true;

        $scope.changeTheme = function () {
            $('*').toggleClass('sombre');
            $('*').toggleClass('clair');
        };

        $scope.user = profilFactory.getPublications().then(function (publications) {
            $scope.user = publications.data;
            $scope.profilPubs = true;
            $scope.profilStats = false;
            $scope.loading = false;
            $scope.pubs = $scope.user.publications;
            $scope.abonnes = $scope.user.abonnes
            $scope.abonnements = $scope.user.abonnements

            for (const index in ($scope.pubs)) {
                var t = $scope.pubs[index].publicationID + "liked";
                if ($scope.pubs[index].likes.includes(user)) {
                    $scope[t] = true;
                }
            }

            console.log($scope.pubs);

            //STATS ---------------------------------------------------------------------------------------------------------------------------------------------

            $scope.nbPublications = $scope.pubs.length; //Nb total de publications
            var likes = 0;
            var comments = 0;
            var pubLaPlusLike;
            var pubLaPlusComment;
            var maxLike = 0;
            var maxComment = 0;
            var list_likes = [];
            var date = {};
            var labelsTab = [];
            var datasetLike = [];
            var datasetComment = [];

            for (const i in Object.entries($scope.pubs)) {

                likes = likes + $scope.pubs[i].likes.length; //Nb total de likes
                comments = comments + $scope.pubs[i].comments.length; //Nb total de commentaires
                list_likes = list_likes.concat($scope.pubs[i].likes);
                if (maxLike < $scope.pubs[i].likes.length) {
                    pubLaPlusLike = $scope.pubs[i]
                    maxLike = $scope.pubs[i].likes.length;
                }
                if (maxComment < $scope.pubs[i].comments.length) {
                    pubLaPlusComment = $scope.pubs[i]
                    maxComment = $scope.pubs[i].comments.length;
                }

                if (i < 50) {
                    date[i] = {"likes": $scope.pubs[i].likes.length, "comments": $scope.pubs[i].comments.length}
                    labelsTab.unshift($scope.pubs[i].date)
                    datasetLike.unshift($scope.pubs[i].likes.length)
                    datasetComment.unshift($scope.pubs[i].comments.length)
                }


            }

            $scope.showModal = ($event, $index) => {
                $scope.modal = $scope.pubs[$index].comments;

            }

            $scope.nbLike = likes;
            $scope.nbComment = comments;
            $scope.moyLikeParPub = likes / $scope.nbPublications;
            $scope.moyCommentParPub = comments / $scope.nbPublications;
            $scope.nbDifLikes = new Set(list_likes).size;
            $scope.laPlusLike = [pubLaPlusLike]
            $scope.laPlusComment = [pubLaPlusComment]


            $scope.redirectName = ($event) => redirectName($event)

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
                    responsive: true
                }
            });


        }, function (msg) {
            alert(msg);

        });

        $scope.pubFunction = () => {
            $scope.profilPubs = true;
            $scope.profilStats = false;
            $('.btnPub').addClass('active');
            $('.btnStat').removeClass('active');
        };

        $scope.statFunction = () => {
            console.log("yep");

            $scope.profilPubs = false;
            $scope.profilStats = true;
            $('.btnPub').removeClass('active');
            $('.btnStat').addClass('active');
        };


        $scope.verifComment = ($event) => {

            if ($($event.target).val()) {
                $($event.target).next().attr('disabled', false);
            } else {
                $($event.target).next().attr('disabled', true);
            }
        }

        $scope.sendComment = ($event, $index) => {
            var publication_id = $($event.target).attr("publication-id"); // L'ID de la publication
            var comment = $($event.target).prev().val(); //Le message du commentaire
            var user_ID; // A récupérer via les cookies

            //TODO: Requete AJAX pour ajouter un commentaire à la publication

            var publication_theme = $($event.target).parent().parent().parent().attr('publication-theme');

            $scope[publication_theme][$index].comments.push({
                "nom": user,
                "comment": comment,
                "date": new Date()
            });

            $($event.target).prev().val("")
            $($event.target).attr('disabled', true);
        }

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
            if (publication.likes.includes(user)) {
                var index = $scope[publication_theme][$index].likes.indexOf(user);
                if (index > -1) {
                    $scope[publication_theme][$index].likes.splice(index, 1);
                }

                $scope[t] = false
            } else {
                $scope[publication_theme][$index].likes.push(user);
                $scope[t] = true
            }

            //TODO: Requet Ajax pour likes

        }
    }



});
