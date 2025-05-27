describe(`TC-FE-PBI13-VALIDATE-INPUT-FE-BASIC-1\n 
    Test Scenario : normal - add sale item with valid data\n
                           - compulsory field only
                           - min boundary case
                           - max boundary case with leading/trailing whitespaces`, () => {
    
    let resource = '/sale-items'
    let baseAPI = Cypress.config('baseAPI')

    let lastSaleItemId 

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it(`[Step 1] Open the sale item gallery page at ${resource}`, () => {
    })

    it(`[Step 2] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-1).\n
        should enable "Save" without the error message.
        [Step 3] should add the sale item successfully.`,()=>{
        cy.intercept('POST', `${baseAPI}/v1/**`).as('saveRequest') ;

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('OnePlus') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('OnePlus 13') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('57900') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('     Snapdragon® 8 Elite | Snapshot photography with Clear Burst | AI-powered OxygenOS 15     ') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('10000') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('@save').click({force:true}) ;
        cy.wait(100) ;

        cy.wait('@saveRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(201)
            lastSaleItemId = response.body.id
        })        
    })

    it(`[Step 4] should show and contain the recend added sale item SALE_ITEMS_VALIDATION (td-1).\n
        [Step 5] should delete the recent added sale item SALE_ITEMS_VALIDATION (td-1).`,()=>{
        cy.intercept('DELETE', `${baseAPI}/v1/**`).as('deleteRequest') ;

        cy.visit(`${resource}/${lastSaleItemId}`) ;
        cy.wait(100) ;

        cy.get('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','OnePlus')
        cy.get('@row').contains('.itbms-model','OnePlus 13')
        cy.get('@row').contains('.itbms-price','57,900')
        cy.get('@row').contains('.itbms-description','Snapdragon® 8 Elite | Snapshot photography with Clear Burst | AI-powered OxygenOS 15')
        cy.get('@row').contains('.itbms-ramGb','-')
        cy.get('@row').contains('.itbms-screenSizeInch','-')
        cy.get('@row').contains('.itbms-storageGb','-')
        cy.get('@row').contains('.itbms-color','-')
        cy.get('@row').contains('.itbms-quantity','10000')

        cy.get('@row').find('.itbms-delete-button').as('delete')
        cy.get('@delete').click()
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete this sale item?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;

        cy.wait('@deleteRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(204)
        })
        cy.wait(100)
    })

    it(`[Step 6] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-2).\n
        should enable "Save" without the error message.
        [Step 7] should add the sale item successfully.`,()=>{
        cy.intercept('POST', `${baseAPI}/v1/**`).as('saveRequest') ;

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Xiaomi') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('1') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('0') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type('A') ;

        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('1') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('0.01') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('1') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('B') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('0') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('@save').click({force:true}) ;
        cy.wait(100) ;

        cy.wait('@saveRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(201)
            lastSaleItemId = response.body.id
        })        
    })

    it(`[Step 8] should show and contain the recend added sale item SALE_ITEMS_VALIDATION (td-2).\n
        [Step 9] should delete the recent added sale item SALE_ITEMS_VALIDATION (td-2).`,()=>{
        cy.intercept('DELETE', `${baseAPI}/v1/**`).as('deleteRequest') ;

        cy.visit(`${resource}/${lastSaleItemId}`) ;
        cy.wait(100) ;

        cy.get('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Xiaomi')
        cy.get('@row').contains('.itbms-model','1')
        cy.get('@row').contains('.itbms-price','0')
        cy.get('@row').contains('.itbms-description','A')
        cy.get('@row').contains('.itbms-ramGb','1')
        cy.get('@row').contains('.itbms-screenSizeInch','0.01')
        cy.get('@row').contains('.itbms-storageGb','1')
        cy.get('@row').contains('.itbms-color','B')
        cy.get('@row').contains('.itbms-quantity','0')

        cy.get('@row').find('.itbms-delete-button').as('delete')
        cy.get('@delete').click()
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete this sale item?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;

        cy.wait('@deleteRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(204)
        })
        cy.wait(100)
    })

    it(`[Step 10] should have "Add Sale Item" button and click to open the page for entry new sale item\n
        shoud add from SALE_ITEMS_VALIDATION (td-3).\n
        should enable "Save" without the error message.
        [Step 11] should add the sale item successfully.`,()=>{
        cy.intercept('POST', `${baseAPI}/v1/**`).as('saveRequest') ;

        cy.get('.itbms-sale-item-add').should('exist').as('addSaleItemButton'); 
        cy.get('@addSaleItemButton').click();
        cy.wait(100)

        cy.get('.itbms-brand').as('brandSelect') ;
        cy.get('@brandSelect').select('Apple') ;

        cy.get('.itbms-model').as('modelInput') ;
        cy.get('@modelInput').type('     iPhone 16 Pro MaxUltra Hyper-Realistic ProMotion XDR Display     ') ;

        cy.get('.itbms-price').as('priceInput') ;
        cy.get('@priceInput').type('2147483647') ;

        cy.get('.itbms-description').as('descriptionInput') ;
        cy.get('@descriptionInput').type("ก้าวข้ามทุกขีดจำกัด สัมผัสอนาคตในอุ้งมือของคุณ เตรียมพบกับนิยามใหม่แห่งสมาร์ทโฟนระดับโปรที่เหนือกว่าทุกจินตนาการ ด้วย iPhone 16 Pro ที่สุดแห่งนวัตกรรมจาก Apple ที่หลอมรวมพลัง ประสิทธิภาพ และความงดงามเข้าไว้ด้วยกันอย่างลงตัว ออกแบบมาเพื่อผู้ที่ต้องการที่สุดแห่งประสบการณ์ ไม่ว่าจะเป็นการสร้างสรรค์ผลงานระดับมืออาชีพ การเล่นเกมที่สมจริง หรือการเชื่อมต่อกับโลกได้อย่างไร้รอยต่อ iPhone 16 Pro พร้อมแล้วที่จะพลิกโฉมทุกการใช้งานของคุณให้ไม่เหมือนเดิมอีกต่อไป") ;
        cy.get('.itbms-ramGb').as('ramGbInput') ;
        cy.get('@ramGbInput').type('1024') ;

        cy.get('.itbms-screenSizeInch').as('screenSizeInput') ;
        cy.get('@screenSizeInput').type('32') ;

        cy.get('.itbms-storageGb').as('storageGbInput') ;
        cy.get('@storageGbInput').type('16384') ;

        cy.get('.itbms-color').as('colorInput') ;
        cy.get('@colorInput').type('     Whispering Willow Enchanted Forest Green     ') ;

        cy.get('.itbms-quantity').as('quantityInput') ;
        cy.get('@quantityInput').type('2147483647') ;

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('@save').click({force:true}) ;
        cy.wait(100) ;

        cy.wait('@saveRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(201)
            lastSaleItemId = response.body.id
        })        
    })

    it(`[Step 12] should show and contain the recend added sale item SALE_ITEMS_VALIDATION (td-3).\n
        [Step 13] should delete the recent added sale item SALE_ITEMS_VALIDATION (td-3).`,()=>{
        cy.intercept('DELETE', `${baseAPI}/v1/**`).as('deleteRequest') ;

        cy.visit(`${resource}/${lastSaleItemId}`) ;
        cy.wait(100) ;

        cy.get('.itbms-row').as('row')
        cy.get('@row').contains('.itbms-brand','Apple')
        cy.get('@row').contains('.itbms-model','iPhone 16 Pro MaxUltra Hyper-Realistic ProMotion XDR Display')
        cy.get('@row').contains('.itbms-price','2,147,483,647')
        cy.get('@row').contains('.itbms-description',"ก้าวข้ามทุกขีดจำกัด สัมผัสอนาคตในอุ้งมือของคุณ เตรียมพบกับนิยามใหม่แห่งสมาร์ทโฟนระดับโปรที่เหนือกว่าทุกจินตนาการ ด้วย iPhone 16 Pro ที่สุดแห่งนวัตกรรมจาก Apple ที่หลอมรวมพลัง ประสิทธิภาพ และความงดงามเข้าไว้ด้วยกันอย่างลงตัว ออกแบบมาเพื่อผู้ที่ต้องการที่สุดแห่งประสบการณ์ ไม่ว่าจะเป็นการสร้างสรรค์ผลงานระดับมืออาชีพ การเล่นเกมที่สมจริง หรือการเชื่อมต่อกับโลกได้อย่างไร้รอยต่อ iPhone 16 Pro พร้อมแล้วที่จะพลิกโฉมทุกการใช้งานของคุณให้ไม่เหมือนเดิมอีกต่อไป")
        cy.get('@row').contains('.itbms-ramGb','1024')
        cy.get('@row').contains('.itbms-screenSizeInch','32')
        cy.get('@row').contains('.itbms-storageGb','16384')
        cy.get('@row').contains('.itbms-color','Whispering Willow Enchanted Forest Green')
        cy.get('@row').contains('.itbms-quantity','2147483647')

        cy.get('@row').find('.itbms-delete-button').as('delete')
        cy.get('@delete').click()
        cy.wait(100)

        cy.get('.itbms-message').should('exist') 
        cy.get('.itbms-message').should('contain.text', 'Do you want to delete this sale item?') ;
        cy.get('.itbms-cancel-button').should('exist') ;
        cy.get('.itbms-confirm-button').should('exist') ; 

        cy.get('.itbms-confirm-button').click() ;

        cy.wait('@deleteRequest').then((interception)=>{
            const response = interception.response
            expect(response.statusCode).to.equal(204)
        })
        cy.wait(100)
    })
});