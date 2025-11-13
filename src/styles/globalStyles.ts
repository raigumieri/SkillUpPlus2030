import {StyleSheet} from 'react-native';

export const colors = {
    primary: '#6200EE',
    primaryDark: '#3700B3',
    secondary: '#03DAC6',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#B00020',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },

    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
    },

    button: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },

    buttonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: '600',
    },

    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },

    secondaryButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },

    text: {
        fontSize: 14,
        color: colors.text,
        lineHeight: 20,
    },

    textSecondary: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },

    badge: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },

    badgeText: {
        color: colors.surface,
        fontSize: 12,
        fontWeight: '600',
    },

    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 16,
    },

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.border,
    },

    progressBar: {
        height: 8,
        backgroundColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        backgroundColor: colors.success,
        borderRadius: 4,
    },
});

