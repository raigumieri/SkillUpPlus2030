import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView} from 'react-native';
import { ref, get} from 'firebase/database';
import { globalStyles, colors } from '../styles/globalStyles';
import { auth, database } from '../config/firebase';
import { generateRecommendations, UserProfile } from '../services/aiService';

export default function Recomendacoes() {
    const [loading, setLoading] = useState<boolean>(false);
    const [recomendacoes, setRecomendacoes] = useState<string[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const user = auth.currentUser;
            if(!user) return;

            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                setUserProfile({ 
                    interests: data.interests || [],
                    currentSkills: data.currentSkills || [],
                    goals: data.goals || '',
                });
            }

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    };

    const handleGenerateRecommendations = async () => {
        if (!userProfile) {
            Alert.alert('Atenção', 'Complete seu perfil antes de gerar recomendações');
            return;
        }

        if (userProfile.interests.length === 0 || !userProfile.goals) {
            Alert.alert(
                'Perfil Incompleto',
                'Por favor, adicione áreas de interesse e objetivos profissionais no seu perfil.'
            );
            return;
        }

        setLoading(true);
        try {
            const result = await generateRecommendations(userProfile);
            setRecomendacoes(result);

        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Não foi possível gerar recomendações');

        } finally {
            setLoading(false);
        }
    };

    return (
    <ScrollView style={globalStyles.container}>

      <View style={styles.header}>

        <Text style={styles.headerTitle}>Recomendações com IA</Text>
        <Text style={styles.headerSubtitle}>Receba trilhas de aprendizado personalizadas baseadas no seu perfil</Text>

      </View>

      {userProfile && (
        <View style={styles.profileSummary}>
          <Text style={styles.summaryTitle}>Seu Perfil Atual:</Text>
          
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Áreas de Interesse:</Text>
            <View style={styles.interestsList}>
              {userProfile.interests.length > 0 ? (
                userProfile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestChip}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Nenhuma área selecionada</Text>
              )}
            </View>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Habilidades Atuais:</Text>
            <Text style={styles.summaryValue}>
              {userProfile.currentSkills.length > 0
                ? userProfile.currentSkills.join(', ')
                : 'Não informado'}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Objetivos:</Text>
            <Text style={styles.summaryValue}>
              {userProfile.goals || 'Não informado'}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[globalStyles.button, styles.generateButton, loading && styles.buttonDisabled]}
        onPress={handleGenerateRecommendations}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <Text style={globalStyles.buttonText}>
            {recomendacoes ? 'Gerar Novas Recomendações' : 'Gerar Recomendações'}
          </Text>
        )}
      </TouchableOpacity>

      {recomendacoes ? (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>Suas Trilhas Personalizadas:</Text>
          <View style={styles.recommendationsCard}>
            <Text style={styles.recommendationsText}>{recomendacoes}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              💡 Dica: Essas recomendações foram geradas com base no seu perfil atual. 
              Atualize suas informações para receber sugestões mais precisas!
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Nenhuma recomendação ainda</Text>
          <Text style={styles.emptyStateText}>
            Clique no botão acima para receber trilhas de aprendizado personalizadas
            baseadas no seu perfil e objetivos profissionais.
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

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.9,
  },

  profileSummary: {
    backgroundColor: colors.surface,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },

  summarySection: {
    marginBottom: 16,
  },

  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  summaryValue: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  interestChip: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },

  interestText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },

  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  generateButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  recommendationsContainer: {
    padding: 16,
  },

  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },

  recommendationsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  recommendationsText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },

  infoCard: {
    backgroundColor: colors.info + '20',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },

  infoText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },

  emptyState: {
    alignItems: 'center',
    padding: 40,
  },

  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});





