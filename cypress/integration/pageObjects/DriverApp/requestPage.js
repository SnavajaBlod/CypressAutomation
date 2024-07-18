export default class requestPage
{
    agentArrived()
    {
        cy.get('#captureButton').click()
		cy.get('#uploadButton').click()
    }
}
