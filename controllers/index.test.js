var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);

describe('User visits index page', function() {
   var browser = new Browser();
   
   before(function() {
       return browser.visit('/');
   });
   
   
   it('should be successful', function() {
       browser.assert.success();
   });
   
   it('should see application name', function() {
       browser.assert.text('div.page-header > h1', 'Családunk TODO alkalmazása');
   });
   
   it('should see motivational text', function() {
       browser.assert.text('p', 'Tessék szorgalmasan megcsinálni minden feladatot!');
   });
   
});

describe('User visits new todo page', function(argument) {
    const browser = new Browser();
    
    before(function(){
       return browser.visit('todos/new');
    });
    
    it('should go to the authentication page when not logged in' , function() {
         browser.assert.redirected();
         browser.assert.success();
         browser.assert.url({pathname: '/login'});
    });
    
   it('should be redirected to login page with error message with invalid login credentials', function(done) {
       browser
         .fill('nickname', 'asd')
         .fill('password', 'asd')
         .pressButton('button[type=submit]')
         .then(function() {
            browser.assert.redirected();
            browser.assert.success();
            browser.assert.url({pathname: '/login'});
            browser.assert.text('.alert-dismissible', '× Helytelen adatok.');
            done();
         });
    });
    
    it('should be able to login with correct credentials', function (done) {
       browser
         .fill('nickname', 'user')
         .fill('password', 'user')
         .pressButton('button[type=submit]')
         .then(function() {
            browser.assert.redirected();
            browser.assert.success();
            browser.assert.url({pathname: '/todos/list'});
            done();
         });
    });
    
    it('should go to the "Új feladat felvétele" page', function(done) {
        return browser.visit('/todos/new')
         .then(function(){
            browser.assert.success();
            browser.assert.text('div.page-header > h1', 'Új teendő felvétele');
            done();
         });
    });
    
    it('should show errors if the form fields are incorrect', function() {
         return browser
            .fill('dueDate', '')
            .fill('leiras', '')
            .pressButton('button[type=submit]')
            .then(function() {
                browser.assert.success();
                browser.assert.element('form .form-group:nth-child(2) [name=dueDate]');
                browser.assert.hasClass('form .form-group:nth-child(2)', 'has-error');
                browser.assert.element('form .form-group:nth-child(3) [name=leiras]');
                browser.assert.hasClass('form .form-group:nth-child(3)', 'has-error');
            });
    });
    
    it('should show the reght-filled form fields and go back to list page', function() {
        browser
            .fill('dueDate', '2015.10.20.')
            .fill('leiras', 'rossz')
            .pressButton('button[type=submit]')
            .then(function() {
                browser.assert.redirected();
                browser.assert.success();
                browser.assert.url({pathname: '/todos/list'});
                
                browser.assert.element('table.table');
                browser.assert.text('table.table tbody tr:last-child td:nth-child(2) span.label', 'Új');
                browser.assert.text('table.table tbody tr:last-child td:nth-child(3)', 'rossz');
                browser.assert.text('table.table tbody tr:last-child td:nth-child(4)', '2015.10.20.');
            });
    });
});








