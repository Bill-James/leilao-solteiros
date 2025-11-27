import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

4. **Commit changes**

#### **4. Criar `src/App.jsx`**

1. **Add file** → **Create new file**
2. Nome: `src/App.jsx`
3. **Cole TODO o código que você me mostrou** (o documento completo)
4. **Commit changes**

---

### **🚀 Passo 4: Deploy Automático com Vercel (GRÁTIS)**

Agora a parte mais fácil:

1. Vá em: https://vercel.com
2. Clique em **Sign Up** → **Continue with GitHub**
3. Autorize o Vercel
4. Clique em **Import Project**
5. Selecione o repositório `leilao-solteiros`
6. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
7. Clique em **Deploy**

**⏱️ Em 2-3 minutos seu site estará no ar!**

Vercel vai te dar uma URL tipo:
```
https://leilao-solteiros.vercel.app
