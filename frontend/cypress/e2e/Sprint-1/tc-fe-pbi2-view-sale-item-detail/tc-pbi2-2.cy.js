describe(`TC-FE-PBI2-VIEW-SALE-ITEM-DETAIL-1\n 
    Test Scenario : normal - optional fields: ramGb, storageGb, screenSizeInch, and color\n
                           - non-English characters`, () => {

    let resource = '/sale-items'

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it(`Open the 11th sale item at ${resource}/16. Each sale item contains brand, model, price, description, ramGb, storageGb, color and quantity.`,()=>{
        cy.get('.itbms-row').eq(10).as('row')
        cy.get('@row').click()

        cy.wait(100)
        cy.get('.itbms-row').as('row')
        cy.get('@row').find('.itbms-brand')
        cy.get('@row').find('.itbms-model')
        cy.get('@row').find('.itbms-price')
        cy.get('@row').find('.itbms-description')
        cy.get('@row').find('.itbms-ramGb')
        cy.get('@row').find('.itbms-storageGb')
        cy.get('@row').find('.itbms-color')
        cy.get('@row').find('.itbms-quantity')
    })

    it(`Open the 11th sale item at ${resource}/16. The sale item should be "Samsung,Galaxy S23 Ultra/-/512GB/39,600".`,()=>{
        cy.get('.itbms-row').eq(10).as('row')
        cy.get('@row').click()

        cy.wait(100)
        cy.get('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Samsung')
        cy.get('@row').contains('.itbms-model','Galaxy S23 Ultra')
        cy.get('@row').contains('.itbms-price','39,600')
        cy.get('@row').contains('.itbms-description','Samsung Galaxy S23 Ultra 512GB สีดำปีศาจ')
        cy.get('@row').contains('.itbms-ramGb','-')
        cy.get('@row').contains('.itbms-screenSizeInch','6.8')
        cy.get('@row').contains('.itbms-screenSizeInch-unit','Inches')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-color','-')
        cy.get('@row').contains('.itbms-quantity','6')
    })

    it(`Open the 22th sale item at ${resource}/32. The sale item should be "Xiaomi,13T Pro/12/-GB/23,100".`,()=>{
        cy.get('.itbms-row').eq(21).as('row')
        cy.get('@row').click()

        cy.wait(100)
        cy.get('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Xiaomi')
        cy.get('@row').contains('.itbms-model','13T Pro')
        cy.get('@row').contains('.itbms-price','23,100')
        cy.get('@row').contains('.itbms-description','Xiaomi 13T Pro 12/512GB สี Meadow Green')
        cy.get('@row').contains('.itbms-ramGb','12')
        cy.get('@row').contains('.itbms-ramGb-unit','GB')
        cy.get('@row').contains('.itbms-screenSizeInch','-')
        cy.get('@row').contains('.itbms-storageGb','-')
        cy.get('@row').contains('.itbms-color','Alpine Blue')
        cy.get('@row').contains('.itbms-quantity','6')
    })
})