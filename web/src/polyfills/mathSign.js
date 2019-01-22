if (typeof Math.sign !== "function") {
    Math.sign = function(arg) {
        arg = Number(arg);
        if (!arg) {
            return arg;
        }
        return arg < 0 ? -1 : 1;
    }
}