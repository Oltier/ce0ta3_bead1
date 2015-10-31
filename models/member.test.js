var expect = require('chai').expect;
var bcrypt = require('bcryptjs');

var Waterline = require('waterline');
var waterlineConfig = require('../config/waterline');
var memberCollection = require('./member');
var todoCollection = require('./todo');

var Member;
var orm = new Waterline();

before(function (done) {
    
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
    function createUser(memberData){
        return Member.create(memberData);
    }
    
    function getMemberData() {
        return {
            nickname: 'myNickName',
            password: 'password',
            familyName: 'Gipsz',
            givenName: 'Jakab',
            displayName: 'Jakab Gipsz (myNickName)',
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
        var nickname= 'myNickName';
        var password= 'password';
        var familyName= 'Gipsz';
        var givenName= 'Jakab';
        var displayName = givenName+" "+familyName+" ("+nickname+")";
        
        return Member.create({
            nickname: nickname,
            password: password,
            familyName: familyName,
            givenName: givenName,
            displayName: displayName,
        })
        .then(function(user) {
            expect(user.nickname).to.be.equal('myNickName');
            expect(bcrypt.compareSync('password', user.password)).to.be.true;
            expect(user.familyName).to.be.equal('Gipsz');
            expect(user.givenName).to.be.equal('Jakab');
            expect(user.role).to.be.equal('child');
            expect(user.displayName).to.be.equal('Jakab Gipsz (myNickName)');
        });
    });
    
    [
        {name: 'nickname', value: ''},
        {name: 'familyName', value: ''},
        {name: 'givenName', value: ''},
        {name: 'password', value: ''},
    ].forEach(function (attr){
        it('should throw error for invalid data: ' + attr.name, function() {
            getMemberData()[attr.name] = attr.value;
            expect(createUser(getMemberData())).to.throw;
        })
    })
    
    it('should be able to find a user', function() {
        return createUser(getMemberData())
        .then(function(user) {
            return Member.findOneByNickname(user.nickname);
        })
        .then(function(user) {
            expect(user.nickname).to.be.equal('myNickName');
            expect(bcrypt.compareSync('password', user.password)).to.be.true;
            expect(user.familyName).to.be.equal('Gipsz');
            expect(user.givenName).to.be.equal('Jakab');
            expect(user.displayName).to.be.equal('Jakab Gipsz (myNickName)');
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


























