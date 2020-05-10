angular.module('app')
    .factory('serviceGetIdUrl', function () {
        return {
            get : function (param) {
                //param = window.location.search.slice(1,window.location.search.length);
                let val = param.split('=');

                if (val[0]=='id' && val[1]!='' && val[1]!='null' && !val[1].includes('&')){
                    return val[1]
                }
                return -1;
            }
        }
    });