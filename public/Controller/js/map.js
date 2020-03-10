// ===============================================FONCTIONS============================================================

function getFeaturesInView(map) { // Fonction pour récupérer les markers qui sont présents sur la map actuelle
    var features = [];
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            if (map.getBounds().contains(layer.getLatLng())) {
                features.push(layer.options.msg);
            }
        }
    });
    return features;
}

function loadData($scope) { // Fonction de traitement des données 
        $.getJSON('View/data/testAbonnements.json', (data) => { // Chargement des données test
            $scope.abos = data; // Je les mets dans container 
        });
        $.getJSON('View/data/testProche.json', (data) => { // Chargement des données test
            $scope.proches = data;
        });
        $.getJSON('View/data/testTrend.json', (data) => { // Chargement des données test
            $scope.publications = data; // Je les mets dans container 
        });

        
}

function showCurrentPublications($scope){
    // TODO: afficher les publications qui se trouvent dans la zone géographique actuellement sélectionnée
}





// ===============================================PROGRAMME PRINCIPAL============================================================

var app = angular.module('app', []);

app.controller("ctrl", ($scope) => {
    
    loadData($scope); // Appel de la fonction de traitement des données 


    $scope.aboFunction = () => {
        $scope.abonnements = true; // Quand on appuie sur le bouton abonnement le container des abonnements s'affichent les autres se cachent
        $scope.trend = false;
        $scope.proche = false;
        $(".map-container").animate({ // La map reste se cache 
            right: '-2000px'
        });

    }
    $scope.trendFunction = () => { // Quand on appuie sur le bouton trend le container des trend s'affichent les autres se cachent
        console.log("hello")
        $scope.abonnements = false;
        $scope.trend = true;
        $scope.proche = false;
        $(".map-container").animate({ // La map reste se cache 
            right: '-2000px'
        });

    }
    $scope.procheFunction = () => { // Quand on appuie sur le bouton proche le container des proche s'affichent les autres se cachent
        $scope.abonnements = false;
        $scope.trend = false;
        $scope.proche = true;
        $(".map-container").animate({ // La map s'affiche
            right: '0%'
        });
    }

    $scope.abonnements = true; // Je passe uniquement les trends en true pour qu'il n'y ait que ça d'afficher
    $scope.trend = false;
    $scope.proche = false;

    

    if (navigator.geolocation) { // Si l'utilisateur accepte de données ses données de navigation 
        navigator.geolocation.getCurrentPosition(function(position) { // Je créé une fonction pour récupérer les données de géolocalisation
            var latitude = position.coords.latitude; // Je récupère la latitude
            var longitude = position.coords.longitude; // Je récupère la longitude

            var sombre = true; // TODO: Cette variable sera une variable globale décidée par l'utilisateur

            var lightmap = "https://api.mapbox.com/styles/v1/cgobbo/ck6qkg6du0sc61ipgfmunfy2a/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2dvYmJvIiwiYSI6ImNrNmh3cnN4ZTA3aXozbWxvaGM3dGJzdWIifQ.xkLbDd0BUUKWQbAyUVrRew";
            var darkmap = 'https://api.mapbox.com/styles/v1/cgobbo/ck6qiop5d3l131iofj94j7jpl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2dvYmJvIiwiYSI6ImNrNmh3cnN4ZTA3aXozbWxvaGM3dGJzdWIifQ.xkLbDd0BUUKWQbAyUVrRew';
            // Les 2 maps pour switcher entre les 2 thèmes

            var mymap = L.map('macarte').setView([latitude, longitude], 10); // J'instancie la map avec comme position de base la position de l'utilisateur
            
            var markers = L.markerClusterGroup(); // Création du cluster group pour pouvoir afficher les markers meme si ils sont au meme enndroit 
            
            customMarker = L.Marker.extend({ // Je créé les markers personnalisés
                options: {
                    msg: 'Custom data!'
                }
            });

            if (sombre) { // Par rapport à la variable de l'utilisateur on met la map en light ou en dark
                L.tileLayer(darkmap, {
                    maxZoom: 18
                }).addTo(mymap);
            } else {
                L.tileLayer(lightmap, {
                    maxZoom: 18
                }).addTo(mymap);
            }


            var circle = L.circle([latitude, longitude], { // Ajout d'un cercle à l'emplacement de l'utilisateur 
                color: 'rgb(199, 201, 249)',
                fillColor: 'rgb(20, 122, 186)',
                fillOpacity: 0.8,
                radius: 50
            })
            circle.bindPopup("Vous êtes ici.").openPopup();
            circle.addTo(mymap);

            $('.change-theme').click(() => { // On change la map de couleur quand l'utilisateur switch de theme 
                if (sombre) {
                    L.tileLayer(lightmap, {
                        maxZoom: 18
                    }).addTo(mymap);
                    sombre = !sombre;
                } else {
                    L.tileLayer(darkmap, {
                        maxZoom: 18
                    }).addTo(mymap);
                    sombre = !sombre;
                }

            });


            $('.btn-publier').click((e) => { // Event quand on clique sur le bouton publier 
                e.preventDefault();
                $('.hashtest').html("");
                var message = $('.text-create-publication').text(); // On récupère le commentaire que la personne veut poster
                $('.text-create-publication').html("");

                if (message != "") { // Si le message n'est pas vide on le traire 
                    // TODO:  traitement de la publication (ajout dans la bdd etc), création du marker sur la map


                    var myMarker = new customMarker([latitude, longitude], { // Marker test 
                        username: 'Maurice Lestin',
                        msg: message
                    });
                    myMarker.bindPopup("<img style='height:50px;'  src='ressources/avatar.svg' alt=''><br><p style='text-align:center;'>" + message + "</p>").openPopup();
                    
                    markers.addLayer(myMarker);
        
                    mymap.addLayer(markers);

                    $scope.proches.unshift({ // C'est pour faire des tests ça 
                        "nom": "test",
                        "msg": message,
                        "nblikes": 126,
                        "date": new Date()
                    })
                };


            });

            mymap.on('dragend',()=>{
                console.log(getFeaturesInView(mymap));
                showCurrentPublications($scope); // Appel de la fonction pour afficher les publications actuellements sur la carte
            })
            mymap.on('zoomend',()=>{
                console.log(getFeaturesInView(mymap));
                showCurrentPublications($scope); // Appel de la fonction pour afficher les publications actuellements sur la carte
            })
            




        }, function error(msg) { // Si l'utilisateur n'accepte pas de confier ses données de geolocalisation on le renvoie vers une page d'erreur  
            window.location.href = "error.html";

        }, {
            maximumAge: 600000,
            timeout: 5000,
            enableHighAccuracy: true
        });

    } else {
        window.location.href = "error.html"; // Si l'utilisateur n'accepte pas de confier ses données de geolocalisation on le renvoie vers une page d'erreur 
    }



})
