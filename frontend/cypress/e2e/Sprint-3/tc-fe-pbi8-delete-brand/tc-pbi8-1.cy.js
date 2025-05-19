describe(`TC-FE-PBI8-DELETE-BRAND-1\n 
    Test Scenario : normal - cancel the action`, () => {

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

    it(`should have "Tecno (2025)" brand with "Edit" and "Delete" button\n
        should show a form when clicking the "Delete" of the "Tecno (2025)" brand.\n
        should show "Delete Confirmation" dialog with message "Do you want to delete Tecno (2025) brand?" with options "Confirm" and "Cancel".\n
        should close the diaglog when clicking "Cancel" button and locate at /brands.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Tecno (2025)').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@row').find('.itbms-delete-button').as('delete')

        cy.get('@delete').click()
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete Tecno (2025) brand?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-cancel-button').click() ;
        cy.wait(100)

        cy.url().should('include', '/brands')
    })

    it(`should have "Tecno (2025)" brand in the brand list page`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Tecno (2025)').should('exist')

    })
    
})