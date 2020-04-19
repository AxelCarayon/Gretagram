angular.module('app').factory('User', function() {

    var User = function (data) {
        angular.extend(this, {
            _id : '',
            abonnements : '',
            abonnes : '',
            age : '',
            email : '',
            nom : '',
            photos : '',
            prenom : '',

            getId: function() {
                return this._id;
            }
        }, data.data);
    }
    return User;
})