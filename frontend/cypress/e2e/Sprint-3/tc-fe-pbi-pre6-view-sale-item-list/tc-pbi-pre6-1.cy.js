describe(`TC-FE-PBI-PRE6-VIEW-SALE-ITEM-LIST-1\n 
    Test Scenario : normal - sale item table is empty`, () => {

    let resource = '/sale-items/list'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item list page at ${resource}`, () => {
    })

    it('The sale item table shoud be empty and the page show "no sale item".',()=>{
        cy.intercept('GET',`${baseAPI}/v1/**`,{
            statusCode: 200,
            body:  []
        }).as('request')

        cy.visit(resource)

        cy.wait('@request').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(200)
        })

        cy.get('itbms-row').should('have.length',0)
        cy.contains(/no sale item/i)
    })
})