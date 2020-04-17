angular.module('app')
    .factory('serviceIsConnect', function (serviceSession) {
        var token = serviceSession.getValue('token');
        var rep=true;
        if (token== null ||  token==''||token==undefined){ rep= false;}
        return rep;
    });
