"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function MapJsonify(map) {
    var json = {};
    Object.keys(map).forEach(function (key) {
        var item = map[key];
        if (typeof item.toJSON === 'function') {
            json[key] = item.toJSON();
        }
        else {
            json[key] = item;
        }
    });
    return json;
}
exports.MapJsonify = MapJsonify;
//# sourceMappingURL=map-jsonify.js.map