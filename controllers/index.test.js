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