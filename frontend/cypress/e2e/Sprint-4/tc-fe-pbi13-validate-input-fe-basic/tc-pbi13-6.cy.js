describe(`TC-FE-PBI13-VALIDATE-INPUT-FE-BASIC-6\n 
    Test Scenario : failed - edit brand with invalid data`, () => {

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

    it(`[Step 2] should have "Samsung" brand with "Edit" button\n
        should show a form when clicking the "Edit" of the "Samsung" brand.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Samsung').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)
    })   
    
    it(`[Step 3] should change the name field to "     ".\n
        should disable "Save" button.\n
        should show an error message "Brand name must be 1-30 characters long.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Samsung').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

         cy.get('.itbms-name').clear().type('     ')
         cy.get('.itbms-name').blur() 

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-message').should('contain','Brand name must be 1-30 characters long.')
    })

    it(`[Step 4] should change the name field to "     ITBangmod-KMUTT-TH-Innovations!     ".\n
        should disable "Save" button.\n
        should show an error message "Brand name must be 1-30 characters long.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Samsung').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

         cy.get('.itbms-name').clear().type('     ITBangmod-KMUTT-TH-Innovations!     ')
         cy.get('.itbms-name').blur() 

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-message').should('contain','Brand name must be 1-30 characters long.')
    })

    it(`[Step 5] should change the name field to "    ITBangmod-KMUTT-TH-Innovations     ".\n
        should enable the save button.\n
        should not show the error message.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Samsung').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

         cy.get('.itbms-name').clear().type('    ITBangmod-KMUTT-TH-Innovations     ')
         cy.get('.itbms-name').blur() 

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-message').should('contain','Brand name must be 1-30 characters long.')
    }) 

    it(`[Step 6] should change the country of origin field to "     อาณาจักรนิรันดรภูผาสุวรรณภูมิดินแดนแห่งมณีเลอค่า และวัฒนธรรมอันรุ่งเรืองเปี่ยมสุข     ".\n
        should disable "Save" button.\n
        should show an error message "Brand name must be 1-30 characters long.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Samsung').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

         cy.get('.itbms-name').clear().type('    ITBangmod-KMUTT-TH-Innovations     ')
         cy.get('.itbms-countryOfOrigin').clear().type('     อาณาจักรนิรันดรภูผาสุวรรณภูมิดินแดนแห่งมณีเลอค่า และวัฒนธรรมอันรุ่งเรืองเปี่ยมสุข     ')
         cy.get('.itbms-countryOfOrigin').blur()

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-message').should('contain','Brand country of origin must be 1-80 characters long or not specified.')
    })

    it(`[Step 7] should change the country of origin field to "     อาณาจักรนิรันดรภูผาสุวรรณภูมิดินแดนแห่งมณีเลอค่าและวัฒนธรรมอันรุ่งเรืองเปี่ยมสุข     ".\n
        should enable the save button.\n
        should not show the error message.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Samsung').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

         cy.get('.itbms-name').clear().type('    ITBangmod-KMUTT-TH-Innovations     ')
         cy.get('.itbms-countryOfOrigin').clear().type('     อาณาจักรนิรันดรภูผาสุวรรณภูมิดินแดนแห่งมณีเลอค่าและวัฒนธรรมอันรุ่งเรืองเปี่ยมสุข     ')
         cy.get('.itbms-countryOfOrigin').blur()

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

    it(`[Step 8] should change the website URL field to "     https     ".\n
        should disable "Save" button.\n
        should show an error message "Brand name must be 1-30 characters long.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Samsung').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

        cy.get('.itbms-name').clear().type('    ITBangmod-KMUTT-TH-Innovations     ')
        cy.get('.itbms-countryOfOrigin').clear().type('     อาณาจักรนิรันดรภูผาสุวรรณภูมิดินแดนแห่งมณีเลอค่าและวัฒนธรรมอันรุ่งเรืองเปี่ยมสุข     ')
        cy.get('.itbms-websiteUrl').clear().type('     https     ')
        cy.get('.itbms-websiteUrl').blur()

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-message').should('contain','Brand URL must be a valid URL or not specified')
    })

    it(`[Step 9] should change the website URL  field to "".\n
        should enable the save button.\n
        should not show the error message.`,()=>{
        cy.get('.itbms-manage-brand').should('exist').as('manageBrand'); 
        cy.get('@manageBrand').click();
        cy.wait(100)

        cy.get('.itbms-name').contains('Samsung').should('exist').as('brand') 
        cy.get('@brand').parents('.itbms-row').as('row')
        cy.get('@row').find('.itbms-edit-button').as('edit')
        cy.get('@edit').click()
        cy.wait(100)

         cy.get('.itbms-name').clear().type('    ITBangmod-KMUTT-TH-Innovations     ')
         cy.get('.itbms-countryOfOrigin').clear().type('     อาณาจักรนิรันดรภูผาสุวรรณภูมิดินแดนแห่งมณีเลอค่าและวัฒนธรรมอันรุ่งเรืองเปี่ยมสุข     ')
         cy.get('.itbms-websiteUrl').clear().blur()

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })
    })

})