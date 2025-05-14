describe(`TC-FE-PBI4-ADD-SALE-ITEM-1\n 
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

    it('should have edit button and the button is enabled',()=>{
        cy.get('.itbms-model').contains('iPhone 15 Pro Max').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should show the form with the current sale detail. All fields are editable. The save button is disabled',()=>{
        cy.get('.itbms-model').contains('iPhone 15 Pro Max').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('Apple')
        cy.get('input.itbms-model').should('have.value','iPhone 15 Pro Max')
        cy.get('input.itbms-price').should('have.value','57900')
        cy.get('textarea.itbms-description').should('have.value','จอภาพ Super Retina XDR อัตรารีเฟรช 120Hz รองรับ Always On Display ชิป A17 Pro ระบบปฎิบัติการ iOS 17 น้ำหนัก 187 กรัม')
        cy.get('input.itbms-ramGb').should('have.value','8')
        cy.get('input.itbms-screenSizeInch').should('have.value','6.7')
        cy.get('input.itbms-storageGb').should('have.value','512')
        cy.get('input.itbms-color').should('have.value','Black Titanium')
        cy.get('input.itbms-quantity').should('have.value','5')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it('should change the model field to "iPhone 15 Pro Max (2023)" and the save button is enabled.',()=>{
        cy.get('.itbms-model').contains('iPhone 15 Pro Max').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-model').clear().type('iPhone 15 Pro Max (2023)')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should change the model field to "iPhone 15 Pro Max (2023)" and press "Enter" and then change the model field back to "iPhone 15 Pro Max" and the save button should be disabled agin.',()=>{
        cy.get('.itbms-model').contains('iPhone 15 Pro Max').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-model').clear().type('iPhone 15 Pro Max (2023)').blur()
        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-model').clear().type('iPhone 15 Pro Max')
        cy.get('.itbms-model').should('have.value','iPhone 15 Pro Max')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it('should click the Cancel button and the sale item should show "iPhone 15 Pro Max".',()=>{
        cy.get('.itbms-model').contains('iPhone 15 Pro Max').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-model').clear().type('iPhone 15 Pro Max (2023)').blur()

        cy.get('.itbms-model').clear().type('iPhone 15 Pro Max')
        cy.get('.itbms-model').should('have.value','iPhone 15 Pro Max')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-cancel-button').as('cancel') ;
        cy.get('@cancel').click()
        cy.wait(100)
    
        cy.get('.itbms-model').contains('iPhone 15 Pro Max')
    })

})