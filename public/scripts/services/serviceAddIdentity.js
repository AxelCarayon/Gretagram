angular.module('app')
    .factory('serviceAddIdentity', function ($q, serviceUserAjax) {
        return {
            pubs: function (list) {
                let mem = [];
                for (var i = 0; i<list.length;i++){
                    let id = list[i].userID;
                    if (!mem.includes( id)){
                        mem.push(id);
                        serviceUserAjax.getUser({id:id}).then(function (user) {
                                var name = user.prenom +' '+user.nom;
                                list = addNameinListOfObj(list,user.id,name);
                                list = addPPinListOfObj(list,user.id,user.pp);
                            },function (rep) {
                                createAlert('ERROR',rep,"Impossible de récupérer les informations de l'utilisateur.");
                            }
                        );
                    }
                }




                return list;
            },

            abo : function (list) {
                for (var i = 0; i<list.length;i++){
                    var id = list[i].id;
                    serviceUserAjax.getUser({id:id}).then(function (user) {
                            var name = user.prenom +' '+user.nom;
                            list = addNameinListOfObj(list,user.id,name);
                            list = addPPinListOfObj(list,user.id,user.pp);
                        }
                    );
                }
                return $q.resolve(list);
            },

        }

    });

function addNameinListOfObj (list , id, e){
    for (var i = 0; i<list.length;i++){
        if (list[i].id == id || list[i].userID == id ) {
            list[i].userName = e
        }
    }
    return list;
}

function addPPinListOfObj (list , id, e){
    if (e== null){
        e = "View/ressources/profile.svg.png";
    }
    for (var i = 0; i<list.length;i++){
        if (list[i].id == id || list[i].userID == id) {
            list[i].pp = e
        }
    }
    return list;
}