var user = "lestin";

function showCurrentPublications($scope) {
    // TODO: afficher les publications qui se trouvent dans la zone géographique actuellement sélectionnée
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

app.controller("ctrl", function ($scope, dataFactory,serviceIsConnect) {
    $scope.loading = true;

    if (!serviceIsConnect){
        window.location.href = "/login";
    }else {


        $scope.data = dataFactory.getPublications().then(function (data) {
            $scope.data = data.data;
            // console.log(data);
            $scope.proches = $scope.data.proches;
            $scope.abos = $scope.data.abos;
            $scope.publications = $scope.data.trend;


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

            $scope[publication_theme][$index].comments.push({"nom": user, "comment": comment, "date": new Date()});

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
            $scope.abonnements = true; // Quand on appuie sur le bouton abonnement le container des abonnements s'affichent les autres se cachent
            $scope.trend = false;
            $scope.proche = false;
            $(".map-container").animate({ // La map reste se cache
                right: '-2000px'
            });

        };
        $scope.trendFunction = () => { // Quand on appuie sur le bouton trend le container des trend s'affichent les autres se cachent
            $scope.abonnements = false;
            $scope.trend = true;
            $scope.proche = false;
            $(".map-container").animate({ // La map reste se cache
                right: '-2000px'
            });

        };
        $scope.procheFunction = () => { // Quand on appuie sur le bouton proche le container des proche s'affichent les autres se cachent
            $scope.abonnements = false;
            $scope.trend = false;
            $scope.proche = true;
            $(".map-container").animate({ // La map s'affiche
                right: '0%'
            });
        };

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

    $scope.pubs = profilFactory.getPublications().then(function (publications) {
        $scope.pubs = publications.data;
        $scope.profilPubs = true;
        $scope.profilStats = false;
        $scope.loading = false;
        console.log($scope.pubs);

        for (const index in ($scope.pubs)) {
            var t = $scope.pubs[index].publicationID + "liked";
            if ($scope.pubs[index].likes.includes(user)) {
                $scope[t] = true;
            } 
         }

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

    $scope.sendComment = ($event) => {
        var publication_id = $($event.target).attr("publication-id"); // L'ID de la publication
        var comment = $($event.target).prev().val(); //Le message du commentaire
        var user_ID; // A récupérer via les cookies 

        console.log(`commentaire ${comment} ajouté à la publication ${publication_id}`);

        //TODO: Requete AJAX pour ajouter un commentaire à la publication   

        $($event.target).prev().val("")
        $($event.target).attr('disabled', true);
    }

    $scope.like = ($event, $index) => {
        $event.preventDefault();
        var publication_id = $($event.target).attr("publication-id"); // L'ID de la publication
        var t = publication_id+'liked';    

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
            var index =  $scope[publication_theme][$index].likes.indexOf(user);
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