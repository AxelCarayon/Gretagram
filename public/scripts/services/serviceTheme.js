angular.module('app')
    .factory('serviceTheme', function (serviceSession) {
        return {
            getTheme: function () {
                let sombre = serviceSession.getValue('theme');
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
                this.themeMap();
            },
            themeMap: function (mymap){
                let lightmap = "https://api.mapbox.com/styles/v1/cgobbo/ck6qkg6du0sc61ipgfmunfy2a/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2dvYmJvIiwiYSI6ImNrNmh3cnN4ZTA3aXozbWxvaGM3dGJzdWIifQ.xkLbDd0BUUKWQbAyUVrRew";
                let darkmap = 'https://api.mapbox.com/styles/v1/cgobbo/ck6qiop5d3l131iofj94j7jpl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2dvYmJvIiwiYSI6ImNrNmh3cnN4ZTA3aXozbWxvaGM3dGJzdWIifQ.xkLbDd0BUUKWQbAyUVrRew';
                let sombre = serviceSession.getValue('theme');
                if (sombre=='true') { // Par rapport à la variable de l'utilisateur on met la map en light ou en dark
                    L.tileLayer(darkmap, {
                        maxZoom: 18
                    }).addTo(mymap);
                } else {
                    L.tileLayer(lightmap, {
                        maxZoom: 18
                    }).addTo(mymap);
                }
            }
        }
    })