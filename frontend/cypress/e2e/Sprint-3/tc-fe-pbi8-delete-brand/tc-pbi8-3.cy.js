describe(`TC-FE-PBI8-DELETE-BRAND-3\n 
    Test Scenario : normal - delete brand with associated sale item(s).`, () => {

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

    it(`should have "Infinix (2025)" brand with "Edit" and "Delete" button\n
        should show a form when clicking the "Delete" of the "Infinix (2025)" brand.\n
        should show "Delete Confirmation" dialog with message "Delete Infinix (2025) is not allowed. There are sale items with Infinix (2025) brand." with option "Cancel".\n
        should close the diaglog when clicking "Cancel" button and should FE not send DELETE to BE.\n
        should have "Infinix (2025)" brand in the brand list page`,()=>{
        let deleteRequest = false
        cy.intercept('DELETE', `${baseAPI}/v1/**`,(req)=>{
            deleteCalled = true;
        }).as('deleteRequest') ;

        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Infinix (2025)').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@row').find('.itbms-delete-button').as('delete')

        cy.get('@delete').click()
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', "Delete Infinix (2025) is not allowed. There are sale items with Infinix (2025) brand.") ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('not.exist') ; 

        cy.get('.itbms-cancel-button').click() ;
        cy.wait(100)

        cy.then(() => {
            expect(deleteRequest).to.be.false;
        });

        cy.url().should('include', '/brands')
        cy.get('.itbms-name').contains('Infinix (2025)').should('exist')

    })

    it(`should delete the sale item "Infinix (2025)/Note 50 Pro+/8GB/256GB/Enchanted Purple" and should have statusCode 204. \n
        should no the sale item "Infinix (2025)/Note 50 Pro+/8GB/256GB/Enchanted Purple" on the sale item list page.`,()=>{
        cy.intercept('DELETE', `${baseAPI}/v1/**`).as('deleteRequest') ;

        cy.get('.itbms-model').contains('Note 50 Pro+').should('exist').as('saleItem') 
        cy.get('@saleItem').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-delete-button').as('delete')
        cy.get('@delete').click() 
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete this sale item?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;

        cy.wait('@deleteRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(204)
        })
        cy.wait(100)

        cy.get('.itbms-message').contains('The sale item has been deleted.')

        cy.url().should('contain','/sale-items') ;
    })

    it(`should not have "Infinix (2025)/Note 50 Pro+/8GB/256GB/Enchanted Purple" sale item in the sale item list page`,()=>{
        cy.get('.itbms-model').should('not.contain', 'Note 50 Pro+');
    })

    it(`should have "Infinix (2025)" brand with "Edit" and "Delete" button\n
        should show a dialog when clicking the "Delete" of the "Infinix (2025)" brand.\n
        should show "Delete Confirmation" dialog with message "Do you want to delete Infinix (2025) brand?" with options "Confirm" and "Cancel".\n
        should delete the "Infinix (2025)" brand and should have statusCode 204.`,()=>{
        cy.intercept('DELETE', `${baseAPI}/v1/**`).as('deleteRequest') ;

        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Infinix (2025)').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@row').find('.itbms-delete-button').as('delete')

        cy.get('@delete').click()
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete Infinix (2025) brand?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;
        cy.wait(100)

        cy.wait('@deleteRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(204)
        })
        cy.wait(100)

        cy.url().should('include', '/brands')
        cy.get('.itbms-message').contains('The brand has been deleted.')

    })

    it(`should not have "Infinix (2025)" brand in the brand list page`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').should('not.contain', 'Infinix (2025)');

    })

})