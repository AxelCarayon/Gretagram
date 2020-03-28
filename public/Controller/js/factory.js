function showCurrentPublications($scope) {
    // TODO: afficher les publications qui se trouvent dans la zone géographique actuellement sélectionnée
}

var app = angular.module('app', []);

app.factory('dataFactory', function($http, $q ) {

    var factory = {
        publications: false,
        getPublications: function() {
            var deferred = $q.defer();
            $http.get('View/data/test.json')
                .then(function(data, status) {
                    factory.publications = data;
                    deferred.resolve(factory.publications);

                }).catch(function(data, status) {
                    console.log("error" + status);
                    deferred.reject("Impossible de récupérer les trucs");

                });
            return deferred.promise;
        }
    };
    return factory;
});

app.controller("ctrl", function($scope, dataFactory) {

    $scope.loading = true;

    $scope.data = dataFactory.getPublications().then(function(data) {
        $scope.data = data.data;
        // console.log(data);
        $scope.proches = $scope.data.proches;
        $scope.abos = $scope.data.abos;
        $scope.publications = $scope.data.trend;


        $scope.abonnements = true; // Je passe uniquement les trends en true pour qu'il n'y ait que ça d'afficher
        $scope.trend = true;
        $scope.proche = false;
        $scope.loading = false;

    }, function(msg) {
        console.log(msg);

    });


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



});

app.factory('profilFactory', function($http, $q) {

    var factory = {
        publications: false,
        getPublications: function() {
            var deferred = $q.defer();
            $http.get('View/data/testProfil.json')
                .then(function(data, status) {
                    factory.publications = data;
                    deferred.resolve(factory.publications);
                }).catch(function(data, status) {
                    console.log("error" + status);
                    deferred.reject("Impossible de récupérer les trucs");

                });
            return deferred.promise;
        }
    };
    return factory;
});


app.controller("profilCtrl", function($scope, $http, dataFactory, profilFactory) {

    $scope.loading = true;

    $scope.like = function() {
        var pub = ($(this)[0]).pub;
        console.log(pub);
        // Requete AJAX de quand on like un comment 

    };

    $scope.changeTheme = function() {
        $('*').toggleClass('sombre');
        $('*').toggleClass('clair');
    };

    $scope.pubs = profilFactory.getPublications().then(function(publications) {
        $scope.pubs = publications.data;
        $scope.profilPubs = true;
        $scope.profilStats = false;
        $scope.loading = false;
        console.log($scope.pubs);

    }, function(msg) {
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


});