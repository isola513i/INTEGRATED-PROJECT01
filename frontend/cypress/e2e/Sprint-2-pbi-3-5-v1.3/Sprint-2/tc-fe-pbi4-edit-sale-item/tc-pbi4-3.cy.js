describe(`TC-FE-PBI4-ADD-SALE-ITEM-2\n 
    Test Scenario : normal - optional fields`, () => {

    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it('should have the new sale item in the sale item gallery',()=>{
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','OPPO')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','128')
        cy.get('@row').contains('.itbms-price','7,999')
    })

    it('should have the new sale item in the sale item gallery and should have the detail of the new sale item',()=>{
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('OPPO')
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G')
        cy.get('.itbms-price').contains('7,999')
        cy.get('.itbms-description').contains('ระบบปฎิบัติการ Android 15 รองรับ 2 ซิม')
        cy.get('.itbms-ramGb').contains('6')
        cy.get('.itbms-screenSizeInch').contains('6.7')
        cy.get('.itbms-storageGb').contains('128')
        cy.get('.itbms-storageGb-unit').contains('GB')
        cy.get('.itbms-color').contains('Pink') 
        cy.get('.itbms-quantity').contains('12')
    })

    it('should have edit button and the button is enabled',()=>{
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should show the form with the current sale detail. All fields are editable. The save button is disabled',()=>{
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('OPPO')
        cy.get('.itbms-model').should('have.value','1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G')
        cy.get('.itbms-price').should('have.value','7999')
        cy.get('.itbms-description').should('have.value','ระบบปฎิบัติการ Android 15 รองรับ 2 ซิม')
        cy.get('.itbms-ramGb').should('have.value','6')
        cy.get('.itbms-screenSizeInch').should('have.value','6.7')
        cy.get('.itbms-storageGb').should('have.value','128') 
        cy.get('.itbms-color').should('have.value','Pink')
        cy.get('.itbms-quantity').should('have.value','12')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it('should modify the sale item and the save button should be enabled.',()=>{
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('input.itbms-ramGb').clear()
        cy.get('input.itbms-screenSizeInch').clear()
        cy.get('input.itbms-storageGb').clear()
        cy.get('input.itbms-color').clear()

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should save the modified sale item and redirect to the previous page with the message "The sale item has been updated. \n should have the home button and should redirect to the sale item gallery page when the button is clicked."',()=>{
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('input.itbms-ramGb').clear()
        cy.get('input.itbms-screenSizeInch').clear()
        cy.get('input.itbms-storageGb').clear()
        cy.get('input.itbms-color').clear()

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').click({force:true})
        cy.wait(100)

        cy.get('.itbms-message').contains('The sale item has been updated.').should('exist')
        cy.url().should('include', '/sale-items')
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G')
        cy.get('.itbms-brand').contains('OPPO')
        cy.get('.itbms-price').contains('7,999')
        cy.get('.itbms-description').contains('ระบบปฎิบัติการ Android 15 รองรับ 2 ซิม')
        cy.get('.itbms-ramGb').contains('-')
        cy.get('.itbms-screenSizeInch').contains('-')
        cy.get('.itbms-storageGb').contains('-')
        cy.get('.itbms-color').contains('-')
        cy.get('.itbms-quantity').contains('12')

        cy.get('.itbms-home-button').as('home') ;
        cy.get('@home').click()
        cy.wait(100)
        cy.url().should('include', '/sale-items')
        cy.get('.itbms-model').contains('1AR Pro 5G2AR Pro 5G3AR Pro 5G4AR Pro 5G5AR Pro 5G6AR Pro 5G').should('exist').as('newSaleItem')
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','OPPO')
        cy.get('@row').contains('.itbms-ramGb','-')
        cy.get('@row').contains('.itbms-storageGb','-')
        cy.get('@row').contains('.itbms-price','7,999')
    })

})