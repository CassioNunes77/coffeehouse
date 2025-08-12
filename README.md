# ☕ CoffeeHouse - Sistema de Autoatendimento

Um sistema moderno e responsivo de autoatendimento para cafeterias, inspirado no design do Rubik mas com uma abordagem mais limpa e focada na experiência do usuário.

## 🚀 Características

### ✨ Design Moderno
- Interface limpa e intuitiva
- Animações suaves e fluidas
- Design responsivo para tablets e desktops
- Tema claro/escuro
- Componentes modulares e reutilizáveis

### 🛍️ Funcionalidades Principais
- **Tela de Boas-vindas**: Apresentação da cafeteria
- **Catálogo de Produtos**: Organizado por categorias
- **Carrinho de Compras**: Gestão de itens e quantidades
- **Sistema de Pagamento**: Múltiplas formas de pagamento
- **Confirmação de Pedido**: Número do pedido e tempo estimado

### 📱 Experiência do Usuário
- Navegação intuitiva entre telas
- Feedback visual imediato
- Notificações toast
- Animações de transição
- Interface otimizada para touch

## 🏗️ Estrutura do Projeto

```
coffeehouse/
├── index.html              # Página principal
├── styles/
│   ├── main.css           # Estilos principais
│   ├── animations.css     # Animações e transições
│   └── components.css     # Componentes reutilizáveis
├── js/
│   ├── data.js           # Dados dos produtos
│   ├── components.js     # Componentes JavaScript
│   ├── animations.js     # Gerenciador de animações
│   └── app.js           # Lógica principal
└── README.md            # Documentação
```

## 🎨 Design System

### Cores
- **Primária**: `#8B4513` (Marrom café)
- **Secundária**: `#D2691E` (Laranja)
- **Acento**: `#FFD700` (Dourado)
- **Sucesso**: `#4CAF50` (Verde)
- **Erro**: `#F44336` (Vermelho)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Tamanhos**: Sistema escalável de 0.75rem a 2.25rem
- **Pesos**: 300, 400, 500, 600, 700

### Espaçamento
- Sistema baseado em 0.25rem (4px)
- Escalas: xs(4px), sm(8px), md(16px), lg(24px), xl(32px), xxl(48px)

## 📋 Funcionalidades Detalhadas

### 1. Tela de Boas-vindas
- Logo e identidade visual
- Botões de ação principais
- Destaque das funcionalidades
- Animações de entrada

### 2. Catálogo de Produtos
- **Categorias**: Cafés, Bebidas Geladas, Doces, Salgados, Outros
- **Cards de Produto**: Imagem, nome, descrição, preço, badge
- **Controles de Quantidade**: Botões +/- com limite de 1-10
- **Adição ao Carrinho**: Botão com feedback visual

### 3. Carrinho de Compras
- Lista de itens com controles de quantidade
- Resumo de valores (subtotal e total)
- Botão para limpar carrinho
- Navegação para pagamento

### 4. Sistema de Pagamento
- Resumo do pedido
- Opções de pagamento: Cartão, PIX, NFC, Dinheiro
- Confirmação de pagamento
- Simulação de processamento

### 5. Confirmação
- Número do pedido gerado automaticamente
- Tempo estimado de preparo
- Botão para novo pedido

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: 
  - CSS Custom Properties (variáveis)
  - Flexbox e Grid
  - Animações e transições
  - Media queries responsivas
- **JavaScript ES6+**:
  - Classes e módulos
  - LocalStorage para persistência
  - Event listeners
  - Manipulação do DOM

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- **Tablets**: Interface principal (768px+)
- **Desktops**: Layout expandido (1200px+)
- **Mobile**: Layout adaptado (480px+)

## 🎯 Próximas Funcionalidades

### Área do Funcionário
- [ ] Painel de pedidos em tempo real
- [ ] Gerenciamento de status
- [ ] Histórico de pedidos
- [ ] Notificações sonoras

### Área Administrativa
- [ ] Cadastro de produtos
- [ ] Gestão de categorias
- [ ] Relatórios de vendas
- [ ] Configurações do sistema

### Funcionalidades Avançadas
- [ ] Integração com pagamentos reais
- [ ] Sistema de pontos
- [ ] Tela de chamada de pedidos
- [ ] Modo offline
- [ ] Impressão de comandas

## 🚀 Como Usar

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/coffeehouse.git
   cd coffeehouse
   ```

2. **Abra no navegador**:
   - Abra o arquivo `index.html` em um servidor local
   - Ou use um servidor de desenvolvimento como Live Server

3. **Teste as funcionalidades**:
   - Navegue pelas telas
   - Adicione produtos ao carrinho
   - Teste o fluxo de pagamento
   - Experimente o tema escuro

## 🎨 Personalização

### Cores
Edite as variáveis CSS em `styles/main.css`:
```css
:root {
    --primary-color: #8B4513;
    --secondary-color: #D2691E;
    --accent-color: #FFD700;
    /* ... outras cores */
}
```

### Produtos
Adicione ou modifique produtos em `js/data.js`:
```javascript
const PRODUCTS_DATA = {
    coffees: [
        {
            id: 1,
            name: "Seu Produto",
            description: "Descrição do produto",
            price: 10.00,
            category: "coffees",
            image: "☕",
            badge: "Novo"
        }
    ]
};
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte ou dúvidas:
- Abra uma issue no GitHub
- Entre em contato através do email: seu-email@exemplo.com

---

**Desenvolvido com ☕ e ❤️ para cafeterias**
