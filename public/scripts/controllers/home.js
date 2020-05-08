var app = angular.module('app', []);

app.controller("ctrl2", function ($scope,serviceIsConnect,servicePublicationAjax,serviceSession,serviceUserAjax,serviceRechercheAjax,serviceAddIdentity,serviceTheme) {
    $scope.loading = true;
    $scope.totalPubs = 5;
    $scope.btnLoadMore = "Charger plus..."
    serviceTheme.getTheme();

    // TOP 10 #
    serviceRechercheAjax.getTopH().then(function (data) {
            $scope.hashtags = data;
    });


    if (!serviceIsConnect) {
        window.location.href = "/login";

    } else {
        let token = serviceSession.getValue('token');
        let sizeTrend = 100;
        let idUser = serviceSession.getValue('id');
        let mymap = L.map('macarte');
        let mapH = L.map('carteH');





        $scope.loadMorePubs = () =>{
            if ($scope.totalPubs >= sizeTrend - 5   ) {
                $scope.btnLoadMore = "Pas de publications supplémentaires"
            }
            if ($scope.totalPubs >= sizeTrend) {
                window.scrollTo(0,0)
            }
            else{
                $scope.totalPubs = $scope.totalPubs + 5
            }
        }


        let getAbo = function (){
            $scope.proche = false;
            $scope.loading = false;
            $(".map-container").animate({ // La map reste se cache
                right: '-2000px'
            });

            servicePublicationAjax.getAbonnements(token).then(
                function (pubs) {
                    $scope.pubs = serviceAddIdentity.pubs(pubs);
                    coeurRouge();

                },function (res) {
                    createAlert('ERROR','Problème chargement publications',res);
                }
            )



        }
        let getTrend = function (){
            $scope.proche = false;
            $scope.loading = false;
            $(".map-container").animate({ // La map reste se cache
                right: '-2000px'
            });

            servicePublicationAjax.getTrend(sizeTrend).then(
                function (rep) {
                    $scope.pubs = serviceAddIdentity.pubs(rep);
                    coeurRouge();

                },function (res) {
                    createAlert('ERROR','Problème chargement publications',res);
                }
            )
        }

        let getProche = function (){
            $scope.proche = true;
            $scope.loading = false;
            $(".map-container").animate({ // La map s'affiche
                right: '0%'
            });
            //theme carte
            serviceTheme.themeMap(mymap);

            navigator.geolocation.getCurrentPosition(function(position) { // Je créé une fonction pour récupérer les données de géolocalisation
                var mylatitude = position.coords.latitude;
                var mylongitude = position.coords.longitude;

                mymap.setView([mylatitude, mylongitude], 11);

                var circle = L.circle([mylatitude, mylongitude], { // Ajout d'un cercle à l'emplacement de l'utilisateur
                    color: 'rgb(199, 201, 249)',
                    fillColor: 'rgb(20, 122, 186)',
                    fillOpacity: 0.8,
                    radius: 200
                })
                console.log(circle);
                
                circle.bindPopup("Vous êtes ici.").openPopup();
                circle.addTo(mymap);

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

        function identity (e){
            let id = e.userID;
            serviceUserAjax.getUser({id:id}).then(function (user) {
                    e.userName = user.prenom +' '+user.nom;
                    e.pp = user.pp;
                },function (rep) {
                    createAlert('ERROR','Problème récupération des données utilisateur',rep);
                }
            );

            return e;
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
            servicePublicationAjax.getProche(data).then(
                function (res) {
                    $scope.pubs = serviceAddIdentity.pubs(res);
                    coeurRouge();
                    initMarker($scope.pubs,mymap);

                },function (res) {
                    createAlert('ERROR','Problème chargement publications',res);
            })
        }

        function listToPubs (list,scope){
            for(const i in list){
                servicePublicationAjax.getPub(list[i]).then(
                    function (data) {
                        scope.push(identity(data));
                    },function (data) {
                        createAlert('error','Erreur serveur : ', "Nous somme désolé la demande n'a pu aboutir.")
                    }
                )
            }
            return scope;
        }

        //Ajout du nom et pp de l'user connecté
        serviceUserAjax.getUser({'id':idUser}).then(
            function (user){
                $scope.nameConnected = user.prenom +' '+user.nom;
                $scope.ppUser = user.pp;
            }
        )

        $scope.recherche = false;
        getTrend();


        $(".change-theme").click(() => {
            serviceTheme.setTheme();
        })

        //RECHERCHE
        $scope.empty = () => {
            let text = $scope.confirmed;

            if (text == "") {
                $scope.recherche = false;
                $('#icon-recherche').removeClass("fa-times")
                $('#icon-recherche').addClass("fa-search")
                
            }else{
                $scope.recherche = true;
                $('#icon-recherche').addClass("fa-times")
                $('#icon-recherche').removeClass("fa-search")

                if (text[0] == '#'){
                    $scope.rechercheHashtag = true;
                    $scope.rechercheUser = false;
                    $scope.carteH = false;
                    let recherche = text.split(' ')[0];
    
                    serviceRechercheAjax.getHPub({hashtag:recherche}).then(
                        function (data) {
                            if (data.status == 'hashtag inexistant'){
                                // createAlert('error','hashtag inexistant','');
                                // $scope.recherche = false;
                                // getTrend();
                            }else{
                                let listID = data.data.l_publications
                                $scope.pubs = [];
                                $scope.pubs  =listToPubs(listID,$scope.pubs);
                                coeurRouge();
                                $scope.nameH = recherche;

                            }
                            // console.log(data);
                        },function (data) {
                            console.log('getHPub error ' ,data);
                            createAlert('error','Erreur serveur','Nous sommes pas dans la mesure de répondre à votre demande.');
                        }
                    )
                }else{
                    $scope.rechercheHashtag = false;
                    $scope.rechercheUser = true;
                    serviceRechercheAjax.getUsers(text).then(
                        function (data) {
                            // console.log('getUsers success ' ,data);
                            $scope.users = data;
                        },function (data) {
                            console.log('getUsers error ' ,data);
                            createAlert('error','Erreur serveur','Nous sommes pas dans la mesure de répondre à votre demande.');
                        }
                    )
                }
            }    

        }

        //Afficher carte dans recherche #
        $scope.showCarte = () => {
            if ($scope.carteH){
                $('#showCarte').innerHTML = 'Masquer la carte.'
                $scope.carteH = false;

            }else{
                $scope.carteH = true;
                $(".map-container").animate({ // La map s'affiche
                    right: '0%'
                });
                serviceTheme.themeMap(mapH);
                mapH.setView([0,0], 1);
                initMarker($scope.pubs,mapH);
            }
        }

        // Click sur TOP 10 #
        $scope.fillSearch = (hashtag) => {
            $scope.recherche = true;
            $scope.rechercheHashtag = true;
            $scope.rechercheUser = false;
            $scope.carteH = false;
            $('#icon-recherche').addClass("fa-times")
            $('#icon-recherche').removeClass("fa-search")
            $scope.pubs = [];
            $scope.pubs  =listToPubs(hashtag.l_publications,$scope.pubs);
            $scope.nameH = hashtag.name;
            $scope.confirmed =  hashtag.name;
        }
        $scope.deleteRecherche = () => {
            $scope.confirmed = ""
            $scope.empty()
        }
        $scope.aboFunction = function() {
            getAbo();
            serviceTheme.getTheme();

        }
        $scope.trendFunction =  function() {
            getTrend();
            serviceTheme.getTheme();

        }
        $scope.procheFunction =  function() {
            getProche();
            serviceTheme.getTheme();
        }
        $scope.redirectProfil = ($event) => {
            var link = $event.target;
            var id = link.getAttribute('userid');
            window.location.href = "/profil?id="+id;
        }
        $scope.redirectHome = () => {
            $scope.recherche = false;
            $scope.confirmed = "";
            getTrend();
        }

        $scope.showModal = ($event) => {
            let publication_id = $event.target.getAttribute("publication-id")
            let pub = getPublicationWithId($scope,publication_id);
            $scope.modal = pub.commentaires;
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

function initMarker(pubs,map){

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
        var nom = pubs[i].userName
        if (!message){
            message = '';
        }

        var myMarker = new customMarker([position.lat, position.long], { // Marker test
            username: pubs[i].userName,
            msg: message,
            icon : greenIcon
        });

        
        myMarker.bindPopup(`
        <p style='text-align:center;font-weight: 700'> ${nom} </p>
        <p style='text-align:center;font-weight: 300'> ${message} </p>
         `).openPopup();

        markers.addLayer(myMarker);
        map.addLayer(markers);
    }
}

function genarateData(zone) {
    let lat1 = zone._northEast.lat;
    let long1 = zone._northEast.lng;
    let lat2 = zone._southWest.lat;
    let long2 = zone._southWest.lng;

    let data = { lat1:lat1,
        long1:long1,
        lat2: lat2,
        long2: long2
    }

    return data;
}