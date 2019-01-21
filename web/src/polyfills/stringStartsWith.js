if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, pos) {
            return this.substring(!pos || pos < 0 ? 0 : +pos, pos + search.length) === search;
        }
    });
}