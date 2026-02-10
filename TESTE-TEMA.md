# 🧪 INSTRUÇÕES PARA TESTAR O TEMA DARK/LIGHT

## ✅ CORREÇÕES APLICADAS:

### 1. **Fundo Escuro Completo**
- ✅ `body.dark-theme` com gradient escuro (#1a1a2e → #2d2d44)
- ✅ `body.dark-theme::before` com overlay escuro sutil
- ✅ `.main-container` e `.content-area` com background transparente
- ✅ Forçado `min-height: 100vh` no body

### 2. **Service Worker Atualizado**
- ✅ Cache atualizado para `v2`
- ✅ Ícones SVG adicionados ao cache
- ✅ Ícones PNG antigos removidos

### 3. **Logs de Debug**
- ✅ Log do estado do toggle (light/dark)
- ✅ Log das classes do body
- ✅ Log do background computado do body

---

## 🔧 PASSOS PARA TESTAR:

### Passo 1: Limpar Cache Completamente
1. Abra o DevTools (F12)
2. Vá em **Application** → **Storage**
3. Clique em **Clear site data**
4. Ou pressione `Ctrl + Shift + Delete` → Selecione "Cached images and files"

### Passo 2: Recarregar a Página
1. Pressione `Ctrl + Shift + R` (hard reload)
2. Ou `Ctrl + F5`

### Passo 3: Verificar Console
1. Abra o Console (F12 → Console)
2. Você deverá ver:
   ```
   Tema salvo: [null ou 'dark' ou 'light'] isDark: [true/false]
   Tema [dark/claro] aplicado na inicialização
   Service Worker registrado: ServiceWorkerRegistration {...}
   ```

### Passo 4: Testar Toggle
1. Vá em **Ajustes** (⚙️)
2. Alterne o switch **Tema**
3. Verifique no Console:
   ```
   Toggle mudou para: dark (ou light)
   Tema dark ativado, classes do body: dark-theme
   Background do body: linear-gradient(135deg, rgb(26, 26, 46) 0%, rgb(45, 45, 68) 100%)
   ```

### Passo 5: Verificar Visualmente
- ✅ **Fundo da tela inteira** deve ficar escuro
- ✅ **Header** deve ficar cinza escuro
- ✅ **Cards** devem ficar escuros (#2d2d44)
- ✅ **Textos** devem ficar brancos
- ✅ **Inputs** devem ter fundo escuro (#1a1a2e)
- ✅ **Bordas** devem ficar cinza (#3d3d54)

---

## 🐛 SE NÃO FUNCIONAR:

### Opção 1: Desregistrar Service Worker
1. DevTools (F12) → **Application**
2. **Service Workers** → **Unregister**
3. Recarregue a página (Ctrl + Shift + R)

### Opção 2: Abrir em Aba Anônima
1. Pressione `Ctrl + Shift + N` (Chrome/Edge)
2. Acesse `http://localhost:8000`
3. Teste o tema

### Opção 3: Limpar localStorage
1. DevTools → **Application** → **Local Storage**
2. Clique com botão direito → **Clear**
3. Recarregue a página

---

## 📊 CORES ESPERADAS NO TEMA DARK:

| Elemento | Cor |
|----------|-----|
| Background Body | `#1a1a2e` → `#2d2d44` |
| Header | `#2d2d44` → `#1a1a2e` |
| Cards | `#2d2d44` |
| Inputs | `#1a1a2e` |
| Bordas | `#3d3d54` |
| Textos | `#ffffff` (branco) |
| Labels | `#b0b7c7` (cinza claro) |

---

## ✅ CHECKLIST FINAL:

- [ ] Cache limpo
- [ ] Página recarregada com Ctrl+Shift+R
- [ ] Console sem erros
- [ ] Tema alterna entre claro e escuro
- [ ] Fundo inteiro fica escuro no tema dark
- [ ] Todos os elementos escurecem corretamente
- [ ] Toast de confirmação aparece
- [ ] Tema persiste após recarregar

---

**Última atualização:** v2 - 10/02/2026
