describe(`TC-FE-PBI4-ADD-SALE-ITEM-4\n 
    Test Scenario : fail - edit dale item with invalid id `, () => {

    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it('should show message "The requested sale item does not exist." when opening the salie item id 9999. it should redirect to the sale item gallery page.',()=>{
        cy.visit(`${resource}/9999`) ;
        cy.wait(100) ;

        cy.get('body').then(($body) => {
        if ($body.find('.itbms-message').length > 0) {
            cy.get('.itbms-message').should('contain.text', 'The requested sale item does not exist.');
        } else {
            cy.on('window:alert', (text) => {
            expect(text).to.equal('The requested sale item does not exist.');
            });
        }
        });

        cy.url().should('include', resource) ;
    })



})