var user = "lestin";

function showCurrentPublications($scope) {
    // TODO: afficher les publications qui se trouvent dans la zone géographique actuellement sélectionnée
}

function redirectName($event){
    var link = $event.target;
    var id = link.getAttribute('userid');
    console.log("redirection to " + link.getAttribute('userid') + " page");
}

var app = angular.module('app', []);

app.factory('dataFactory', function ($http, $q) {

    var factory = {
        publications: false,
        getPublications: function () {
            var deferred = $q.defer();
            $http.get('View/data/test.json')
                .then(function (data, status) {
                    factory.publications = data;
                    deferred.resolve(factory.publications);

                }).catch(function (data, status) {
                    console.log("error" + status);
                    deferred.reject("Impossible de récupérer les trucs");

                });
            return deferred.promise;
        }
    };
    return factory;
});

app.controller("ctrl", function ($scope, dataFactory,serviceIsConnect,serviceSession) {
    $scope.loading = true;


    if (!serviceIsConnect){
        window.location.href = "/login";
        
    }else {

        $scope.idUserConnect =  serviceSession.getValue('id');

        $scope.data = dataFactory.getPublications().then(function (data) {
            $scope.data = data.data;
            // console.log(data);
            $scope.proches = $scope.data.proches;
            $scope.abos = $scope.data.abos;
            $scope.publications = $scope.data.trend;

        $scope.redirectName = ($event) =>  redirectName($event)

            $scope.abonnements = true; // Je passe uniquement les trends en true pour qu'il n'y ait que ça d'afficher
            $scope.trend = true;
            $scope.proche = false;
            $scope.loading = false;


            for (const index in Object.entries($scope.publications)) {
                var t = $scope.publications[index].publicationID + "liked";
                if ($scope.publications[index].likes.includes(user)) {
                    $scope[t] = true;
                }
            }
            for (const index in Object.entries($scope.abos)) {
                var t = $scope.abos[index].publicationID + "liked";
                if ($scope.abos[index].likes.includes(user)) {
                    $scope[t] = true;
                }
            }
            for (const index in Object.entries($scope.proches)) {
                var t = $scope.proches[index].publicationID + "liked";
                if ($scope.proches[index].likes.includes(user)) {
                    $scope[t] = true;
                }
            }


        }, function (msg) {
            console.log(msg);

        });

        $scope.showModal = ($event,$index) =>{
            
            var publication_theme;
            if ($($event.target).is("div")) {
                publication_theme = $($event.target).parent().parent().parent().attr('publication-theme');
            } else if ($($event.target).is("svg")) {
                publication_theme = $($event.target).parent().parent().parent().parent().parent().attr('publication-theme');
            } else if ($($event.target).is("path")) {
                publication_theme = $($event.target).parent().parent().parent().parent().parent().parent().attr('publication-theme');
            }
            
            $scope.modal = $scope[publication_theme][$index].commentaires
            
        }

        $scope.verifComment = ($event, $index) => {

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

            $scope[publication_theme][$index].commentaires.push({"nom": user, "comment": comment, "date": new Date()});

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


        $scope.aboFunction = () => {
            $scope.abonnements = true; // Quand on appuie sur le bouton abonnement le container des abonnements s'affiche les autres se cachent
            $scope.trend = false;
            $scope.proche = false;
            $(".map-container").animate({ // La map reste se cache
                right: '-2000px'
            });

        };
        $scope.trendFunction = () => { // Quand on appuie sur le bouton trend le container des trend s'affiche les autres se cachent
            $scope.abonnements = false;
            $scope.trend = true;
            $scope.proche = false;
            $(".map-container").animate({ // La map reste se cache
                right: '-2000px'
            });

        };
        $scope.procheFunction = () => { // Quand on appuie sur le bouton proche le container des proches s'affiche les autres se cachent
            $scope.abonnements = false;
            $scope.trend = false;
            $scope.proche = true;
            $(".map-container").animate({ // La map s'affiche
                right: '0%'
            });
        };

        $scope.redirectProfil = ($event) => {
            var link = $event.target;
            var id = link.getAttribute('userid');
            window.location.href = "/profil?id="+id;
        }

    }

});

app.factory('profilFactory', function ($http, $q) {

    var factory = {
        publications: false,
        getPublications: function () {
            var deferred = $q.defer();
            $http.get('View/data/testProfil.json')
                .then(function (data, status) {
                    factory.publications = data;
                    deferred.resolve(factory.publications);
                }).catch(function (data, status) {
                    console.log("error" + status);
                    deferred.reject("Impossible de récupérer les trucs");

                });
            return deferred.promise;
        }
    };
    return factory;
});



app.controller("profilCtrl", function ($scope, $http, dataFactory, profilFactory) {

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
    console.log($scope.user);
        console.log($scope.pubs);

        //STATS ---------------------------------------------------------------------------------------------------------------------------------------------

        $scope.nbPublications = $scope.pubs.length; //Nb total de publications 
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
        
        $scope.showModal = ($event,$index) => {          
            $scope.modal = $scope.pubs[$index].commentaires;
            
        }

        $scope.nbLike = likes;
        $scope.nbComment = commentaires;
        $scope.moyLikeParPub = likes / $scope.nbPublications;
        $scope.moyCommentParPub = commentaires / $scope.nbPublications;
        $scope.nbDifLikes = new Set(list_likes).size;
        $scope.laPlusLike = [pubLaPlusLike]
        $scope.laPlusComment = [pubLaPlusComment]


        $scope.redirectName = ($event) =>  redirectName($event)

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

        $scope[publication_theme][$index].commentaires.push({
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




});
