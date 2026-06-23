## 📝 **Plano de Testes - Sublime Caixa**

### 📌 1. **Identificação**

* **Nome do Projeto**: Sublime Caixa - Sistema de Gestão de Caixa, Estoque e Clientes
* **Versão Avaliada**: v1.0.0-beta
* **Ambiente de Testes**: Aplicação executada localmente em ambiente de desenvolvimento (localhost:8000), utilizando Django, banco SQLite3 e navegador Microsoft Edge.
* **Tipo de Teste**: Teste Funcional Manual
* **Data do Documento**: 20/01/2026
* **Responsável**: Letícia Dorneles

---

### 🎯 2. **Objetivo**

Realizar a verificação manual dos principais requisitos funcionais do sistema com foco em validação dos fluxos críticos, mensagens de erro, comportamento esperado e integridade das funcionalidades disponíveis.

### 🧩 3. **Escopo**

**Incluído:**

* Cadastro de clientes
* Edição de clientes
* Cadastro de serviços
* Edição de serviços
* Criação de venda
* Controle de estoque


**Excluído:**

* Testes de performance ou carga

---

### 🔧 4. **Ferramentas Utilizadas**

* Navegador Microsoft Edge
* Ferramentas de inspeção do navegador (DevTools)
* Notion (registro de casos, resolução de bugs e evidências)
* Captura de tela (Snipping Tool ou Lightshot)

---

### 🧪 5. **Técnicas de Teste**

* Particionamento de equivalência
* Análise de valor limite
* Caminho feliz (Happy Path)
* Testes negativos
* Testes exploratórios

---

### 📄 6. **Critérios de Aceitação**

* Todos os casos de teste devem passar com sucesso, conforme o resultado esperado.
* Nenhum bug crítico ou bloqueador deve estar presente em funcionalidades principais.
* Mensagens de erro e validações devem ser consistentes.

---

### 🚪 7. Critérios de Entrada (Entry Criteria)

* Aplicação disponível em ambiente local.
* Banco de dados configurado e populado com dados de teste.
* Funcionalidade implementada e liberada para validação.
* Casos de teste documentados.

### 🚦 8. **Critérios de Saída (Exit Criteria)**

* Todos os testes do escopo foram executados.
* Falhas foram registradas, analisadas e reexecutadas se necessário.
* Documentação de evidências de sucesso e falhas está completa.

---

### 📋 9. **Módulos a Serem Testados**

| Código RF | Módulo                   | Prioridade |
| --------- | ------------------------ | ---------- |
| RF01      | Caixa                    | Alta       |
| RF02      | Clientes                 | Média      |
| RF03      | Serviços                 | Alta       |
| RF04      | Estoque                  | Alta       |


---

### 🐞 10. **Gestão de Bugs**

* Bugs serão documentados com:

  * Título
  * Descrição
  * Passos para reproduzir
  * Evidência (print ou vídeo)
  * Gravidade (Blocker, Alta, Média, Baixa)
  * Ferramenta sugerida: Notion ou Jira (para simulação)

---

### 📌 11. **Riscos Identificados**

| Risco                                  | Impacto | Mitigação                        |
| -------------------------------------- | ------- | -------------------------------- |
| Sistema fora do ar                     | Alto    | Tentar novamente após intervalo  |
| Dados da demo não sendo persistentes   | Médio   | Refazer cenários se necessário   |
| Testes limitados à conta "Admin" única | Médio   | Documentar esse limite no escopo |

---

### 📁 12. **Entregáveis**

* Plano de Testes (.md ou .pdf)
* Casos de Teste (.md ou planilha)
* Evidências de Execução (prints organizados por RF)
* Registro de Bugs (se houver)
* Relatório Final de Execução