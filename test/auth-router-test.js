'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';
const port = process.env.PORT || 3000;

const co = require('co');
const server = require('../server');
const expect = require('chai').expect;
const userCrud = require('../lib/user-crud');
const debug = require('debug')('note:auth-router-test');
const request = require('./lib/request')(`localhost:${port}/api`);

describe('testing module auth-router', function(){
  before((done) => {
    if(!server.isRunning){
      server.listen(port, function(){
        debug('server.listen');
        console.log('server up !!!', port);
        server.isRunning = true;
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning){
      server.close( function(){
        debug('server.close');
        console.log('server down');
        server.isRunning = false;
        done();
      });
      return;
    }
    done();
  });

  describe('testing POST /signup', function(){
    after((done) => {
      co(function* (){
        yield userCrud.removeAllUsers();
        done();
      }).catch(done);
    });

    it('should return a user', function(done){
      co(function* (){
        const res = yield request.post('/signup')
        .send({username: 'slug', password: 'top-secret'});
        expect(res.status).to.equal(200);
        done();
      }).catch(done);
    });
  });

  describe('testing GET /login', function(){
    before((done) => {
      co(function* (){
        yield userCrud.createUser({username: 'slug', password: 'password123'});
        done();
      }).catch(done);
    });

    after((done) => {
      co(function* (){
        yield userCrud.removeAllUsers();
        done();
      }).catch(done);
    });

    it('should return a user', function(done){
      co(function* (){
        const basic = new Buffer('slug:password123');
        const res = yield request.get('/login')
        .set({Authorization: `Basic ${basic.toString('base64')}`});
        expect(res.status).to.equal(200);
        done();
      }).catch(done);
    });
  });
});
