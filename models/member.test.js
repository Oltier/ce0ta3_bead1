var expect = require('chai').expect;
var bcrypt = require('bcryptjs');

var Waterline = require('waterline');
var waterlineConfig = require('../config/waterline');
var memberCollection = require('./member');
var todoCollection = require('./todo');

var Member;

before(function (done) {
    var orm = new Waterline();
    
    orm.loadCollection(Waterline.Collection.extend(memberCollection));
    orm.loadCollection(Waterline.Collection.extend(todoCollection));
    waterlineConfig.connections.default.adapter = 'memory';
    
    orm.initialize(waterlineConfig, function(err, models) {
        if(err) throw err;
        Member = models.collections.member;
        done();
    });
});

describe('MemberModel', function() {
    function getMemberData() {
        return {
            nickname: 'myNickName',
            password: 'password',
            surname: 'Gipsz',
            forename: 'Jakab',
            role: 'child',
        };
    }
    
    beforeEach(function (done) {
        //console.log(Member);
        Member.destroy({}, function(err) {
            if(err) throw err;
            done();
        });
    });
    
    it('should be able to create a new user', function() {
        return Member.create({
            nickname: 'myNickName',
            password: 'password',
            surname: 'Gipsz',
            forename: 'Jakab',
            role: 'child',
        })
        .then(function(user) {
            expect(user.nickname).to.be.equal('myNickName');
            expect(bcrypt.compareSync('password', user.password)).to.be.true;
            expect(user.surname).to.be.equal('Gipsz');
            expect(user.forename).to.be.equal('Jakab');
            expect(user.role).to.be.equal('child');
        });
    });
    
    it('should be able to find a user', function() {
        return Member.create(getMemberData())
        .then(function(user) {
            return Member.findOneByNickname(user.nickname);
        })
        .then(function(user) {
            expect(user.nickname).to.be.equal('myNickName');
            expect(bcrypt.compareSync('password', user.password)).to.be.true;
            expect(user.surname).to.be.equal('Gipsz');
            expect(user.forename).to.be.equal('Jakab');
            expect(user.role).to.be.equal('child');
        });
    });
    
    describe('#validPassword', function() {
        it('should return true with correct password', function() {
            return Member.create(getMemberData())
            .then(function(user) {
                expect(user.validPassword('password')).to.be.true;
            });
        });
        
        it('should return false with incorrect password', function() {
            return Member.create(getMemberData())
            .then(function(user) {
                expect(user.validPassword('titkos')).to.be.false;
            });
        });
    });
});


























