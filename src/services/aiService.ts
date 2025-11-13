import axios from 'axios';

// Chave da API Google Gemini
const GEMINI_API_KEY = 'AIzaSyC1Np7eqsE-T7j1J3NY4_3ZzV1IurCvZ0s';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface UserProfile {
  interests: string[];
  currentSkills: string[];
  goals: string;
}

export const generateRecommendations = async (profile: UserProfile): Promise<string> => {
  try {
    const prompt = `
Você é um assistente de requalificação profissional. Com base no perfil abaixo, sugira 3 trilhas de aprendizado personalizadas.

PERFIL DO USUÁRIO:
📌 Áreas de interesse: ${profile.interests.join(', ')}
📌 Habilidades atuais: ${profile.currentSkills.join(', ')}
📌 Objetivos profissionais: ${profile.goals}

FORMATO DA RESPOSTA:
Para cada trilha, organize assim:

═══════════════════════════════
🎯 TRILHA [NÚMERO]: [NOME DA TRILHA]
═══════════════════════════════

📝 Descrição:
[Descrição em 2-3 linhas explicando o foco desta trilha]

📚 Cursos Recomendados:
1. [Nome do Curso 1] - [Breve descrição]
2. [Nome do Curso 2] - [Breve descrição]
3. [Nome do Curso 3] - [Breve descrição]

⏱️ Tempo Estimado: [X semanas/meses]

💡 Por que esta trilha: [1 linha explicando relevância para os objetivos]


Forneça exatamente 3 trilhas seguindo este formato. Seja objetivo, prático e motivador.
    `;

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Resposta completa da API:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }
    
    throw new Error('Resposta inválida da API');
  } catch (error: any) {
    console.error('Erro ao gerar recomendações:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      throw new Error('Erro na API do Gemini. Verifique se a chave está correta.');
    }
    throw new Error('Não foi possível gerar recomendações. Tente novamente.');
  }
};

export const analyzeProgress = async (completedCourses: number, totalCourses: number): Promise<string> => {
  try {
    const percentage = (completedCourses / totalCourses) * 100;
    
    const prompt = `
Um usuário está progredindo em sua jornada de requalificação profissional.

📊 PROGRESSO ATUAL:
• Cursos concluídos: ${completedCourses} de ${totalCourses}
• Taxa de conclusão: ${percentage.toFixed(1)}%

FORMATO DA RESPOSTA:

🎉 MENSAGEM MOTIVACIONAL:
[2-3 linhas com uma mensagem encorajadora e personalizada baseada no progresso]

💪 DICA PRÁTICA:
[Uma dica objetiva para manter o ritmo e disciplina nos estudos]

🎯 PRÓXIMO PASSO SUGERIDO:
[Sugestão específica do que fazer agora para continuar evoluindo]

Seja positivo, encorajador e prático. Use emojis quando apropriado para deixar a mensagem mais amigável.
    `;

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Resposta completa da API (análise):', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }
    
    throw new Error('Resposta inválida da API');
  } catch (error: any) {
    console.error('Erro ao analisar progresso:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      throw new Error('Erro na API do Gemini. Verifique se a chave está correta.');
    }
    throw new Error('Não foi possível analisar o progresso. Tente novamente.');
  }
};