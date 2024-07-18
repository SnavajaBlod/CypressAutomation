class loginPage
{
   
    logoutOfApplication()
    {
        cy.get('#nav-dropdown').click({force:true})
        cy.get('button').contains('Log Out').click()
        cy.get('button').contains('Yes').click()
    }
    loginToDriverApp()
    {
        cy.visit("https://blodplus-driver-git-develop-blod-in-team.vercel.app") 
        cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('input[type="text"]').type("bloodsupport@blod.in")
        cy.get('[type="password"]').type("blodadmin")
        cy.get('#loginButton').click()
        })
    }
}
export default loginPage;