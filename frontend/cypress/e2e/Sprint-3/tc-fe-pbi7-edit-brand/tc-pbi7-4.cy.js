describe(`TC-FE-PBI7-EDIT-SALE-ITEM-4\n 
    Test Scenario : fail - edit brand detail with invalid ID `, () => {

    let resource = '/sale-items/list'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item list page at ${resource}`, () => {
    })

    it(`should have "Manage Brand" button and click to open the brand list page in table view\n
        should have id and name fields\n`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').find('.itbms-id')
        cy.get('@row').find('.itbms-name')
    })

    it(`should have "1 Samsung" at row 1 and "2 Apple" at row 2`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-id','1')
        cy.get('@row').contains('.itbms-name','Samsung')

        cy.get('.itbms-row').eq(1).as('row')
        cy.get('@row').contains('.itbms-id','2')
        cy.get('@row').contains('.itbms-name','Apple')
    })

    it('should show message "The brand does not exist." when editing the brand id 9999. it should redirect to the previous page.',()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.visit(`brands/9999/edit`) ;
        cy.wait(100) ;

        cy.get('body').then(($body) => {
        if ($body.find('.itbms-message').length > 0) {
            cy.get('.itbms-message').should('contain.text', 'The brand does not exist.');
        } else {
            cy.on('window:alert', (text) => {
            expect(text).to.equal('The brand does not exist.');
            });
        }
        });

        cy.url().should('include', '/brands') ;
    })

})