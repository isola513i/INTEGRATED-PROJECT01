describe(`TC-FE-PBI7-EDIT-BRAND-2\n 
    Test Scenario : normal - optional fields\n
                           - sale item with the updated brand`, () => {

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

    it(`should have "Infinix" brand with "Edit" button\n
        should show a form when clicking the "Edit" of the "Infinix" brand.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Infinix').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)
    })

    it(`should enable the save button when changing the brand details.
        should redirect the previous page when clicking the save button.
        should show a message "The brand has been updated.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Infinix').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-name').clear().type('Infinix (2025)')
        cy.get('.itbms-countryOfOrigin').clear()
        cy.get('.itbms-websiteUrl').clear()

        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-save-button').click()
        cy.wait(100)

        cy.url().should('contain','/brands')
        cy.get('.itbms-message').contains('The brand has been updated.')
        cy.get('.itbms-name').filter((_, el) => el.textContent.trim() === "Infinix (2025)").should("exist");

    })

    it(`should have "Infinix (2025)" brand with "Edit" button\n
        should contain the "Infinix (2025)" brand with modifined values.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Infinix').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-name').should("have.value",'Infinix (2025)')
        cy.get('.itbms-countryOfOrigin').should("have.value",'')
        cy.get('.itbms-websiteUrl').should("have.value",'')
        cy.get('.itbms-isActive').should('be.checked')
    }) 
    
    it('should have brand "Infinix (2025)" of the model "Note 50 Pro+".',()=>{
        cy.get('.itbms-model').contains('Note 50 Pro+').should('exist').as('saleItem') 
        cy.get('@saleItem').parents('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Infinix (2025)')
        cy.get('@row').contains('.itbms-model','Note 50 Pro+')
        cy.get('@row').contains('.itbms-ramGb','8')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-color','Enchanted Purple')
        cy.get('@row').contains('.itbms-price','13,999')
    })
})