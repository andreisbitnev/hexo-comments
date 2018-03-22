const assert = require("assert");
const sinon = require("sinon");
const pquire = require("proxyquire");
let mock, sqliteStub, userModule, log;

describe("userModule", () => {
    beforeEach(() => {
        mock = {
            rows: [{username: "testUsername"}]
        };
        log = {
            info: sinon.stub().returns(),
            error: sinon.stub().returns()
        }
        sqliteStub = function() {};
        userModule = pquire("../../../lib/userModule/userModule", {
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
        userModule.init('test.db', log);
    });

    it("should return user object", done => {
        userModule.findUser('testProvider', 'testId').then(result => {
            assert.equal(result, mock.rows[0]);
            done();
        }).catch(err => {
            done(err)
        })
    });

    it("should return null", done => {
        mock.rows = [];
        userModule.findUser('testProvider', 'testId').then(result => {
            assert.equal(result, null);
            done();
        }).catch(err => {
            done(err)
        })
    });

    it("should save a new user and return user object", done => {
        mock.rows = [];
        const userData = {
            provider: 'testProvider', 
            id: 'testId', 
            displayName: 'testUser'
        }
        userModule.getUser(userData).then(result => {
            assert(log.info.calledWith(`User - testUser not yet registered`))
            assert(log.info.calledWith(`New user - testUser added`));
            assert.equal(result, mock.rows[0]);
            done();
        }).catch(err => {
            done(err)
        })
    });
})