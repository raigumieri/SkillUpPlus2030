import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView} from 'react-native';
import { ref, set} from 'firebase/database';
import { globalStyles, colors } from '../styles/globalStyles';
import { auth, database } from '../config/firebase';


export default function CursoDetalhes ({ route, navigation }: any) {
    const {cursos} = route.params;
    const [inscrito, setInscrito] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInscrever = async () => {
        setLoading(true);
        try {
            const usuario = auth.currentUser;
            if(!usuario) return;

            const cursoRef = ref(database, `users/${usuario.uid}/cursos/${cursos.id}`);

            await set(cursoRef, {
                cursoId: cursos.id,
                titulo: cursos.title,
                categoria: cursos.category,
                duracao: cursos.duration,
                nivel: cursos.level,
                progresso: 0,
                iniciado: new Date().toISOString(),
                concluido: false,
            });

            setInscrito(true);
            Alert.alert('Sucesso', 'Você foi inscrito no curso!');

        } catch (error) {
            console.error('Erro ao inscrever:', error);
            Alert.alert('Erro', 'Não foi possível se inscrever no curso');

        }finally {
            setLoading(false);
        }
    };

    const handleIniciar = () => {
        Alert.alert( 
            'Curso Iniciado',
            'Em uma versão completa, aqui você acessaria as aulas e materiais do curso.',
            [{ text: 'OK'}]
        );
    };

    const getNivelCor = (nivel: string) => {
        switch (nivel) {
            case 'Iniciante':
                return colors.success;

            case 'Intermediário': 
                return colors.warning;

            case 'Avançado': 
                return colors.error;

            default: 
                return colors.primary;
        }
    }

    return (
    <ScrollView style={globalStyles.container}>

      <View style={styles.header}>

        <View style={styles.categoriaContainer}>
          <Text style={styles.categoriaTexto}>{cursos.category}</Text>
        </View>

        <Text style={styles.titulo}>{cursos.title}</Text>

        <View style={styles.infoPrincipal}>
          <View style={[styles.nivelBadge, { backgroundColor: getNivelCor(cursos.level) }]}>
            <Text style={styles.nivelTexto}>{cursos.level}</Text>
          </View>
          <Text style={styles.duracao}>{cursos.duration}</Text>
        </View>

      </View>

      <View style={styles.conteudo}>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Sobre o Curso</Text>
          <Text style={styles.descricao}>{cursos.description}</Text>
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>O que você vai aprender</Text>

          <View style={styles.topico}>
            <Text style={styles.topicoTexto}>• Fundamentos essenciais da área</Text>
          </View>

          <View style={styles.topico}>
            <Text style={styles.topicoTexto}>• Práticas e técnicas avançadas</Text>
          </View>

          <View style={styles.topico}>
            <Text style={styles.topicoTexto}>• Aplicação prática em projetos reais</Text>
          </View>

          <View style={styles.topico}>
            <Text style={styles.topicoTexto}>• Certificado de conclusão</Text>
          </View>

        </View>

        <View style={styles.secao}>

          <Text style={styles.secaoTitulo}>Conteúdo do Curso</Text>

          <View style={styles.modulo}>
            <Text style={styles.moduloTitulo}>Módulo 1: Introdução</Text>
            <Text style={styles.moduloInfo}>4 aulas • 2 horas</Text>
          </View>

          <View style={styles.modulo}>
            <Text style={styles.moduloTitulo}>Módulo 2: Fundamentos</Text>
            <Text style={styles.moduloInfo}>6 aulas • 3 horas</Text>
          </View>

          <View style={styles.modulo}>
            <Text style={styles.moduloTitulo}>Módulo 3: Prática</Text>
            <Text style={styles.moduloInfo}>5 aulas • 2.5 horas</Text>
          </View>

          <View style={styles.modulo}>
            <Text style={styles.moduloTitulo}>Módulo 4: Projeto Final</Text>
            <Text style={styles.moduloInfo}>3 aulas • 2 horas</Text>
          </View>

        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Requisitos</Text>
          <Text style={styles.requisito}>• Nenhum conhecimento prévio necessário</Text>
          <Text style={styles.requisito}>• Computador com acesso à internet</Text>
          <Text style={styles.requisito}>• Dedicação de 3-5 horas por semana</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitulo}>Dica</Text>
          <Text style={styles.infoTexto}>
            Este curso faz parte das trilhas de aprendizado alinhadas aos ODS da ONU, 
            contribuindo para sua requalificação profissional no mercado de trabalho do futuro.
          </Text>
        </View>

      </View>

      <View style={styles.rodape}>
        {inscrito ? (
          <TouchableOpacity
            style={[globalStyles.button, styles.botao]}
            onPress={handleIniciar}
          >
            <Text style={globalStyles.buttonText}>Iniciar Curso</Text>
          </TouchableOpacity>

        ) : (
          <TouchableOpacity
            style={[globalStyles.button, styles.botao, loading && styles.botaoDesabilitado]}
            onPress={handleInscrever}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? 'Inscrevendo...' : 'Inscrever-se Gratuitamente'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 60,
  },

  categoriaContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },

  categoriaTexto: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 12,
  },

  infoPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  nivelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },

  nivelTexto: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },

  duracao: {
    color: colors.surface,
    fontSize: 14,
  },

  conteudo: {
    padding: 16,
  },

  secao: {
    marginBottom: 24,
  },

  secaoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  descricao: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  topico: {
    marginBottom: 8,
  },

  topicoTexto: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },

  modulo: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  moduloTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },

  moduloInfo: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  requisito: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 24,
  },

  infoCard: {
    backgroundColor: colors.info + '20',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },

  infoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  infoTexto: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },

  rodape: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  botao: {
    marginVertical: 0,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },
});