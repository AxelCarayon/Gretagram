var app = angular.module('app', []);

app.controller("ctrl2", function ($scope,serviceIsConnect,servicePublicationAjax,serviceSession,serviceUserAjax) {
    $scope.loading = true;
    if (!serviceIsConnect) {
        window.location.href = "/login";

    } else {
        var token = serviceSession.getValue('token');
        var sizeTrend = 100;
        var idUser = serviceSession.getValue('id');
        var mymap = L.map('macarte');

        var getAbo = function (){
            $scope.proche = false;
            $scope.loading = false;
            $(".map-container").animate({ // La map reste se cache
                right: '-2000px'
            });

            servicePublicationAjax.getAbonnements(token).then(
                function (pubs) {
                    $scope.pubs = addIdenty(pubs);
                    coeurRouge();

                },function (res) {
                    createAlert('ERROR','Problème chargement publications',res);
                }
            )


        }
        var getTrend = function (){
            $scope.proche = false;
            $scope.loading = false;
            $(".map-container").animate({ // La map reste se cache
                right: '-2000px'
            });

            servicePublicationAjax.getTrend(sizeTrend).then(
                function (rep) {
                    $scope.pubs = addIdenty(rep);
                    coeurRouge();

                },function (res) {
                    createAlert('ERROR','Problème chargement publications',res);
                }
            )
        }

        var getProche = function (){
            $scope.proche = true;
            $scope.loading = false;
            $(".map-container").animate({ // La map s'affiche
                right: '0%'
            });
            //theme carte
            var sombre = true;
            themeMap(sombre,mymap);
            $('.change-theme').click(() => { // On change la map de couleur quand l'utilisateur switch de theme
                sombre = !sombre;
                themeMap(sombre,mymap);
            });

            navigator.geolocation.getCurrentPosition(function(position) { // Je créé une fonction pour récupérer les données de géolocalisation
                var mylatitude = position.coords.latitude;
                var mylongitude = position.coords.longitude;

                mymap.setView([mylatitude, mylongitude], 11);

                //------TODO ça marche pas
                var circle = L.circle([mylatitude, mylongitude], { // Ajout d'un cercle à l'emplacement de l'utilisateur
                    color: 'rgb(199, 201, 249)',
                    fillColor: 'rgb(20, 122, 186)',
                    fillOpacity: 0.8,
                    radius: 200
                })
                console.log(circle);
                
                circle.bindPopup("Vous êtes ici.").openPopup();
                circle.addTo(mymap);
                // ------

                console.log('myPosition',mylatitude,mylongitude);
                console.log('getBounds',mymap.getBounds());

                //init les pubs avec ma position
                pubsCarte(genarateData(mymap.getBounds()));

                mymap.on('zoomend', function() {
                    console.log('zoomend');
                    pubsCarte(genarateData(mymap.getBounds()));
                });

                mymap.on('dragend', function() {
                    console.log('dragend');
                    pubsCarte(genarateData(mymap.getBounds()));
                });

            },function () {
                createAlert('ERROR','Localisation','La géolocalisation est obligatoire pour utiliser nos services.');
            }, {
                maximumAge: 600000,
                timeout: 5000,
                enableHighAccuracy: true
            })
        }

        function addIdenty (list){
            var mem = [];
            for (var i = 0; i<list.length;i++){
                var id = list[i].userID;
                if (!mem.includes( id)){
                    mem.push(id);
                    serviceUserAjax.getUser({id:id}).then(function (user) {
                            var name = user.prenom +' '+user.nom;
                            list = addNameinListOfObj(list,user.id,name);
                            list = addPPinListOfObj(list,user.id,user.pp);
                        },function (rep) {
                            createAlert('ERROR','Problème récupération des données utilisateur',res);

                        }
                    );
                }
            }
            return list;
        }

        function coeurRouge(){
            for (const index in ($scope.pubs)) {
                var t ='liked' + $scope.pubs[index]._id  ;
                var likes = $scope.pubs[index].likes;
                if (_idIsInListOfObj(likes,idUser)){
                    $scope[t] = true;
                }
            }
        }

        function pubsCarte(data) {
            console.log('pubsCarte',data);
            servicePublicationAjax.getProche(data).then(
                function (res) {
                    $scope.pubs = addIdenty(res);
                    console.log('pubsCarte res', res);
                    coeurRouge();
                    initMarker($scope.pubs,mymap);

                },function (res) {
                    createAlert('ERROR','Problème chargement publications',res);
            })
        }

        serviceUserAjax.getUser({'id':idUser}).then(
            function (user){
                $scope.nameConnected = user.prenom +' '+user.nom;
                $scope.ppUser = user.pp;
            }
        )

        getTrend();

        $scope.aboFunction = function() {
            getAbo();
        }
        $scope.trendFunction =  function() {
            getTrend();
        }
        $scope.procheFunction =  function() {
            getProche();
        }
        $scope.redirectProfil = ($event) => {
            var link = $event.target;
            var id = link.getAttribute('userid');
            window.location.href = "/profil?id="+id;
        }

        $scope.showModal = ($event) => {
            let publication_id = $event.target.getAttribute("publication-id")
            let pub = getPublicationWithId($scope,publication_id);
            $scope.modal = pub.commentaires;
            addIdenty($scope.modal);
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

function initMarker(pubs,mymap){

    var greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    customMarker = L.Marker.extend({ // Je créé les markers personnalisés
        options: {
            msg: 'Custom data!'
        },
        icon : greenIcon
    });

    var markers = L.markerClusterGroup(); // Création du cluster group pour pouvoir afficher les markers meme si ils sont au meme enndroit

    for (var i = 0; i<pubs.length;i++){
        var position = pubs[i].position;
        var message = pubs[i].message;
        if (!message){
            message = '';
        }

        var myMarker = new customMarker([position.lat, position.long], { // Marker test
            username: pubs[i].userName,
            msg: message,
            icon : greenIcon
        });
        myMarker.bindPopup("<img style='height:50px;'  src='View/ressources/avatar.svg' alt=''><br><p style='text-align:center;'>" + message + "</p>").openPopup();

        markers.addLayer(myMarker);

        mymap.addLayer(markers);
    }

}

function themeMap(sombre,mymap){
    console.log('themeMap');
    var lightmap = "https://api.mapbox.com/styles/v1/cgobbo/ck6qkg6du0sc61ipgfmunfy2a/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2dvYmJvIiwiYSI6ImNrNmh3cnN4ZTA3aXozbWxvaGM3dGJzdWIifQ.xkLbDd0BUUKWQbAyUVrRew";
    var darkmap = 'https://api.mapbox.com/styles/v1/cgobbo/ck6qiop5d3l131iofj94j7jpl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2dvYmJvIiwiYSI6ImNrNmh3cnN4ZTA3aXozbWxvaGM3dGJzdWIifQ.xkLbDd0BUUKWQbAyUVrRew';
    // Les 2 maps pour switcher entre les 2 thèmes

    if (!sombre) { // Par rapport à la variable de l'utilisateur on met la map en light ou en dark
        console.log('!sombre')
        L.tileLayer(darkmap, {
            maxZoom: 18
        }).addTo(mymap);
    } else {
        console.log('sombre')
        L.tileLayer(lightmap, {
            maxZoom: 18
        }).addTo(mymap);
    }
}

function genarateData(zone) {
    var lat1 = zone._northEast.lat;
    var long1 = zone._northEast.lng;
    var lat2 = zone._southWest.lat;
    var long2 = zone._southWest.lng;

    var data = { lat1:lat1,
        long1:long1,
        lat2: lat2,
        long2: long2
    }

    return data;
}