describe(`TC-FE-PB25-VIEW-SALE-ITEM-LIST-BY-SELLER-4\n 
    Test Scenario : fail - buyer`, () => {

    let resource = '/signin'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;

        cy.get('.itbms-email').as('email') ;
        cy.get('@email').type('itbkk.somchai@ad.sit.kmutt.ac.th') ;
        cy.get('.itbms-password').as('password') ;
        cy.get('@password').type('itProj24*SOM') ;
        cy.get('.itbms-signin-button').as('submit') ;
        cy.get('@submit').click() ;
        cy.wait(100)

        cy.on('window:alert', (text) => {
            expect(text).to.contains('The user account has been successfully logged in.')
        })
        cy.wait(200) ;

        cy.url().should('include', '/sale-items') ;
    }) ;

    it(`[step 1] Open the Sign In page at ${resource}.\n
        should display a sale-items gallery page.`, () => {
    })

    it(`[step 2] should redirect to the sale-item gallery page when accessing to the sale-item list page`,()=>{
        cy.visit('/sale-items/list') ;
        cy.wait(100) ;

        cy.url().should('include', '/sale-items') ;
    })

})