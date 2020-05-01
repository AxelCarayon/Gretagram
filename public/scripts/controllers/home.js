var app = angular.module('app', []);

app.controller("ctrl2", function ($scope,serviceIsConnect,servicePublicationAjax,serviceSession,serviceUserAjax) {
    $scope.loading = true;
    if (!serviceIsConnect) {
        window.location.href = "/login";

    } else {
        var token = serviceSession.getValue('token');
        var sizeTrend = 100;

        var getAbo = function (){
            $scope.proche = false;
            $scope.loading = false;
            $(".map-container").animate({ // La map reste se cache
                right: '-2000px'
            });

            servicePublicationAjax.getAbonnements(token).then(
                function (pubs) {
                    $scope.pubs = addIdenty(pubs);
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

    }
})