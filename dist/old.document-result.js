"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DocumentResultSet = (function () {
    function DocumentResultSet(resultSet, searchTemplate, params) {
        this.params = params;
        this.total = 0;
        this.max_score = 0;
        this.paging = null;
        this.documents = [];
        var query = searchTemplate.getBody(this.params);
        var preferredView = searchTemplate.preferredView;
        var paging = new Paging({
            from: query.from || null,
            size: query.size || null,
            sort: query.sort || null
        });
        this.total = resultSet.hits.total;
        this.max_score = resultSet.hits.max_score;
        this.paging = paging;
        this.documents = resultSet.hits.hits.map(function (hit) {
            var documentResultBase = {
                _index: hit._index,
                _type: hit._type,
                _id: hit._id,
                _score: hit._score,
                _sort: hit._sort || null,
                _view: ''
            };
            var documentResult = new DocumentResult(documentResultBase, hit._source, preferredView);
            return documentResult;
        });
    }
    return DocumentResultSet;
}());
exports.DocumentResultSet = DocumentResultSet;
var DocumentResult = (function () {
    function DocumentResult(documentResultBase, hit, preferredView) {
        this._index = null;
        this._type = null;
        this._id = null;
        this._score = null;
        this._sort = null;
        this._view = null;
        this.Id = null;
        this.author = null;
        this.description = null;
        this.lastUpdated = null;
        this.tags = null;
        this.title = null;
        this.views = null;
        this.publishOn = null;
        this.dateIndexUpdated = null;
        this.text_bag = null;
        this.og_title = null;
        this.og_description = null;
        this.og_image = null;
        this.json_ld = null;
        this.coords = null;
        Object.assign(this, documentResultBase);
        Object.assign(this, hit);
        if (preferredView.indexOf('details') === -1) {
            preferredView.push('details');
        }
        if (this.views.length > 0) {
            for (var v = 0; v < preferredView.length; v++) {
                var name = preferredView[v];
                var found = this.views.filter(function (view) {
                    return view.name === name;
                });
                if (found && found.length > 0) {
                    this._view = found[0].html;
                    break;
                }
            }
            if (!this._view) {
                this._view = this.views[0].html;
            }
        }
        else {
            this._view = 'No view specified';
        }
    }
    return DocumentResult;
}());
exports.DocumentResult = DocumentResult;
var Paging = (function () {
    function Paging(paging) {
        this.from = 0;
        this.size = 10;
        this.sort = null;
        Object.assign(this, paging);
    }
    Object.defineProperty(Paging.prototype, "nextFrom", {
        get: function () {
            return this.from + this.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paging.prototype, "prevFrom", {
        get: function () {
            var prev = this.from - this.size;
            return prev >= 0 ? prev : 0;
        },
        enumerable: true,
        configurable: true
    });
    return Paging;
}());
exports.Paging = Paging;
//# sourceMappingURL=old.document-result.js.map