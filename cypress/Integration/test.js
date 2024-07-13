describe('First Test', function()
{
    
    before(function()
{
    cy.clearCookies();
    cy.clearLocalStorage();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.fixture('example').then(function(data)
    {
        this.data=data
    })
})
    it('Test Case', function()
{
   
    cy.visit("https://dev.blodplus.com/") 
    cy.get('[type="text"]').type(this.data.email)
    cy.get('[type="password"]').type(this.data.password)
    cy.get('button').contains('Login').click()
    cy.get('button').contains('Link').click()
    cy.get('[placeholder="Enter the Request ID"]').type("e2dec63f")
    cy.get('button').contains('Go').should('not.be.enabled')
})
}) 