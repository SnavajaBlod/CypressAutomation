export default class homePage
{
    openRequestPage(requestId,orderStatus)
    {
        cy.url().then($url =>
        {
         let link=$url.split("dashboard")[0].trim()
        link=link+"deliveryAction/"+orderStatus+"/"+requestId;
           cy.visit(link)
        }
        )
    }
}