describe(`TC-FE-PB25-VIEW-SALE-ITEM-LIST-BY-SELLER-3\n 
    Test Scenario : normal - seller(td-5) with no sale item.`, () => {

    let resource = '/signin'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;

        cy.get('.itbms-email').as('email') ;
        cy.get('@email').type('itbkk.somsak@ad.sit.kmutt.ac.th') ;
        cy.get('.itbms-password').as('password') ;
        cy.get('@password').type('itProj24*SOM') ;
        cy.get('.itbms-signin-button').as('submit') ;
        cy.get('@submit').click() ;
        cy.wait(100)

        cy.on('window:alert', (text) => {
            expect(text).to.contains('The user account has been successfully logged in.')
        })
        cy.wait(200) ;

        cy.url().should('include', '/sale-items/list') ;
    }) ;

    it(`[step 1] Open the Sign In page at ${resource}.\n
        should display a sale-items list page.`, () => {
    })

    it(`[step 2] The sale item table should be empty and the page show "no sale item".`,()=>{
        cy.get('.itbms-row').should('have.length',0)
        cy.contains(/no sale item/i)
    })

})