describe(`TC-FE-PB24-BUYER-SELLER-PROFILE-4\n 
    Test Scenario : normal - seller\n
                           - view and edit the profile\n
                           - cancel the action`, () => {

    let resource = '/signin'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;

        cy.get('.itbms-email').as('email') ;
        cy.get('@email').type('itbkk.somsak@ad.sit.kmutt.ac.th') ;
        cy.get('.itbms-password').as('password') ;
        cy.get('@password').type('itProj24*SOM') ;
        cy.get('.itbms-signin-button').as('submit') ;
        cy.get('@submit').click() ;
        cy.wait(100)

        cy.on('window:alert', (text) => {
            expect(text).to.contains('The user account has been successfully logged in.')
        })
        cy.wait(200) ;
    }) ;

    it(`[step 1,2] Open the Sign In page at ${resource}`, () => {
    })

    it(`[step 3] should have "Profile" button and click to open the profile page.\n
        should show the profile data: nickname, email, fullname and account type.\n
        should have "Edit Profile" button".\n`,()=>{
        cy.visit('/profile') ;  
        cy.wait(100) ;

        cy.contains('.itbms-nickname','Somsak') ;
        cy.contains('.itbms-email','itbkk.somsak@ad.sit.kmutt.ac.th') ;
        cy.contains('.itbms-fullname','Somsak Saksit') ;
        cy.contains('.itbms-type','Seller') ;
        cy.contains('.itbms-mobile','xxxxxx901x') ;
        cy.contains('.itbms-bankAccount','xxxxxx678x') ;
        cy.contains('.itbms-bankName','Bangkok Bank') ;
        cy.get('.itbms-profile-button').should('exist');
    })


    it(`[step 4] should click the "Edit Profile" button.\n
        should disable the email input field.\n
        should disable the "Save" button.\n
        [step 5] should change nickname and fullname.\n
        should enable the "Save" button.
        should click the "Cancel" button`,()=>{
        cy.visit('/profile') ;  
        cy.wait(100) ;

        cy.get('.itbms-profile-button').should('exist').as('editProfileButton');
        cy.get('@editProfileButton').click();
        cy.wait(100) ;

        cy.get('input.itbms-nickname').should('have.value','Somsak') ;
        cy.get('input.itbms-email').should('have.value','itbkk.somsak@ad.sit.kmutt.ac.th')
        cy.get('input.itbms-fullname').should('have.value','Somsak Saksit')   ;
        cy.get('input.itbms-mobile').should('have.value','xxxxxx901x') ; 
        cy.get('input.itbms-bankAccount').should('have.value','xxxxxx678x') ;
        cy.get('input.itbms-bankName').should('have.value','Bangkok Bank') ;

        cy.get('input.itbms-email').should('exist').as('emailInput');
        cy.get('@emailInput').should(($input) => {
            expect($input.is(':disabled') || $input.is('[readonly]')).to.be.true
        });

        cy.get('input.itbms-mobile').should('exist').as('mobileInput');
        cy.get('@mobileInput').should(($input) => {
            expect($input.is(':disabled') || $input.is('[readonly]')).to.be.true
        });

        cy.get('input.itbms-bankAccount').should('exist').as('bankAccountInput');
        cy.get('@bankAccountInput').should(($input) => {
            expect($input.is(':disabled') || $input.is('[readonly]')).to.be.true
        });

        cy.get('input.itbms-bankName').should('exist').as('bankNameInput');
        cy.get('@bankNameInput').should(($input) => {
            expect($input.is(':disabled') || $input.is('[readonly]')).to.be.true
        });

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('input.itbms-nickname').as('nicknameInput') ;
        cy.get('@nicknameInput').clear().type('Saksit') ;

        cy.get('input.itbms-fullname').as('fullnameInput') ;
        cy.get('@fullnameInput').clear().type('Saksit Somsak') ;  

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('.itbms-cancel-button').as('cancel') ;
        cy.get('@cancel').click();
        cy.wait(100) ;
    })

    it(`[step 6] should redirect to the profile page after canceling the edit.\n
        should not change the profile data.`,()=>{
        // cy.get('.itbms-profile').should('exist').as('profileButton'); 
        // cy.get('@profileButton').click();
        // cy.wait(100)
        cy.visit('/profile') ;  
        cy.wait(100) ;

        cy.contains('.itbms-nickname','Somsak') ;
        cy.contains('.itbms-email','itbkk.somsak@ad.sit.kmutt.ac.th') ;
        cy.contains('.itbms-fullname','Somsak Saksit') ;
        cy.contains('.itbms-type','Seller') ;
        cy.contains('.itbms-mobile','xxxxxx901x') ;
        cy.contains('.itbms-bankAccount','xxxxxx678x') ;
        cy.contains('.itbms-bankName','Bangkok Bank') ;
        cy.get('.itbms-profile-button').should('exist');
    })
})