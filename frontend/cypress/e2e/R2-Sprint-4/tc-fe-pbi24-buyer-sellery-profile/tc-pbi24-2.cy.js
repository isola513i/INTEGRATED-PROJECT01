describe(`TC-FE-PB24-BUYER-SELLER-PROFILE-2\n 
    Test Scenario : normal - buyer\n
                           - view and edit the profile\n
                           - save the action`, () => {

    let resource = '/signin'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;

        cy.get('.itbms-email').as('email') ;
        cy.get('@email').type('itbkk.somchai@ad.sit.kmutt.ac.th') ;
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
        // cy.get('.itbms-profile').should('exist').as('profileButton'); 
        // cy.get('@profileButton').click();
        // cy.wait(100)
        cy.visit('/profile') ;  
        cy.wait(100) ;

        cy.contains('.itbms-nickname','Somchai') ;
        cy.contains('.itbms-email','itbkk.somchai@ad.sit.kmutt.ac.th') ;
        cy.contains('.itbms-fullname','Somchai Jaidee') ;
        cy.contains('.itbms-type','Buyer') ;
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

        cy.get('input.itbms-nickname').should('have.value','Somchai') ;
        cy.get('input.itbms-email').should('have.value','itbkk.somchai@ad.sit.kmutt.ac.th')
        cy.get('input.itbms-fullname').should('have.value','Somchai Jaidee')   ;

        cy.get('.itbms-email').should('exist').as('emailInput');
        cy.get('@emailInput').should(($input) => {
            expect($input.is(':disabled') || $input.is('[readonly]')).to.be.true
        });

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.true
        })

        cy.get('input.itbms-nickname').as('nicknameInput') ;
        cy.get('@nicknameInput').clear().type('Jaidee') ;

        cy.get('input.itbms-fullname').as('fullnameInput') ;
        cy.get('@fullnameInput').clear().type('Jaidee Somchai') ;  

        cy.get('.itbms-save-button').as('save') ;
        cy.get('@save').should(($btn)=>{
            expect($btn.is(':disabled') || $btn.hasClass('disabled')).to.be.false
        })

        cy.get('@save').click();
        cy.wait(100) ;
    })

    it(`[step 6] should redirect to the profile page after canceling the edit.\n
        should change the profile data: Nickname -> Jaidee, Fullname -> Jaidee Somchai.`,()=>{
        // cy.get('.itbms-profile').should('exist').as('profileButton'); 
        // cy.get('@profileButton').click();
        // cy.wait(100)
        cy.visit('/profile') ;  
        cy.wait(100) ;

        cy.contains('.itbms-nickname','Jaidee') ;
        cy.contains('.itbms-email','itbkk.somchai@ad.sit.kmutt.ac.th') ;
        cy.contains('.itbms-fullname','Jaidee Somchai') ;
        cy.contains('.itbms-type','Buyer') ;
        cy.get('.itbms-profile-button').should('exist');
    })
})