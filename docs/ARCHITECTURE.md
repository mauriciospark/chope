# Arquitetura do Sistema

## Design Arquitetural

O Chopp adota uma arquitetura **Local-First** com componentes **Vanilla JavaScript**. O sistema opera inteiramente no cliente (browser) sem dependência de backend ou APIs externas.

### Padrões Utilizados

- **Local-First**: Dados persistidos localmente via LocalStorage
- **Single Page Application (SPA)**: Navegação por tabs sem recarregar página
- **Vanilla JavaScript**: Sem frameworks, código direto e performático
- **Component-Based**: Funções modulares responsáveis por cada view (formVenda, guardadas, hist, etc.)
- **State-Driven**: Estado centralizado no objeto `S` que direciona a renderização

## Justificativa das Escolhas Técnicas

### LocalStorage como Banco de Dados

**Motivação**: Privacidade e autonomia total dos dados.

**Benefícios**:
- Dados nunca saem do dispositivo do usuário
- Funciona offline sem necessidade de conexão
- Latência zero para leitura/escrita
- Simplicidade de implementação e manutenção
- Backup via export/import JSON manual

**Limitações Consideradas**:
- Capacidade limitada (~5-10MB por origem)
- Dados não sincronizados entre dispositivos
- Perda de dados se limpar cache do navegador (mitigado por export/import)

### Vanilla JavaScript (Sem Frameworks)

**Motivação**: Leveza, portabilidade e ausência de dependências.

**Benefícios**:
- Arquivos podem ser abertos diretamente no navegador
- Tamanho total do projeto < 50KB
- Zero build step ou processo de compilação
- Compatibilidade universal (qualquer navegador moderno)
- Fácil manutenção e compreensão do código

### Single State Object

**Motivação**: Centralização e simplicidade de gerenciamento de estado.

**Benefícios**:
- Fonte única da verdade para todos os dados
- Persistência simplificada (JSON.stringify do objeto completo)
- Imutabilidade fácil de rastrear
- Debug facilitado com único ponto de inspeção

## Fluxo de Dados

### 1. Inicialização da Aplicação

```
Carregamento da página
    ↓
Recuperação do LocalStorage (KEY: "latinhas_v1")
    ↓
Parse JSON → Objeto S (estado global)
    ↓
Validação de campos obrigatórios (estoque, precoCaixa, tamCaixa)
    ↓
Renderização inicial (tab: "direta")
```

### 2. Interação do Usuário - Venda Direta

```
Usuário preenche formulário (preço, quantidade, nome)
    ↓
Evento oninput nos campos → função calc()
    ↓
Cálculo em tempo real (preço × quantidade)
    ↓
Usuário clica "Vender e entregar"
    ↓
Validação (quantidade > 0, estoque suficiente)
    ↓
Atualização do estado S:
  - decrementa S.estoque
  - adiciona registro em S.vendas
  - atualiza S.preco, S.precoCaixa, S.tamCaixa
    ↓
save() → localStorage.setItem(KEY, JSON.stringify(S))
    ↓
tab = "hist" → render()
```

### 3. Interação do Usuário - Reserva e Retirada

```
Usuário faz "Compra indireta"
    ↓
Cria reserva em S.reservas (comprado = restante = qtd)
    ↓
Usuário acessa tab "Guardadas"
    ↓
Renderização de reservas ativas (restante > 0)
    ↓
Usuário retira quantidade parcial
    ↓
Atualização do estado S:
  - decrementa reserva.restante
  - adiciona log de retirada
  - se restante = 0, define reserva.fim
    ↓
save() → localStorage
    ↓
render() atualiza UI
```

### 4. Persistência de Dados

```
Todas as operações de escrita
    ↓
Modificação do objeto S (estado global)
    ↓
Chamada de save()
    ↓
JSON.stringify(S)
    ↓
localStorage.setItem(KEY, dados_serializados)
    ↓
Try/Catch para lidar com quotas ou erros de acesso
```

### 5. Export/Import de Dados

```
Export:
  Estado S → JSON.stringify() → Blob → Download arquivo JSON

Import:
  Upload arquivo JSON → FileReader → JSON.parse()
    ↓
Validação de estrutura (campos obrigatórios)
    ↓
Confirmação do usuário
    ↓
S = dados_importados → save() → render()
```

## Estrutura de Arquivos

```
chape/
├── index.html          # Estrutura HTML principal
├── css/
│   └── style.css       # Estilos e temas (light/dark)
├── javascript/
│   └── script.js       # Lógica da aplicação
├── favicon/
│   ├── logo.png        # Logo do projeto
│   ├── manifest.json   # Configuração PWA
│   └── favicon.ico     # Ícone do navegador
└── Docs/               # Documentação do projeto
    ├── README.md
    ├── LICENSE
    ├── ABOUT.md
    ├── ARCHITECTURE.md
    ├── CONTRIBUTING.md
    └── CHANGELOG.md
```

## Privacidade e Segurança

### Privacidade

- Dados armazenados exclusivamente no LocalStorage do navegador
- Nenhuma requisição de rede para APIs externas
- Sem rastreamento, analytics ou telemetria
- Backup é controlado inteiramente pelo usuário (export manual)

### Segurança

- Validação de entrada em todos os formulários
- Sanitização de HTML (função `esc`) para prevenir XSS
- Verificação de tipos de dados antes de persistir
- Try/Catch em operações de LocalStorage para evitar crashes
- Validação de estrutura em import de dados JSON

## Performance

- Renderização em DOM nativo (sem Virtual DOM)
- Zero overhead de framework ou bundling
- Operações de leitura/escrita em memória (LocalStorage é assíncrono mas rápido)
- Debouncing não necessário (operações leves)
- Tamanho total < 50KB para carregamento instantâneo
