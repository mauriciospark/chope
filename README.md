# Chopp — (Linhagem SPARK)

Sistema de gestão de vendas e estoque de chopp para controle de latinhas, caixas e reservas. Solução completa para registro de transações, controle de inventário e acompanhamento de histórico de vendas em ambiente local.

## Stack

**Frontend**
- HTML5
- CSS3 (com suporte a dark mode)
- JavaScript (ES6+)

**Armazenamento**
- LocalStorage (browser-side persistence)

**Ferramentas**
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Responsivo para mobile e desktop

## Funcionalidades

- **Venda Direta**: Registro de vendas imediatas com cálculo automático de preços
- **Compra Indireta**: Sistema de reservas com controle de retiradas parciais
- **Guardadas**: Visualização e gerenciamento de reservas ativas com barra de progresso
- **Estoque**: Controle de inventário com opções de adicionar ou definir total
- **Histórico**: Registro completo de vendas diretas e reservas finalizadas
- **Configurações**: Exportação e importação de dados para backup
- **Preços Flexíveis**: Suporte a preço unitário, preço de caixinha e tamanho da caixa
- **Dark Mode**: Suporte automático a tema escuro via preferências do sistema
- **Alertas de Estoque**: Indicador visual quando estoque está baixo (≤10 unidades)

## Como Rodar

1. Clone o repositório:
   ```bash
   git clone <repositorio>
   cd chape
   ```

2. Abra o arquivo `index.html` diretamente no navegador ou use um servidor local:
   ```bash
   # Com Python 3
   python -m http.server 8000

   # Com Node.js (se tiver http-server instalado)
   npx http-server
   ```

3. Acesse no navegador:
   - Sem servidor: `file:///caminho/para/chape/index.html`
   - Com servidor: `http://localhost:8000`

4. Os dados são salvos automaticamente no LocalStorage do navegador
