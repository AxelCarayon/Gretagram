angular.module('app')
    .factory('serviceTheme', function (serviceSession) {
        return {
            getTheme: function () {
                let sombre = serviceSession.getValue('theme');
                console.log('getTheme', sombre);
                if (sombre == 'false') { // Si sombre est false le theme est clair sinon dark
                    $('*').removeClass('sombre');
                    $('*').addClass('clair');
                } else {
                    $('*').removeClass('clair');
                    $('*').addClass('sombre');
                }
            },
            setTheme: function () {
                if ( serviceSession.getValue('theme') == 'false'){
                    serviceSession.setValue('theme',true);
                }else serviceSession.setValue('theme',false);
                this.getTheme();
            }
        }
    })