/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT - Testes Independentes', () => {
  Cypress._.times(3, () => {
    it.only('testa a página da política de privacidade de forma independente', () => {
      cy.visit('./src/privacy.html')

      cy.contains('CAC TAT - Política de Privacidade').should('be.visible')
      cy.contains('p', 'Talking About Testing').should('be.visible')
    })
  })
})