describe(`TC-FE-PBI4-ADD-SALE-ITEM-2\n 
    Test Scenario : normal - successfull delete`, () => {

    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it('should have the sale item "Galaxy S25 Ultra (2025)" in the sale item gallery',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra (2025)').should('exist').as('newSaleItem')
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Samsung')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-price','46,900')
    })

    it('should have the sale item "Galaxy S25 Ultra (2025)" in the sale item gallery and should have the detail of the sale item',()=>{
         cy.get('.itbms-model').contains('Galaxy S25 Ultra (2025)').should('exist').as('newSaleItem')
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('Samsung')
        cy.get('.itbms-model').contains('Galaxy S25 Ultra (2025)')
        cy.get('.itbms-price').contains('46,900')
        cy.get('.itbms-description').contains('ระบบปฎิบัติการ Android 15 One UI 7.0 กล้องหน้า 12MP กล้องหลัง UW50+W200+Tele 10+periscope telephoto 50 หน้าจอ Dyanmic AMOLED 2X')
        cy.get('.itbms-ramGb').contains('12')
        cy.get('.itbms-screenSizeInch').contains('6.9')
        cy.get('.itbms-storageGb').contains('256')
        cy.get('.itbms-color').contains('Titanium Blue')
        cy.get('.itbms-quantity').contains('15')
    })

    it('should have delete button and the button is enabled',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra (2025)').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-delete-button').as('delete') ;
        cy.get('@delete').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should show the delete dialog with message "Do you want to delete this sale item?" ',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra (2025)').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-delete-button').as('delete') ;
        cy.get('@delete').click() 
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete this sale item?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 
    })

    it('should delete the sale item and should have statusCode 204. should no the sale item "Sumsung,Galaxy S25 Ultra (2025),12/256GB,46,900" on the sale item gallery page.',()=>{
        cy.intercept('DELETE', `${baseAPI}/v1/**`).as('deleteRequest') ;

        cy.get('.itbms-model').contains('Galaxy S25 Ultra (2025)').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-delete-button').as('delete') ;
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

        cy.get('.itbms-model').should('not.contain', 'Galaxy S25 Ultra (2025)');
    })
})