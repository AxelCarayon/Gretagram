app.directive('ngNav', function() {
    return {
        restrict: 'E',
        scope: {
            select: '&select'
        },
        templateUrl: "Controller/js/directives/nav.html"
    };
});

app.directive('cardTemplate', function() {
    return {
        restrict: 'E',
        templateUrl: "Controller/js/directives/card.html"
    };
});

app.directive('publicationTemplate', function() {
    return {
        restrict: 'E',
        templateUrl: "Controller/js/directives/publication.html"
    };
});

app.directive('publicationStatTemplate', function() {
    return {
        restrict: 'E',
        templateUrl: "Controller/js/directives/publicationStat.html"
    };
});