# 📄 Documentação de Testes - Sublime Caixa

### Massa de Dados: Usuário de login
| Campo | Valor |
| --- | --- |
| **Usuário** | Teste |
| **Senha** | Teste123456 |

## Casos de Teste: Login

### CT001: Login Sistema de Caixa Sublime (fluxo de login com sucesso)

### **Objetivo** 
Realizar o login no sistema com sucesso.

### **Pré-condições**
1. O administrador precisa cadastrar o usuário

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de acesso do sistema. | Deve exibir uma tela com campos de usuário e senha. |
| 2 | O usuário preenche o campo "Usuário" com o valor "Teste". | - |
| 3 | O usuário preenche o campo "Senha" com o valor "Teste123456". | - |
| 4 | O usuário clica no botão "Login". | O usuário é direcionado para a página inicial do sistema. |
2. O sistema processa as informações fornecidas e realiza o login com sucesso.
3. A página inicial do sistema é a tela do caixa.

---