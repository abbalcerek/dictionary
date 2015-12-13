module.exports = {
    hashCode: function (stringValue) {
        var hash = 0;
        if (stringValue.length == 0) return hash;
        for (var i = 0; i < stringValue.length; i++) {
            var char = stringValue.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
};