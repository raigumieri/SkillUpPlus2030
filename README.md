<div align="center"> 
   
   # 📚 SkillUpPlus 2030+
   
   ## **Requalificação Profissional para o Futuro do Trabalho**
</div>



---

### 👥 Integrantes do Grupo

- **[Guilherme Doretto Sobreiro]** - **RM: [99674]**
- **[Guilherme Fazito Ziolli Sordili]** - **RM: [550539]** 
- **[Raí Gumieri dos Santos]** - **RM: [98287]**

**Disciplina:** Mobile Development & IoT  
**Turma:** [3ESPF]

---

<div align="center"> 
   
   ## 📖 Sobre o Projeto
</div>

O **SkillUpPlus 2030+** é um aplicativo mobile desenvolvido em React Native que apoia trabalhadores e estudantes na requalificação profissional diante das transformações causadas pela automação e inteligência artificial no mercado de trabalho.

Inspirado nos **Objetivos de Desenvolvimento Sustentável (ODS)** da ONU, o app democratiza o acesso à educação tecnológica através de uma plataforma móvel acessível, personalizada e potencializada por Inteligência Artificial.

### 🎯 Objetivos

- Facilitar a requalificação profissional através de trilhas de aprendizado personalizadas
- Democratizar o acesso à capacitação tecnológica
- Utilizar IA para gerar recomendações e análises motivacionais
- Contribuir para os ODS 4, 8, 9 e 10 da ONU

---
<div align="center"> 
   
   ## ✨ Funcionalidades Principais

</div>

### 🔐 Autenticação Segura
- Login e cadastro com Firebase Authentication
- Validação de credenciais e tratamento de erros
- Gerenciamento automático de sessão

### 👤 Perfil Personalizável
- Cadastro de foto (câmera ou galeria)
- Seleção de áreas de interesse
- Definição de habilidades e objetivos profissionais
- Armazenamento seguro no Firebase

### 📚 Catálogo de Cursos
- Cursos organizados por categorias (IA, Sustentabilidade, Soft Skills, etc.)
- Níveis: Iniciante, Intermediário e Avançado
- Filtragem inteligente baseada nos interesses do usuário
- Detalhes completos de cada curso

### 🤖 Recomendações com IA
- Integração com Google Gemini API
- Geração de 3 trilhas de aprendizado personalizadas
- Análise do perfil para sugestões relevantes
- Recomendações formatadas e estruturadas

### 📊 Acompanhamento de Progresso
- Dashboard com estatísticas detalhadas
- Taxa de conclusão e cursos em andamento
- Análise motivacional gerada por IA
- Dicas práticas e sugestões personalizadas

### 🧭 Navegação Híbrida
- Stack Navigation para fluxos lineares
- Drawer Navigation (menu lateral)
- Bottom Tabs para acesso rápido
- Experiência fluida e intuitiva

---
<div align="center"> 

   ## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|------------|-----------|
| **React Native** | Framework multiplataforma para desenvolvimento mobile |
| **Expo** | Plataforma para facilitar o desenvolvimento e build |
| **TypeScript** | Superset JavaScript com tipagem estática |
| **Firebase Authentication** | Autenticação de usuários |
| **Firebase Realtime Database** | Banco de dados NoSQL em tempo real |
| **Google Gemini API** | Inteligência Artificial generativa |
| **React Navigation** | Biblioteca de navegação (Stack, Drawer, Tabs) |
| **Expo Image Picker** | Acesso à câmera e galeria |
| **Axios** | Cliente HTTP para requisições |

</div>



---
<div align="center"> 
   
   ## 🚀 Como Executar o Projeto

</div>

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (emulador) ou dispositivo físico
- Conta Firebase (configurada)
- Chave API do Google Gemini

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/[seu-usuario]/SkillUpPlus2030.git
cd SkillUpPlus2030
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**
- Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
- Ative Authentication (Email/Password)
- Ative Realtime Database
- Copie as credenciais para `src/config/firebase.ts`

4. **Configure a API do Gemini**
- Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
- Gere uma API Key
- Cole a chave em `src/services/aiService.ts`

5. **Execute o projeto**
```bash
npx expo start
```

6. **Escolha a plataforma**
- Pressione `a` para Android
- Pressione `i` para iOS
- Ou escaneie o QR Code com o app Expo Go

---
<div align="center"> 
   
   ## 📱 Principais Telas

</div>

### Tela de Login
Interface clean para autenticação com opção de criar conta nova.

### Home
Dashboard principal com saudação personalizada, estatísticas e lista de cursos recomendados.

### Perfil
Configuração completa do perfil com foto, interesses, habilidades e objetivos.

### Recomendações IA
Geração de trilhas de aprendizado personalizadas através do Gemini.

### Progresso
Visualização de estatísticas detalhadas e análise motivacional com IA.

### Detalhes do Curso
Informações completas sobre cada curso com opção de inscrição.

---
<div align="center"> 
   
   ## 🎨 Arquitetura do Projeto
   
</div>

```
src/
├── config/          # Configurações (Firebase)
├── screens/         # Telas do aplicativo
├── navigation/      # Configuração de rotas
├── services/        # Serviços externos (API IA)
└── styles/          # Estilos globais
```

**Padrões Utilizados:**
- Componentização modular
- Separação de responsabilidades
- Tipagem forte com TypeScript
- Async/Await para operações assíncronas
- Try-catch para tratamento de erros

---
<div align="center"> 
   
   ## 🌍 Conexão com os ODS da ONU
   
</div>

### ODS 4 - Educação de Qualidade
Democratiza o acesso à capacitação tecnológica através de trilhas personalizadas.

### ODS 8 - Trabalho Decente e Crescimento Econômico
Fomenta empregabilidade e prepara profissionais para o futuro do trabalho.

### ODS 9 - Indústria, Inovação e Infraestrutura
Incentiva o uso de tecnologias acessíveis e sustentáveis.

### ODS 10 - Redução das Desigualdades
Inclui públicos vulneráveis através da educação digital acessível.

---
<div align="center"> 
   
   ## 🏆 Diferenciais do Projeto
   
</div>

✅ **Integração real com IA** (Google Gemini) para recomendações personalizadas  
✅ **Navegação híbrida** completa (Stack + Drawer + Tabs)  
✅ **Firebase** para autenticação e persistência de dados  
✅ **Funcionalidade de câmera/galeria** implementada (bônus)  
✅ **Interface moderna** e intuitiva  
✅ **Código organizado** seguindo boas práticas  
✅ **TypeScript** para maior segurança e manutenibilidade  
✅ **Tratamento robusto de erros** em todas as operações  

---
<div align="center">
   
   ## 📋 Funcionalidades Implementadas
   
</div>

### Requisitos Obrigatórios
- [x] Sistema de login com Firebase Authentication 
- [x] Persistência de dados no Firebase Realtime Database 
- [x] Integração com IA via API 
- [x] Navegação híbrida (Stack + Drawer + Tabs)
- [x] Todos os componentes obrigatórios (View, ScrollView, TextInput, etc.)
- [x] Formulários validados
- [x] Organização de código modular 

### Requisitos de Bônus
- [x] Câmera e galeria para foto de perfil
---
<div align="center"> 
   
   ## 🔒 Segurança e Privacidade
   
</div>

- Senhas criptografadas pelo Firebase Authentication
- Regras de segurança no Realtime Database
- Validação de dados no cliente e servidor
- Tokens de sessão gerenciados automaticamente
- Conversão de imagens para Base64 (sem armazenamento externo)

---
<div align="center"> 
   
   ## 🐛 Tratamento de Erros
   
</div>

O aplicativo possui tratamento robusto de erros incluindo:

- Validação de campos obrigatórios
- Mensagens de erro específicas e amigáveis
- Try-catch em operações críticas
- Fallbacks para dados indefinidos
- Logs detalhados para debug
  
---
<div align="center"> 
   
   ## 🎓 Conclusão
   
</div>

O **SkillUpPlus 2030+** representa mais do que um aplicativo mobile: é uma ferramenta de transformação social que combina tecnologia de ponta com propósito humanitário. Ao unir React Native, Firebase e Inteligência Artificial, criamos uma solução acessível e escalável para um dos maiores desafios da nossa era - preparar profissionais para o mercado de trabalho em constante evolução. Este projeto demonstra como a tecnologia pode ser uma ponte para a inclusão, a educação de qualidade e o desenvolvimento sustentável, contribuindo ativamente para um futuro mais justo e próspero para todos.


---
<div align="center"> 
   
   *Global Solution 2025.2 - FIAP*
   
</div>
