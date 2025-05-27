describe(`TC-FE-PBI13-VALIDATE-INPUT-FE-BASIC-5\n 
    Test Scenario : failed - add brand with invalid data`, () => {

    let resource = '/sale-items/list'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`[Step 1] Open the sale item list page at ${resource}`, () => {
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

    it('[Step 2] should have Add Brand button and click to open a page for entry new brand details',()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-add-button').as('add') ;
        cy.get('@add').click()
        cy.wait(100)
    })

    it('should have save button and the button is disabled',()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-add-button').as('add') ;
        cy.get('@add').click()
        cy.wait(100)

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })
    })

    it(`[Step 2.1] should disable the save button after adding "     ITBangmod-KMUTT-TH-Innovations!     " for Brand name.\n
        should show an error message "Brand name must be 1-30 characters long."`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-add-button').as('add') ;
        cy.get('@add').click()
        cy.wait(100)

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-name').type('     ITBangmod-KMUTT-TH-Innovations!     ')
        cy.get('.itbms-countryOfOrigin').type('T')
        cy.get('.itbms-isActive').check()
        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-message').should('contain','Brand name must be 1-30 characters long.')
    })

    it(`[Step 2.2] should disable the save button after adding "I" for Brand name.\n
        should show an error message "Brand name must be 1-30 characters long."`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-add-button').as('add') ;
        cy.get('@add').click()
        cy.wait(100)

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-name').type('I')
        cy.get('.itbms-countryOfOrigin').type('     อาณาจักรนิรันดรภูผาสุวรรณภูมิดินแดนแห่งมณีเลอค่า และวัฒนธรรมอันรุ่งเรืองเปี่ยมสุข     ')
        cy.get('.itbms-countryOfOrigin').blur()
        cy.get('.itbms-isActive').check()
        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-message').should('contain','Brand country of origin must be 1-80 characters long or not specified.')
    })

    it(`[Step 2.3] should disable the save button after adding "I" for Brand name.\n
        should show an error message "Brand URL must be a valid URL or not specified."`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-add-button').as('add') ;
        cy.get('@add').click()
        cy.wait(100)

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-name').type('I')
        cy.get('.itbms-countryOfOrigin').type('T')
        cy.get('.itbms-websiteUrl').type('     https     ')
        cy.get('.itbms-websiteUrl').blur()
        cy.get('.itbms-isActive').check()
        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-message').should('contain','Brand URL must be a valid URL or not specified.')
    })

})