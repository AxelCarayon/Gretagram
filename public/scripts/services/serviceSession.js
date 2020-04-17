.service("serviceSession", function() {
    this.setValue = function(key, value) {
        localStorage.setItem(key, value);
    };
    this.getValue = function(key) {
        return localStorage.getItem(key);
    };
    this.destroyItem = function(key) {
        localStorage.removeItem(key);
    };
})