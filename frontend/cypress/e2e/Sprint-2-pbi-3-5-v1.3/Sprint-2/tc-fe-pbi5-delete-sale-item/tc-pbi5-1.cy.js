describe(`TC-FE-PBI5-ADD-SALE-ITEM-1\n 
    Test Scenario : normal - cancel the action`, () => {

    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it('should have the sale item "Apple, iPhone 15 Pro Max,8/512GB" in the sale item gallery',()=>{
        cy.get('.itbms-model').contains('iPhone 15 Pro Max').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 15 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','8')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','57,900')
    })

    it('should have the sale item "Apple, iPhone 15 Pro Max,8/512GB" in the sale item gallery and should have the detail when clicking the sale item.',()=>{
        cy.get('.itbms-model').contains('iPhone 15 Pro Max').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('Apple')
        cy.get('.itbms-model').contains('iPhone 15 Pro Max')
        cy.get('.itbms-price').contains('57,900')
        cy.get('.itbms-description').contains('จอภาพ Super Retina XDR อัตรารีเฟรช 120Hz รองรับ Always On Display ชิป A17 Pro ระบบปฎิบัติการ iOS 17 น้ำหนัก 187 กรัม')
        cy.get('.itbms-ramGb').contains('8')
        cy.get('.itbms-screenSizeInch').contains('6.7')
        cy.get('.itbms-storageGb').contains('512')
        cy.get('.itbms-storageGb-unit').contains('GB')
        cy.get('.itbms-color').contains('Black Titanium')
        cy.get('.itbms-quantity').contains('5')
    })

    it('should have delete button and the button is enabled',()=>{
        cy.get('.itbms-model').contains('iPhone 15 Pro Max').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-delete-button').as('delete') ;
        cy.get('@delete').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should show the delete dialog with message "Do you want to delete this sale item?" ',()=>{
        cy.get('.itbms-model').contains('iPhone 15 Pro Max').should('exist').as('newSaleItem') 
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

        cy.get('.itbms-cancel-button').click() ;
    })

    it('should show the sale item detail "Apple, iPhone 15 Pro Max,8/512GB" when clicking the cancel button',()=>{
        cy.get('.itbms-model').contains('iPhone 15 Pro Max').should('exist').as('newSaleItem') 
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

        cy.get('.itbms-cancel-button').click() ;
        cy.wait(100)

        cy.get('.itbms-brand').contains('Apple')
        cy.get('.itbms-model').contains('iPhone 15 Pro Max')
        cy.get('.itbms-price').contains('57,900')
        cy.get('.itbms-description').contains('จอภาพ Super Retina XDR อัตรารีเฟรช 120Hz รองรับ Always On Display ชิป A17 Pro ระบบปฎิบัติการ iOS 17 น้ำหนัก 187 กรัม')
        cy.get('.itbms-ramGb').contains('8')
        cy.get('.itbms-screenSizeInch').contains('6.7')
        cy.get('.itbms-storageGb').contains('512')
        cy.get('.itbms-storageGb-unit').contains('GB')
        cy.get('.itbms-color').contains('Black Titanium')
        cy.get('.itbms-quantity').contains('5')
    })

})