import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView} from 'react-native';
import { ref, get} from 'firebase/database';
import { globalStyles, colors } from '../styles/globalStyles';
import { auth, database } from '../config/firebase';
import { analyzeProgress } from '../services/aiService';

interface CursoInscrito {
    cursoId: string;
    titulo: string;
    categoria: string;
    progresso: number;
    concluido: boolean;
    iniciado: string;
}

export default function Progresso() {
    const [loading, setLoading] = useState(true);
    const [analisando, setAnalisando] = useState(false);
    const [cursosInscritos, setCursosInscritos] = useState<CursoInscrito[]>([]);
    const [analiseIA, setAnaliseIA] = useState('');
    const [estatisticas, setEstatisticas] = useState({ 
        totalCursos: 0,
        cursosConcluidos: 0,
        cursosEmAndamento: 0,
        horasEstudadas: 0,
    });

    useEffect(() => {
        carregarProgresso();
    }, []);

    const carregarProgresso = async () => {
        try{
            const usuario = auth.currentUser;
            if (!usuario) return;

            const cursosRef = ref(database, `users/${usuario.uid}/cursos`);
            const snapshot = await get(cursosRef);

            if (snapshot.exists()) {
                const dados = snapshot.val();
                const listaCursos: CursoInscrito[] = Object.values(dados);

                setCursosInscritos(listaCursos);

                const concluidos = listaCursos.filter(c => c.concluido).length;
                const emAndamento = listaCursos.filter(c => !c.concluido).length;
                const horasEstimadas = listaCursos.length * 10;

                setEstatisticas({
                    totalCursos: listaCursos.length,
                    cursosConcluidos: concluidos,
                    cursosEmAndamento: emAndamento,
                    horasEstudadas: horasEstimadas,
                });

                } else {
                    setCursosInscritos([]);
                    setEstatisticas({ 
                        totalCursos: 0,
                        cursosConcluidos: 0,
                        cursosEmAndamento: 0,
                        horasEstudadas: 0,
                    });
                }
        } catch (error) {
            console.error('Erro ao carregar progresso:', error);
            Alert.alert('Erro', 'Não foi possível carregar seu progresso');

        } finally {
            setLoading(false);
        }
    };

    const handleAnalisarProgresso = async () => {
        if (estatisticas.totalCursos === 0) {
            Alert.alert(
                'Sem Dados',
                'Inscreva-se em alguns cursos primeiro para receber análise do seu progresso'
            );
            return;
        }

        setAnalisando(true);
        try {
            const analise = await analyzeProgress(
                estatisticas.cursosConcluidos,
                estatisticas.totalCursos
            );
            setAnaliseIA(analise);

        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Não foi possível analisar o progresso.');

        } finally {
            setAnalisando(false);
        }
    };

    const calcularPercentual = (concluidos: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((concluidos / total) * 100);
    };

    if (loading) {
        return (
            <View style={globalStyles.centerContainer}> 
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const percentualConclusao = calcularPercentual(
        estatisticas.cursosConcluidos,
        estatisticas.totalCursos
    );

    return (
    <ScrollView style={globalStyles.container}>

      <View style={styles.header}>
        <Text style={styles.headerSubtitulo}>
          Acompanhe sua jornada de aprendizado
        </Text>
      </View>

      {/* === CARD DE ESTATISTICAS PRINCIPAIS ===  */}
      <View style={styles.estatisticasCard}>

        <View style={styles.estatisticaPrincipal}>
          <Text style={styles.percentual}>{percentualConclusao}%</Text>
          <Text style={styles.percentualLabel}>Taxa de Conclusão</Text>
        </View>
        
        <View style={styles.barraProgresso}>
          <View 
            style={[
              styles.barraPreenchida, 
              { width: `${percentualConclusao}%` }
            ]} 
          />
        </View>

        <View style={styles.estatisticasGrid}>

          <View style={styles.estatisticaItem}>
            <Text style={styles.estatisticaNumero}>{estatisticas.totalCursos}</Text>
            <Text style={styles.estatisticaLabel}>Total de Cursos</Text>
          </View>

          <View style={styles.estatisticaItem}>
            <Text style={[styles.estatisticaNumero, { color: colors.success }]}>
              {estatisticas.cursosConcluidos}
            </Text>
            <Text style={styles.estatisticaLabel}>Concluídos</Text>
          </View>

          <View style={styles.estatisticaItem}>
            <Text style={[styles.estatisticaNumero, { color: colors.warning }]}>
              {estatisticas.cursosEmAndamento}
            </Text>
            <Text style={styles.estatisticaLabel}>Em Andamento</Text>
          </View>

          <View style={styles.estatisticaItem}>
            <Text style={[styles.estatisticaNumero, { color: colors.info }]}>
              {estatisticas.horasEstudadas}h
            </Text>
            <Text style={styles.estatisticaLabel}>Horas Estudadas</Text>
          </View>

        </View>
      </View>

      {/* === BOTÃO DE ANÁLISE COM IA === */}
      <TouchableOpacity
        style={[globalStyles.button, styles.botaoAnalise, analisando && styles.botaoDesabilitado]}
        onPress={handleAnalisarProgresso}
        disabled={analisando}
      >
        {analisando ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <Text style={globalStyles.buttonText}>
            🤖 {analiseIA ? 'Atualizar Análise com IA' : 'Analisar Progresso com IA'}
          </Text>
        )}
      </TouchableOpacity>

      {/* === ANALISE DA IA === */}
      {analiseIA && (
        <View style={styles.analiseCard}>
          <Text style={styles.analiseTitulo}>💬 Análise Personalizada</Text>
          <Text style={styles.analiseTexto}>{analiseIA}</Text>
        </View>
      )}

      {/* === LISTA DE CURSOS INCRITOS ===  */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Seus Cursos</Text>
        
        {cursosInscritos.length > 0 ? (
          cursosInscritos.map((curso, index) => (
            <View key={index} style={styles.cursoCard}>
              <View style={styles.cursoHeader}>
                <View style={styles.categoriaChip}>
                  <Text style={styles.categoriaTexto}>{curso.categoria}</Text>
                </View>
                {curso.concluido && (
                  <View style={styles.concluidoBadge}>
                    <Text style={styles.concluidoTexto}>✓ Concluído</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.cursoTitulo}>{curso.titulo}</Text>
              
              <View style={styles.cursoProgresso}>

                <View style={styles.progressoInfo}>
                  <Text style={styles.progressoTexto}>Progresso</Text>
                  <Text style={styles.progressoPercentual}>{curso.progresso}%</Text>
                </View>

                <View style={styles.barraProgressoPequena}>
                  <View 
                    style={[
                      styles.barraPreenchidaPequena, 
                      { width: `${curso.progresso}%` }
                    ]} 
                  />
                </View>

              </View>

              <Text style={styles.cursoData}>
                Iniciado em: {new Date(curso.iniciado).toLocaleDateString('pt-BR')}
              </Text>

            </View>
          ))

        ) : (
          <View style={styles.estadoVazio}>
            <Text style={styles.estadoVazioIcone}>📚</Text>
            <Text style={styles.estadoVazioTitulo}>Nenhum curso inscrito</Text>
            <Text style={styles.estadoVazioTexto}>
              Explore as trilhas de aprendizado e comece sua jornada de requalificação!
            </Text>
          </View>

        )}
      </View>

      {/* === CARD MOTIVACIONAL === */}
      {estatisticas.totalCursos > 0 && (
        <View style={styles.motivacaoCard}>
          <Text style={styles.motivacaoTitulo}>Continue Aprendendo!</Text>
          <Text style={styles.motivacaoTexto}>
            Cada curso concluído é um passo em direção aos seus objetivos profissionais.
            Você está contribuindo para os ODS 4 e 8 da ONU!
          </Text>
        </View>
      )}
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 60,
  },

  headerTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 8,
  },

  headerSubtitulo: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.9,
  },

  estatisticasCard: {
    backgroundColor: colors.surface,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  estatisticaPrincipal: {
    alignItems: 'center',
    marginBottom: 16,
  },

  percentual: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },

  percentualLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  barraProgresso: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },

  barraPreenchida: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 6,
  },

  estatisticasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  estatisticaItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },

  estatisticaNumero: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },

  estatisticaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },

  botaoAnalise: {
    marginHorizontal: 16,
    marginBottom: 16,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  analiseCard: {
    backgroundColor: colors.secondary + '20',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },

  analiseTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  analiseTexto: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },

  secao: {
    padding: 16,
  },

  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },

  cursoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cursoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  categoriaChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  categoriaTexto: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },

  concluidoBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  concluidoTexto: {
    fontSize: 12,
    color: colors.surface,
    fontWeight: '600',
  },

  cursoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  cursoProgresso: {
    marginBottom: 8,
  },

  progressoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  progressoTexto: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  progressoPercentual: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },

  barraProgressoPequena: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },

  barraPreenchidaPequena: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  cursoData: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },

  estadoVazio: {
    alignItems: 'center',
    padding: 40,
  },

  estadoVazioIcone: {
    fontSize: 64,
    marginBottom: 16,
  },

  estadoVazioTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  estadoVazioTexto: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  motivacaoCard: {
    backgroundColor: colors.primary + '10',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },

  motivacaoIcone: {
    fontSize: 40,
    marginBottom: 12,
  },

  motivacaoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  motivacaoTexto: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});