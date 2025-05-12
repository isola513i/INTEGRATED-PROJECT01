describe(`TC-FE-PBI4-ADD-SALE-ITEM-2\n 
    Test Scenario : normal - all fields`, () => {

    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it('should have the new sale item in the sale item gallery',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Samsung')
        cy.get('@row').contains('.itbms-ramGb','-')
        cy.get('@row').contains('.itbms-storageGb','-')
        cy.get('@row').contains('.itbms-price','44,900')
    })

    it('should have the new sale item in the sale item gallery and should have the detail of the new sale item',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('Samsung')
        cy.get('.itbms-model').contains('Galaxy S25 Ultra')
        cy.get('.itbms-price').contains('44,900')
        cy.get('.itbms-description').contains('ระบบปฎิบัติการ Android 15 One UI 7.0 กล้องหน้า 12MP กล้องหลัง UW50+W200+Tele 10+periscope telephoto 50')
        cy.get('.itbms-ramGb').contains('-')
        cy.get('.itbms-screenSizeInch').contains('-')
        cy.get('.itbms-storageGb').contains('-')
        cy.get('.itbms-color').contains('-')
        cy.get('.itbms-quantity').contains('10')
    })

    it('should have edit button and the button is enabled',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should show the form with the current sale detail. All fields are editable. The save button is disabled',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-brand').contains('Samsung')
        cy.get('input.itbms-model').should('have.value','Galaxy S25 Ultra')
        cy.get('input.itbms-price').should('have.value','44900')
        cy.get('textarea.itbms-description').should('have.value','ระบบปฎิบัติการ Android 15 One UI 7.0 กล้องหน้า 12MP กล้องหลัง UW50+W200+Tele 10+periscope telephoto 50')
        cy.get('input.itbms-ramGb').should('have.value','')
        cy.get('input.itbms-screenSizeInch').should('have.value','')
        cy.get('input.itbms-storageGb').should('have.value','')
        cy.get('input.itbms-color').should('have.value','')
        cy.get('input.itbms-quantity').should('have.value','10')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it('should modify the sale item and the save button should be enabled.',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('input.itbms-model').clear().type('Galaxy S25 Ultra (2025)')
        cy.get('input.itbms-price').clear().type('46900')
        cy.get('textarea.itbms-description').clear().type('ระบบปฎิบัติการ Android 15 One UI 7.0 กล้องหน้า 12MP กล้องหลัง UW50+W200+Tele 10+periscope telephoto 50 หน้าจอ Dyanmic AMOLED 2X')
        cy.get('input.itbms-ramGb').clear().type('12')
        cy.get('input.itbms-screenSizeInch').clear().type('6.9')
        cy.get('input.itbms-storageGb').clear().type('256')
        cy.get('input.itbms-color').clear().type('Titanium Blue')
        cy.get('input.itbms-quantity').clear().type('15')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it('should save the modified sale item and redirect to the previous page with the message "The sale item has been updated. \n should have the home button and should redirect to the sale item gallery page when the button is clicked."',()=>{
        cy.get('.itbms-model').contains('Galaxy S25 Ultra').should('exist').as('newSaleItem') 
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').click()
        cy.wait(100)

        cy.get('.itbms-edit-button').as('edit') ;
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('input.itbms-model').clear().type('Galaxy S25 Ultra (2025)')
        cy.get('input.itbms-price').clear().type('46900')
        cy.get('textarea.itbms-description').clear().type('ระบบปฎิบัติการ Android 15 One UI 7.0 กล้องหน้า 12MP กล้องหลัง UW50+W200+Tele 10+periscope telephoto 50 หน้าจอ Dyanmic AMOLED 2X')
        cy.get('input.itbms-ramGb').clear().type('12')
        cy.get('input.itbms-screenSizeInch').clear().type('6.9')
        cy.get('input.itbms-storageGb').clear().type('256')
        cy.get('input.itbms-color').clear().type('Titanium Blue')
        cy.get('input.itbms-quantity').clear().type('15')

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').click({force:true})
        cy.wait(100)

        cy.get('.itbms-message').contains('The sale item has been updated.').should('exist')
        cy.url().should('include', '/sale-items')
        cy.get('.itbms-model').contains('Galaxy S25 Ultra (2025)')
        cy.get('.itbms-price').contains('46,900')
        cy.get('.itbms-description').contains('ระบบปฎิบัติการ Android 15 One UI 7.0 กล้องหน้า 12MP กล้องหลัง UW50+W200+Tele 10+periscope telephoto 50 หน้าจอ Dyanmic AMOLED 2X')
        cy.get('.itbms-ramGb').contains('12')
        cy.get('.itbms-screenSizeInch').contains('6.9')
        cy.get('.itbms-storageGb').contains('256')
        cy.get('.itbms-color').contains('Titanium Blue')
        cy.get('.itbms-quantity').contains('15')

        cy.get('.itbms-home-button').as('home') ;
        cy.get('@home').click()
        cy.wait(100)
        cy.url().should('include', '/sale-items')
        cy.get('.itbms-model').contains('Galaxy S25 Ultra (2025)').should('exist').as('newSaleItem')
        cy.get('@newSaleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Samsung')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-price','46,900')
    })

})