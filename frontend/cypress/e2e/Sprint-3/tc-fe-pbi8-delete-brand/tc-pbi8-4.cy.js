describe(`TC-FE-PBI8-DELETE-BRAND-4\n 
    Test Scenario : fail - the brand does not exist, \n
                    eg. The brand id does not exist or \n
                    the brand already been deleted by another user.`, () => {

    let resource = '/sale-items/list'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item list page at ${resource}`, () => {
    })

    it(`should have the sale item "Meizu/21 5G/12GB/512GB/17,029/Black" in the sale item list page with options to "Edit" and "Delete".\n
        should delete the sale item "Meizu/21 5G/12GB/512GB/17,029/Black" and should have statusCode 204. \n
        should no the sale item "Meizu/21 5G/12GB/512GB/17,029/Black" on the sale item list page.`,()=>{
        cy.intercept('DELETE', `${baseAPI}/v1/**`).as('deleteRequest') ;

        cy.get('.itbms-model').contains('21 5G').should('exist').as('saleItem')
        cy.get('@saleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Meizu')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-price','17,029')

        cy.get('@row').find('.itbms-edit-button')
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

        cy.url().should('contain','/sale-items/list') ;
    })

    it(`should not have "Meizu/21 5G/12GB/512GB/17,029/Black" sale item in the sale item list page`,()=>{
        cy.get('.itbms-model').should('not.contain', '21 5G');
    })

    it(`should have "Manage Brand" button and click to open the brand list page in table view\n
        should have "Meizu" brand with "Edit" and "Delete" button\n
        should show a dialog when clicking the "Delete" of the "Meizu" brand.\n
        should show "Delete Confirmation" dialog with message "Do you want to delete Meizu brand?" with options "Confirm" and "Cancel"."\n
        should delete the "Meizu" brand and should have statusCode 204.
        should show a message "The requested sale item does not exist."`,()=>{

        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)


        cy.get('.itbms-name').contains('Meizu').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@row').find('.itbms-delete-button').as('delete')
        cy.get('@row').find('.itbms-id').then((id) => {
            const brandId = id.text()
            let requestUrl = `${baseAPI}/v1/brands/${brandId}`
            cy.request('DELETE', requestUrl).then((response) => {
                expect(response.status).to.equal(204)
            })
        })

        cy.get('.itbms-name').contains('Meizu').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@row').find('.itbms-delete-button').as('delete')

        cy.get('@delete').click()
        cy.wait(100)

        cy.intercept('DELETE', `${baseAPI}/v1/**`).as('deleteRequest') ;

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete Meizu brand?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;
        cy.wait(100)

        cy.wait('@deleteRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(404)
        })
        cy.wait(100)

        cy.url().should('include', '/brands')
        cy.get('.itbms-message').contains('An error has occurred, the brand does not exist.')

    })

    it('should not have "Meizu" brand in the brand list page', () => {
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').should('not.contain', 'Meizu');
    })

})