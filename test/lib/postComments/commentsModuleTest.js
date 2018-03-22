const assert = require("assert");
const sinon = require("sinon");
const pquire = require("proxyquire");
let mock, sqliteStub, commentsModule;

describe("commentsModule", () => {
    beforeEach(() => {
        mock = {
            rows: [{test: "test"}]
        };
        sqliteStub = function() {};
        commentsModule = pquire("../../../lib/postComment/commentsModule", {
            'sqlite3': sqliteStub
        });
        sqliteStub.Database = sinon.stub().returns({
            run: (sql, params, func) => func(null, mock.rows),
            close: sinon.stub().returns()
        });
    });

    it("should resolve", done => {
        commentsModule.updateComments('test.db', 'test', 'testData').then(result => {
            assert.equal(result, undefined);
            done();
        }).catch(err => {
            done(err)
        })
    });
})