Map.prototype.hasNotThenSet = function (key, value) {
    if (!this.has(key)) {
        this.set(key, value);
    }
}