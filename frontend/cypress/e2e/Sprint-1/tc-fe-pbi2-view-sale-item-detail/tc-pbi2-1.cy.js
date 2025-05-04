describe(`TC-FE-PBI2-VIEW-SALE-ITEM-DETAIL-1\n 
    Test Scenario : normal - all fields availab\n
                           - non-English characters`, () => {

    let resource = '/sale-items'

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`Open the sale item gallery page at ${resource}`, () => {
    })

    it(`Open the first sale item at ${resource}/1. Each sale item contains brand, model, price, description, ramGb, storageGb, color and quantity.`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
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

    it(`Open the first sale item at ${resource}/1. The sale item should be "Apple,iPhone 14 Pro Max/6/512GB/42,900".`,()=>{
        cy.get('.itbms-row').eq(0).as('row')
        cy.get('@row').click()

        cy.wait(100)
        cy.get('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 14 Pro Max')
        cy.get('@row').contains('.itbms-price','42,900')
        cy.get('@row').contains('.itbms-description','ไอโฟนเรือธงรุ่นล่าสุด มาพร้อม Dynamic Island จอใหญ่สุดในตระกูล กล้องระดับโปร')
        cy.get('@row').contains('.itbms-ramGb','6')
        cy.get('@row').contains('.itbms-ramGb-unit','GB')
        cy.get('@row').contains('.itbms-screenSizeInch','6.7')
        cy.get('@row').contains('.itbms-screenSizeInch-unit','Inches')
        cy.get('@row').contains('.itbms-storageGb','512')
        cy.get('@row').contains('.itbms-storageGb-unit','GB')
        cy.get('@row').contains('.itbms-color','Space Black')
        cy.get('@row').contains('.itbms-quantity','5')
    })
})