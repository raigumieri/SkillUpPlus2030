import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Platform, ScrollView} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {ref, set} from 'firebase/database';
import { auth, database } from '../config/firebase';
import { globalStyles, colors } from '../styles/globalStyles';

export default function Login({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if(!email || !senha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, senha);

    } catch (error: any){ 
        let errorMessage = 'Erro ao fazer login.';

        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Usuário não encontrado.';

        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Senha incorreta.';

        } else if(error.code === 'auth/invalid-email') {
            errorMessage = 'Email inválido.';

        } else if(error.code === 'auth/invalid-credential') {
            errorMessage = 'Credenciais inválidas.';

        }

        Alert.alert('Erro', errorMessage);
    } finally {
        setLoading(false);
    }
    }

    const handleRegister = async () => {
    if (!email || !senha || !nome) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
    }

    if (senha.length < 6) {
        Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    setLoading(true);
    try { 
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        await set(ref(database, `users/${user.uid}`), {
            nome: nome,
            email: email,
            createdAt: new Date().toISOString(),
            interests: [],
            goals: '',
            completedCourses: 0,
            totalCourses: 0,
            profileImage: null,
        });

        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        setIsRegistering(false);

    }catch (error: any) {
        let errorMessage = 'Erro ao criar conta.';

        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Este email já está em uso';

        } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Email inválido';

        } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Senha muito fraca';
            
        }

        Alert.alert('Erro', errorMessage);

    }finally {
        setLoading(false);
    }
};

return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <Text style={styles.title}> SkillUpPlus 2030</Text>

            <Text style={styles.subtitle}> Requalificação profissional para o futuro do trabalho</Text>       
        </View> 

        <View style={styles.formContainer}> 
            {isRegistering && (
                <TextInput 
                style={globalStyles.input}
                placeholder='Nome Completo'
                value={nome}
                onChangeText={setNome}
                autoCapitalize='words'
                />
            )}

            <TextInput
            style={globalStyles.input}
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            />

            <TextInput
            style={globalStyles.input}
            placeholder='Senha'
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            />

            <TouchableOpacity 
            style={[globalStyles.button, loading && styles.buttonDisabled]}
            onPress={isRegistering ? handleRegister :handleLogin}
            disabled={loading}
            >
                <Text style={globalStyles.buttonText}> 
                    {loading ? 'Aguarde...' : isRegistering ? 'Criar conta' : 'Entrar'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={globalStyles.secondaryButton}
            onPress={() => setIsRegistering(!isRegistering)}
            >
                <Text style={globalStyles.secondaryButtonText}> 
                    {isRegistering ? 'Já tenho uma conta' : 'Criar nova conta'}
                </Text>
            </TouchableOpacity>
        </View>

        <View style={styles.footer}> 
            <Text style={styles.footerText}> Conectado aos ODS 4, 8, 9 e 10 da ONU </Text>
        </View>
    </ScrollView>
    
);

};

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },

    header: {
        alignItems: 'center',
        marginBottom: 40,
    },

    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 20,
    },

    formContainer: {
        marginBottom: 20,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    footer: {
        marginTop: 20,
        alignItems: 'center',
    },

    footerText: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});



