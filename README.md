# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

SkillUpPlus2030/
│
├── app/
│   ├── index.tsx                    # Entry point do aplicativo (Expo Router)
│   └── _layout.tsx                  # Layout raiz
│
├── src/
│   ├── config/
│   │   └── firebase.ts              # Configuração do Firebase
│   │
│   ├── screens/
│   │   ├── Login.tsx            # Tela de login e cadastro
│   │   ├── Home.tsx             # Tela principal com cursos
│   │   ├── Perfil.tsx           # Tela de perfil do usuário
│   │   ├── CursoDetalhes.tsx    # Detalhes de um curso específico
│   │   ├── Progresso.tsx        # Progresso e estatísticas
│   │   └── Recomendacoes.tsx    # Recomendações com IA
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Configuração de navegação híbrida
│   │
│   ├── services/
│   │   └── aiService.ts             # Integração com API do Gemini
│   │
│   └── styles/
│       └── globalStyles.ts          # Estilos globais e paleta de cores
│
├── package.json                     # Dependências do projeto
├── tsconfig.json                    # Configuração TypeScript
├── app.json                         # Configuração do Expo
└── README.md                        # Documentação do repositório




