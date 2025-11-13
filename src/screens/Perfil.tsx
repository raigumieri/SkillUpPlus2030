import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { ref, get, set, update } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { globalStyles, colors } from '../styles/globalStyles';

const INTEREST_OPTIONS = [
    'Inteligência Artifical',
    'Sustentabilidade',
    'Soft Skills',
    'Gestão e Liderança',
    'Programação',
    'Data Science',
    'Marketing Digital',
    'Finanças',
];

export default function Perfil({ navigation }: any){ 
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [nome, setNome] = useState('');
    const [goals, setGoals] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [currentSkills, setCurrentSkills] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showInterestPicker, setShowInterestPicker] = useState(false);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try{
            const user = auth.currentUser;
            if (!user) return;

            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()){
                const data = snapshot.val();
                setNome(data.nome || '');
                setGoals(data.goals || '');
                setSelectedInterests(data.interests || []);
                setCurrentSkills(data.currentSkills?.join(', ') || '');
                setProfileImage(data.profileImage || null);
            }

        }catch (error){
            console.error('Erro ao carregar perfil:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');

        }finally{
            setLoading(false);
        }
    };

    const pickImage = async (useCamera: boolean) => {
        try{
            let result;

            if (useCamera) {
                const {status} = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permissão negada', 'Precisamos de acesso à câmera.');
                    return;
                }

                result = await ImagePicker.launchCameraAsync({ 
                    allowsEditing: true,
                    aspect: [1,1],
                    quality: 0.5,
                });

            } else {
                const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permissão Negada', 'Precisamnos de acesso à galeria.');
                    return;
                }

                result = await ImagePicker.launchImageLibraryAsync({ 
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1,1],
                    quality: 0.5,
                });
            }

            if (!result.canceled && result.assets[0]) {
                const response = await fetch(result.assets[0].uri);
                const blob = await response.blob();
                const reader = new FileReader();

                reader.onloadend = () => {
                    setProfileImage(reader.result as string)
                };
                reader.readAsDataURL(blob);
            }

        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Foto de Perfil',
            'Escolha uma opção:',
            [
                {text: 'Tirar Foto', onPress: () => pickImage(true)},
                {text: 'Escolher da Galeria', onPress: () => pickImage(false)},
                {text: 'Cancelar', style: 'cancel'},
            ]
        );
    };

    const toggleInterest = (interest: string) => {
        if(selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));

        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleSave = async () => {
        if (!nome || selectedInterests.length === 0 || !goals) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setSaving(true);
        try{
            const user = auth.currentUser;
            if (!user) return;

            const skillsArray = currentSkills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);

            await set(ref(database, `users/${user.uid}`), {
                nome,
                email: user.email,
                goals,
                interests: selectedInterests,
                currentSkills: skillsArray,
                profileImage,
                updatedAt: new Date().toISOString(),
            });

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            navigation.navigate('Home');

        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            Alert.alert('Erro', 'Não foi possível salvar o perfil');

        }finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={globalStyles.centerContainer}> 
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return( 
        <ScrollView style={globalStyles.container}> 
            <View style={styles.header}> 

                <TouchableOpacity onPress={showImageOptions} style={styles.imageContainer}> 
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Text style={styles.placeholderSubtext}> Adicionar Foto </Text> 
                        </View>
                    )}

                </TouchableOpacity>

            </View>

            <View> 
                <Text>Nome Completo *</Text>
                <TextInput
                style={globalStyles.input}
                value={nome}
                onChangeText={setNome}
                placeholder='Digite seu nome' 
                />

                <Text style={styles.label}>Áreas de Interesse *</Text>
                <Text style={styles.helperText}>Selecione suas áreas de interesse: </Text>

                <View style={styles.interestContainer}>
                    {INTEREST_OPTIONS.map((interest) => (
                        <TouchableOpacity
                            key={interest}
                            style={[
                                styles.interestChip,
                                selectedInterests.includes(interest) && styles.interestChipSelected,
                            ]}
                            onPress={() => toggleInterest(interest)}
                            > 
                            <Text
                            style={[
                                styles.interestChipText,
                                selectedInterests.includes(interest) && styles.interestChipTextSelected,
                            ]}>
                                {interest} 
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Habilidades Atuais</Text>
                <Text style={styles.helperText}>Separe por vírgulas (ex: Excel, Python, Comunicação)</Text>
                <TextInput
                    style={[globalStyles.input, styles.textArea]}
                    value={currentSkills}
                    onChangeText={setCurrentSkills}
                    placeholder="Excel, Python, Comunicação..."
                    multiline
                />

                <Text style={styles.label}>Objetivos Profissionais *</Text>
                <TextInput
                    style={[globalStyles.input, styles.textArea]}
                    value={goals}
                    onChangeText={setGoals}
                    placeholder="Descreva seus objetivos profissionais..."
                    multiline
                    numberOfLines={4}
                />

                <TouchableOpacity
                    style={[globalStyles.button, saving && styles.buttonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    <Text style={globalStyles.buttonText}>
                        {saving ? 'Salvando...' : 'Salvar Perfil'}
                    </Text>

                </TouchableOpacity>

            </View>
        
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.surface,
  },

  imageContainer: {
    position: 'relative',
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 40,
  },

  placeholderSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  form: {
    padding: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },

  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },

  interestChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
  },

  interestChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  interestChipText: {
    color: colors.text,
    fontSize: 14,
  },

  interestChipTextSelected: {
    color: colors.surface,
    fontWeight: '600',
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});