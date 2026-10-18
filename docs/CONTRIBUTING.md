# Guia de Contribuição

Bem-vindo ao projeto Chopp! Agradecemos seu interesse em contribuir. Este documento estabelece as diretrizes para colaboração.

## Padrões de Código

### JavaScript

- Use `var` para manter consistência com o código base existente
- Funções devem ser declaradas com `function name() {}` (sem arrow functions)
- Nomes de variáveis e funções em camelCase
- Nomes de constantes em UPPER_SNAKE_CASE
- Indentação com 2 espaços
- Comentários em português brasileiro
- Funções helper (utilitárias) no topo do arquivo antes da lógica principal

### HTML

- Use minúsculas para tags e atributos
- Indentação consistente com 2 espaços
- Feche todas as tags HTML
- Use aspas duplas para atributos
- Mantenha estrutura semântica (main, nav, section, etc.)

### CSS

- Use minúsculas para seletores e propriedades
- Agrupe regras relacionadas
- Use variáveis CSS para cores e valores reutilizáveis
- Comentários para seções grandes
- Ordene propriedades: posicionamento → dimensões → tipografia → visual

## Organização de Branches

Para contribuições:

```
main           ← Branch principal (produção)
feature/nome   ← Nova funcionalidade
fix/nome       ← Correção de bug
docs/nome      ← Atualização de documentação
```

### Workflow

1. Crie um branch a partir de `main`:
   ```bash
   git checkout -b feature/export-dados
   ```

2. Faça suas alterações seguindo os padrões

3. Teste manualmente as funcionalidades afetadas

4. Commit com mensagem clara:
   ```bash
   git commit -m "Adiciona exportação de dados em JSON"
   ```

5. Abra Pull Request para revisão

## Padrão de Commits

Mensagens de commit devem ser claras e em português:

```
Adiciona: nova funcionalidade
Corrige: bug identificado
Atualiza: melhoria ou refatoração
Remove: código ou funcionalidade obsoleta
```

Exemplos:
- `Adiciona funcionalidade de exportação de dados`
- `Corrige cálculo de preço em caixas mistas`
- `Atualiza documentação do README`
- `Remove código comentado obsoleto`

## Validações Obrigatórias

Antes de submeter alterações:

### Testes Manuais

- [ ] Testar vendas diretas (com e sem nome)
- [ ] Testar compras indiretas e retiradas parciais
- [ ] Testar gerenciamento de estoque (adicionar e definir)
- [ ] Testar export/import de dados
- [ ] Testar dark mode (se aplicável)
- [ ] Testar responsividade em mobile
- [ ] Verificar se não há erros no console do navegador

### Código

- [ ] Código segue os padrões estabelecidos
- [ ] Sem console.log() ou código de debug
- [ ] Comentários explicativos para lógica complexa
- [ ] Variáveis com nomes descritivos
- [ ] Sem duplicação de código desnecessária

### Documentação

- [ ] Atualizar README se adicionou funcionalidade
- [ ] Atualizar CHANGELOG.md com mudanças
- [ ] Atualizar ARCHITECTURE.md se alterou estrutura

## Processo de Revisão

1. **Pull Request**: Abra PR descrevendo claramente as mudanças
2. **Revisão**: Aguarde feedback do maintainer
3. **Correções**: Faça ajustes solicitados
4. **Aprovação**: Merge após aprovação

## Relatório de Bugs

Ao reportar bugs, inclua:

- Descrição detalhada do problema
- Passos para reproduzir
- Comportamento esperado vs. comportamento real
- Navegador e versão utilizados
- Capturas de tela se aplicável
- Console errors (se houver)

## Sugestões de Funcionalidades

Para propor novas funcionalidades:

- Descreva o problema que resolve
- Explique o caso de uso
- Sugira uma implementação se possível
- Considere impacto no tamanho e complexidade do projeto

## Código de Conduta

- Seja respeitoso e construtivo
- Aceite feedback de forma profissional
- Priorize a simplicidade e clareza
- Mantenha o projeto focado nos objetivos principais

## Licença

Ao contribuir, você concorda que suas alterações serão licenciadas sob a licença MIT do projeto, conforme estabelecido no arquivo LICENSE.
