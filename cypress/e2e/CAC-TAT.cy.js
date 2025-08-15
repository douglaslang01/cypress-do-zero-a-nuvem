/// <reference types="Cypress" />

const { faker } = require('@faker-js/faker');

describe('Central de Atendimento ao Cliente TAT', () => {
  const data = { }

  beforeEach(() => { 
    cy.visit('./src/index.html')

    data.firstName = faker.person.firstName()
    data.lastName = faker.person.lastName()
    data.email = faker.internet.email(data.firstName, data.lastName)
    data.phone = faker.phone.number('##########') // Gera um número de telefone com 10 dígitos
    data.message = faker.lorem.paragraphs(3, '\n', { min: 20, max: 100 }) // Gera um parágrafo com entre 20 e 100 caracteres}) 
  })
   
  it('verifica o título da aplicação', () => {
      cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    ///const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    const longText = Cypress._.repeat('0123456789', 20)
    
    cy.clock()

    cy.get('#firstName').type('João')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('joao.silva@exemplo.com')
    cy.get('#open-text-area').type(longText, { delay: 0})

    cy.contains('button', 'Enviar').click()
    
    cy.get('.success')
      .should('be.visible')

    cy.tick(3000)

    cy.get('.success')
      .should('not.be.visible')

  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('João')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('joao.silva@exemplo,com')
    cy.get('#open-text-area').type('Mensagem de teste')

    cy.contains('button', 'Enviar').click()

    cy.get('.error')
      .should('be.visible')
  })

  it('campo telefone continua vazio quando preenchido com valor não numérico', () => {
    cy.get('#phone')
      .type('abcdefghij')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('João')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('joao.silva@exemplo.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Mensagem de teste')
    
    cy.get('button[type="submit"]')
      .click()

    cy.get('.error')
      .should('be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .as('inputFirstName')
      .type('João')

    cy.get('@inputFirstName').should('have.value', 'João')
    cy.get('@inputFirstName').clear()
    cy.get('@inputFirstName').should('have.value', '')

    cy.get('#lastName')
      .as('inputLastName')
      .type('Silva')
    cy.get('@inputLastName').should('have.value', 'Silva')
    cy.get('@inputLastName').clear()
    cy.get('@inputLastName').should('have.value', '')

    cy.get('#email')
      .as('inputEmail')
      .type('joao.silva@exemplo.com')
    cy.get('@inputEmail').should('have.value', 'joao.silva@exemplo.com')
    cy.get('@inputEmail').clear()
    cy.get('@inputEmail').should('have.value', '')

    cy.get('#phone')
      .as('inputPhone')
      .type('1234567890')

    cy.get('@inputPhone').should('have.value', '1234567890')
    cy.get('@inputPhone').clear()
    cy.get('@inputPhone').should('have.value', '')
  })
  
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.get('button[type="submit"]')
      .click()

    cy.get('.error')
      .should('be.visible')
  })

  it('envia o formulário com sucesso usando um comando customizado', () => {
    
    cy.clock()
    
    cy.fillMandatoryFieldsAndSubmit(data)

    cy.get('.success').should('be.visible')

    cy.tick(3000)
    
    cy.get('.success').should('not.be.visible')
  })

  
  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })  

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each((typeOfService) => {
        cy.wrap(typeOfService)
          .check()
          .should('be.checked')
      })
  })


  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .as('checkboxes')
      .check()
      .should('be.checked')

    cy.get('@checkboxes')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should((input) => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
      .should((input) => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {  
    cy.fixture('example.json').as('sampleFile')

    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('@sampleFile')
      .should((input) => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'href', 'privacy.html')
      .and('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('CAC TAT - Política de Privacidade').should('be.visible')
  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')

    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche a área de texto usando o comando invoke', () => {
    const longText = Cypress._.repeat('0123456789', 20)

    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText)
  })

  it('faz uma requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .as('getRequest')
      .its('status')
      .should('equal', 200)

    cy.get('@getRequest')
      .its('statusText')
      .should('equal', 'OK')  

    cy.get('@getRequest')
      .its('body')
      .should('include', 'CAC TAT')
  })

  it.only('encontra o gato escondido', () => {
    cy.get('#cat')
    .invoke('show')
    .should('be.visible')
    
    cy.get('#title')
      .invoke('text', 'CAT TAT')
  })

})