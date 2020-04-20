app.directive('ngNav', function() {
    return {
        restrict: 'E',
        scope: {
            select: '&select'
        },
        templateUrl: "View/templates/nav.html"
    };
});

app.directive('cardTemplate', function() {
    return {
        restrict: 'E',
        templateUrl: "View/templates/card.html"
    };
});

app.directive('publicationTemplate', function() {
    return {
        restrict: 'E',
        templateUrl: "View/templates/publication.html"
    };
});

app.directive('publicationStatTemplate', function() {
    return {
        restrict: 'E',
        templateUrl: "View/templates/publicationStat.html"
    };
});