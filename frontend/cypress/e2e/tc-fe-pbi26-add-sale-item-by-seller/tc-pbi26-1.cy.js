describe(`TC-FE-PB26-ADD-SALE-ITEM-BY-SELLER-1\n 
    Test Scenario : normal - seller(td-3)\n
                           - all fields
                           - save the action`, () => {

    let resource = '/signin'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;

        cy.get('.itbms-email').as('email') ;
        cy.get('@email').type('itbkk.somsuan@ad.sit.kmutt.ac.th') ;
        cy.get('.itbms-password').as('password') ;
        cy.get('@password').type('itProj24*SOM') ;
        cy.get('.itbms-signin-button').as('submit') ;
        cy.get('@submit').click() ;
        cy.wait(100)

        cy.on('window:alert', (text) => {
            expect(text).to.contains('The user account has been successfully logged in.')
        })
        cy.wait(200) ;

        cy.url().should('include', '/sale-items/list') ;
    }) ;

    it(`[step 1] Open the Sign In page at ${resource}.\n
        should display a sale-items list page.`, () => {
    })

    it(`should show the sale-items list owned by the current logged-in seller.\n
        should contains 30 sale items or 3 pages.`,()=>{
        cy.get('.itbms-row').should('have.length.above',0)
        cy.get('body').then($body => {
            const rowCount = $body.find('.itbms-row').length ;
            const page2 = $body.find('.itbms-page-2').length>0 ;
            expect(rowCount === 30 || page2).to.be.true ;
        }) ;
    })

    it(`[step 2] should have "Add Sale Item" button and click to open the page for entry new sale item.\n
        should have save button and the button is disabled.\n
        [step 3] should add data from  SALE_ITEMS_SELLER_ADD (td-1)\n
        should enable the "Save" button.\n
        [step 4] should click the "Save" button.\n
        should show the message "The sale item has been successfully added."\n
        should show the new sale item in the sale-items list page
        []`,()=>{

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Apple') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('iPhone 17 Pro Max') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('48900') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('iPhone ที่ทรงพลังที่สุดเท่าที่เคยมีมา โดยมาพร้อมจอภาพขนาด 6.9 นิ้วที่สวยสด ดีไซน์แบบอะลูมิเนียมชิ้นเดียว ชิป A19 Pro กล้องหลัง 48MP ทั้งหมด และแบตเตอรี่ที่ใช้งานได้นานที่สุดเท่าที่เคยมีมา') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('10') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('12') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('6.9') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('256') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('Cosmic Orange') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').click({force:true}) ;
        cy.wait(100)

        cy.get('.itbms-message').contains('The sale item has been successfully added.')

        cy.url().should('contain','/sale-items/list') ;
    })

    it(`[step 5] should show the sale-items list page with 31 items or 4 pages.\n
        should have the item 'Apple, iPhone 17 Pro Max'.`,()=>{
        cy.get('.itbms-row').should('have.length.above',0)
        cy.get('body').then($body => {
            const rowCount = $body.find('.itbms-row').length ;
            const page3 = $body.find('.itbms-page-3').length>0 ;
            expect(rowCount === 31 || page3).to.be.true ;
        }) ;

        cy.get('body').then($body => {
            const rowCount = $body.find('.itbms-row').length ;
            if(rowCount>30){
                cy.contains('.itbms-model','iPhone 17 Pro Max').should('exist').as('newItem') ;
                cy.get('@newItem').parent().contains('.itbms-brand','Apple')
                cy.get('@newItem').parent().contains('.itbms-ramGb','12')
                cy.get('@newItem').parent().contains('.itbms-storageGb','256')
                cy.get('@newItem').parent().contains('.itbms-color','Cosmic Orange')
                cy.get('@newItem').parent().contains('.itbms-price','48,900')
            }else{
                cy.get('.itbms-page-3').should('exist').click() ;
                cy.wait(100) ;
                cy.contains('.itbms-model','iPhone 17 Pro Max').should('exist').as('newItem') ;
                cy.get('@newItem').parent().contains('.itbms-brand','Apple')
                cy.get('@newItem').parent().contains('.itbms-ramGb','12')
                cy.get('@newItem').parent().contains('.itbms-storageGb','256')
                cy.get('@newItem').parent().contains('.itbms-color','Cosmic Orange')
                cy.get('@newItem').parent().contains('.itbms-price','48,900') ;
            }
        }) ;
    })

})