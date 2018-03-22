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
        commentsModule = pquire("../../../lib/getComments/commentsModule", {
            'sqlite3': sqliteStub
        });
        sqliteStub.Database = sinon.stub().returns({
            all: (sql, params, func) => func(null, mock.rows),
            run: (sql, params, func) => {
                mock.rows = [{test: "test"}];
                return func(null, mock.rows)
            },
            close: sinon.stub().returns()
        });
    });

    it("should return a comments object", done => {
        commentsModule.getComments('test.db', 'test').then(result => {
            assert.deepEqual(result, mock.rows[0]);
            done();
        }).catch(err => {
            done(err)
        })
    });

    it("should add new post and return a comments object", done => {
        mock.rows = [];
        commentsModule.getComments('test.db', 'test').then(result => {
            assert.deepEqual(result, mock.rows[0]);
            done();
        }).catch(err => {
            done(err)
        })
    });
})