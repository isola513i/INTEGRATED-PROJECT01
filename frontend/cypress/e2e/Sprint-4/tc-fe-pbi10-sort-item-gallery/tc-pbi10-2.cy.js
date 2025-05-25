describe(`TC-FE-PBI10-SORT-SALE-ITEM-GALLERY-BY-BRAND-2\n 
    Test Scenario : normal - normal - sort setting persitence`, () => {

    let resource = '/sale-items'

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it('The sale item table has sale items.',()=>{
        cy.get('.itbms-row').should('have.length.greaterThan',0)
    })

    it('Each sale item contains brand, model, ramGb, storageGb, and price.',()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').find('.itbms-brand')
        cy.get('@row').find('.itbms-model')
        cy.get('@row').find('.itbms-ramGb')
        cy.get('@row').find('.itbms-storageGb')
        cy.get('@row').find('.itbms-price')
    })

    it(`First sale item at ${resource}/1 should be "Xiaomi,13 Pro/12/256GB/33,000".\n
        should show sale items sorted by brand in decending order after refresh sale item galler page.\n
        should show manage brand page at /brands\n
        should show sale items sorted by brand in decending order after navigating back to sale item galler page.\n`,()=>{
        cy.get('.itbms-brand-desc').should('exist').as('brand-desc')
        cy.get('@brand-desc').click()
        cy.wait(100)
        
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Xiaomi')
        cy.get('@row').contains('.itbms-model','13 Pro')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','33,000')

        cy.reload()
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Xiaomi')
        cy.get('@row').contains('.itbms-model','13 Pro')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','33,000')

        cy.visit('/brands')
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').find('.itbms-id')
        cy.get('@row').find('.itbms-name')

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-id','1')
        cy.get('@row').contains('.itbms-name','Samsung')

        cy.get('.itbms-row').eq(1).as('row')
        cy.get('@row').contains('.itbms-id','2')
        cy.get('@row').contains('.itbms-name','Apple')

        cy.visit(resource)
        cy.wait(100)

        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Xiaomi')
        cy.get('@row').contains('.itbms-model','13 Pro')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-storageGb','256')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','33,000')
    })

    it(`Open sale item gallery page at /sale-items.\n 
        First sale item at ${resource}/1 should be "Apple,iPhone 14 Pro Max/6/512GB/42,900".`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 14 Pro Max')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-price','42,900')
    })

})