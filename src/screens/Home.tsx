import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, ScrollView} from 'react-native';
import { ref, get} from 'firebase/database';
import { globalStyles, colors } from '../styles/globalStyles';
import { auth, database } from '../config/firebase';

interface Cursos {
    id: string;
    title: string;
    category: string;
    duration: string;
    level: string;
    description: string;
}

const TIPOS_CURSOS: Cursos[] = [
    {
        id: '1',
        title: 'Introdução à Inteligência Ariticial',
        category: 'Inteligência Artificial',
        duration: '4 semanas',
        level: 'Iniciante',
        description: 'Fundamentos de IA e Machine Learning',
    },
    {
        id: '2',
        title: 'Sustentabilidade Empresarial',
        category: 'Sustentabilidade',
        duration: '3 semanas',
        level: 'Intermediário',
        description: 'Práticas sustentáveis no ambiente corporativo',
    },
    {
        id: '3',
        title: 'Comunicação Eficaz',
        category: 'Soft Skills',
        duration: '2 semanas',
        level: 'Iniciante',
        description: 'Desenvolva habilidades de comunicação',
    },
    {
        id: '4',
        title: 'Liderança Transformacional',
        category: 'Gestão e Liderança',
        duration: '5 semanas',
        level: 'Avançado',
        description: 'Técnicas modernas de liderança',
    },
    {
        id: '5',
        title: 'Python para Data Science',
        category: 'Programação',
        duration: '6 semanas',
        level: 'Intermediário',
        description: 'Análise de dados com Python'
    },
    {
        id: '6',
        title: 'Machine Learning Avançado',
        category: 'Data Science',
        duration: '8 semanas',
        level: 'Avançado',
        description: 'Algoritmos avançados de ML'
    },
];

export default function Home({ navigation } : any) {
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [userInterests, setUserInterests] = useState<string[]>([]);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [filteredCourses, setFilteredCourses] = useState<Cursos[]>([]);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                setUserName(data.nome || 'Usuário');
                setUserInterests(data.interest || []);
                setProfileImage(data.profileImage || null);


                // === Filtro de cursos baseado nos interesses ===
                if (data.interests && Array.isArray(data.interests) && data.interests.length > 0) {
                    const filtered = TIPOS_CURSOS.filter(cursos => data.interests.includes(cursos.category));
                    setFilteredCourses(filtered.length > 0 ? filtered : TIPOS_CURSOS);

                } else {
                    setFilteredCourses(TIPOS_CURSOS);
                }

            } else {
                setFilteredCourses(TIPOS_CURSOS);
            }

        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
            setFilteredCourses(TIPOS_CURSOS);

        } finally {
            setLoading(false);
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Iniciante':
                return colors.success;
            
            case 'Intermediário':
                return colors.warning;

            case 'Avançado': 
                return colors.error;

            default:
                return colors.primary;
        }
    };

    if (loading) {
        return (
            <View style={globalStyles.centerContainer}> 
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
    <ScrollView style={globalStyles.container}>
      {/* === HEADER COM O PERFIL DO USUÁRIO === */}

      <View style={styles.header}>
        <View style={styles.headerContent}>

          <View>
            <Text style={styles.greeting}>Olá, {userName}! 👋</Text>
            <Text style={styles.subGreeting}>Pronto para aprender hoje?</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>

                <Text style={styles.avatarText}>
                  {userName.charAt(0).toUpperCase()}
                </Text>

              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* === SEÇÃO DE PROGRESSO === */}

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Seu Progresso</Text>

        <View style={styles.statsContainer}>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Cursos Iniciados</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Concluídos</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0h</Text>
            <Text style={styles.statLabel}>Estudadas</Text>
          </View>

        </View>

        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => navigation.navigate('Recomendacoes')}
        >
          <Text style={styles.aiButtonText}>🤖 Obter Recomendações com IA</Text>
        </TouchableOpacity>
      </View>

      {/* === TRILHAS RECOMENDADAS === */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {userInterests.length > 0 ? 'Recomendados para Você' : 'Trilhas Disponíveis'}
        </Text>

        {filteredCourses.map((cursos) => (
          <TouchableOpacity
            key={cursos.id}
            style={styles.courseCard}
            onPress={() => navigation.navigate('CursoDetalhes', { cursos })}
          >
            <View style={styles.courseHeader}>

              <View style={styles.courseCategory}>
                <Text style={styles.courseCategoryText}>{cursos.category}</Text>
              </View>

              <View style={[styles.levelBadge, { backgroundColor: getLevelColor(cursos.level) }]}>
                <Text style={styles.levelText}>{cursos.level}</Text>
              </View>

            </View>

            <Text style={styles.courseTitle}>{cursos.title}</Text>
            <Text style={styles.courseDescription}>{cursos.description}</Text>

            <View style={styles.courseFooter}>
              <Text style={styles.courseDuration}>⏱️ {cursos.duration}</Text>
            </View>

          </TouchableOpacity>
        ))}

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
  },

  subGreeting: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.9,
    marginTop: 4,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.surface,
  },

  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface,
  },

  progressCard: {
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

  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },

  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  aiButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  aiButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  section: {
    padding: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },

  courseCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  courseCategory: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  courseCategoryText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },

  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  levelText: {
    fontSize: 12,
    color: colors.surface,
    fontWeight: '600',
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  courseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },

  courseFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },

  courseDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
    