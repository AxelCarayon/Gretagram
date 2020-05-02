var app = angular.module('app', []);

app.controller("ctrl2", function ($scope,serviceIsConnect,servicePublicationAjax,serviceSession,serviceUserAjax) {
    $scope.loading = true;
    if (!serviceIsConnect) {
        window.location.href = "/login";

    } else {
        var token = serviceSession.getValue('token');
        var sizeTrend = 100;
        var idUser = serviceSession.getValue('id');

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
                    //TODO alert error
                    console.log(res)
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
                    //TODO alert error
                    console.log(res)
                }
            )
        }

        var getProche = function (){
            $scope.proche = true;
            $scope.loading = false;
            $(".map-container").animate({ // La map s'affiche
                right: '0%'
            });

            navigator.geolocation.getCurrentPosition(function(position) { // Je créé une fonction pour récupérer les données de géolocalisation
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var longSize = 10;
                var latSize = 10;
                var data = { long:longitude,
                    lat:latitude,
                    longSize: longSize,
                    latSize: latSize
                }
                servicePublicationAjax.getProche(data).then(
                    function (res) {
                        $scope.pubs = addIdenty(res);
                        coeurRouge();
                        console.log(res);
                    },function (res) {
                        //TODO alert error
                        console.log(res)
                    })


            },function () {
                //TODO alert error
                alert('La géolocalisation est obligatoire pour utilisé nos services.');
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
                            //TODO alert error
                            console.log(rep);
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
        getTrend();

        $scope.aboFunction = function() {
            getAbo();
            console.log('abo')
        }
        $scope.trendFunction =  function() {
            getTrend();
            console.log('trend')
        }
        $scope.procheFunction =  function() {
            getProche();
            console.log('proche')
        }
        $scope.redirectProfil = ($event) => {
            var link = $event.target;
            var id = link.getAttribute('userid');
            window.location.href = "/profil?id="+id;
        }

        $scope.showModal = ($event,$index) => {

            let pub;
            let publication_id = $event.target.getAttribute("publication-id")
            
            for (const i in $scope.pubs) {     
                if ($scope.pubs[i]._id == publication_id) {
                    pub = $scope.pubs[i];
                    break;
                }
            }             
            
            $scope.modal = pub.commentaires;
    
            console.log('$scope.modal',pub.commentaires);
    
            var mem = [];
            for (var i = 0; i<$scope.modal.length;i++){
                var id = $scope.modal[i].userID;
                if (!mem.includes( id)){
                    mem.push(id);
    
                    serviceUserAjax.getUser({id:id}).then(function (user) {
                            var name = user.prenom +' '+user.nom;
                            $scope.modal = addNameinListOfObj($scope.modal,user.id,name);
                            $scope.modal = addPPinListOfObj($scope.modal,user.id,user.pp);
                        }
                    );
                }
            }
          //  console.log('$scope.modal 2 ',$scope.modal,$index);
    
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