import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography, commonStyles, shadows } from '../styles/theme';
import { addGame } from '../utils/storage';
import { GameInput } from '../types';

interface AddGameScreenProps {
  navigation: any;
}

export const AddGameScreen: React.FC<AddGameScreenProps> = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [team, setTeam] = useState('');
  const [league, setLeague] = useState('');
  const [opponent, setOpponent] = useState('');
  const [shotsAgainst, setShotsAgainst] = useState('');
  const [goalsAllowed, setGoalsAllowed] = useState('');
  const [result, setResult] = useState<'W' | 'L' | 'OTL' | 'SOL'>('W');
  const [notes, setNotes] = useState('');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (selectedDate) {
        setDate(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const confirmDate = () => {
    setDate(tempDate);
    setShowDatePicker(false);
  };

  const cancelDate = () => {
    setTempDate(date);
    setShowDatePicker(false);
  };

  const handleSave = async () => {
    // Validation
    if (!team.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }
    if (!league.trim()) {
      Alert.alert('Error', 'Please enter a league');
      return;
    }
    if (!opponent.trim()) {
      Alert.alert('Error', 'Please enter an opponent');
      return;
    }
    if (!shotsAgainst || parseInt(shotsAgainst) < 0) {
      Alert.alert('Error', 'Please enter valid shots against');
      return;
    }
    if (!goalsAllowed || parseInt(goalsAllowed) < 0) {
      Alert.alert('Error', 'Please enter valid goals allowed');
      return;
    }
    if (parseInt(goalsAllowed) > parseInt(shotsAgainst)) {
      Alert.alert('Error', 'Goals allowed cannot exceed shots against');
      return;
    }

    try {
      const gameInput: GameInput = {
        date,
        team: team.trim(),
        league: league.trim(),
        opponent: opponent.trim(),
        shotsAgainst: parseInt(shotsAgainst),
        goalsAllowed: parseInt(goalsAllowed),
        result,
        notes: notes.trim() || undefined,
      };

      await addGame(gameInput);
      Alert.alert('Success', 'Game added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save game. Please try again.');
    }
  };

  const resultButtons = [
    { label: 'WIN', value: 'W' as const, color: colors.win },
    { label: 'LOSS', value: 'L' as const, color: colors.loss },
    { label: 'OT LOSS', value: 'OTL' as const, color: colors.ot },
    { label: 'SO LOSS', value: 'SOL' as const, color: colors.ot },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>ADD GAME</Text>
          <Text style={styles.subtitle}>Enter your game stats</Text>
        </View>

        <View style={styles.form}>
          {/* Date Picker Button */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Game Date *</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => {
                setTempDate(date);
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.dateButtonText}>
                {date.toLocaleDateString('en-US', { 
                  weekday: 'short',
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
              <Text style={styles.dateButtonIcon}>📅</Text>
            </TouchableOpacity>
            <Text style={styles.helperText}>Tap to change date</Text>
          </View>

          {/* Team */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Team Name *</Text>
            <TextInput
              style={styles.input}
              value={team}
              onChangeText={setTeam}
              placeholder="e.g., Herndon Hawks"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          {/* League */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>League *</Text>
            <TextInput
              style={styles.input}
              value={league}
              onChangeText={setLeague}
              placeholder="e.g., C-League, B-League"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          {/* Opponent */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Opponent *</Text>
            <TextInput
              style={styles.input}
              value={opponent}
              onChangeText={setOpponent}
              placeholder="Opponent team name"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Shots Against *</Text>
              <TextInput
                style={styles.input}
                value={shotsAgainst}
                onChangeText={setShotsAgainst}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Goals Allowed *</Text>
              <TextInput
                style={styles.input}
                value={goalsAllowed}
                onChangeText={setGoalsAllowed}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Save Percentage Preview */}
          {shotsAgainst && goalsAllowed && parseInt(shotsAgainst) > 0 && (
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Save Percentage</Text>
              <Text style={styles.previewValue}>
                {(((parseInt(shotsAgainst) - parseInt(goalsAllowed)) / parseInt(shotsAgainst)) * 100).toFixed(1)}%
              </Text>
            </View>
          )}

          {/* Result */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Result *</Text>
            <View style={styles.resultButtons}>
              {resultButtons.map(({ label, value, color }) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.resultButton,
                    result === value && { ...styles.resultButtonActive, backgroundColor: color },
                  ]}
                  onPress={() => setResult(value)}
                >
                  <Text
                    style={[
                      styles.resultButtonText,
                      result === value && styles.resultButtonTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes about the game..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SAVE GAME</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* iOS Modal Date Picker */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={cancelDate}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalTouchable}
              activeOpacity={1}
              onPress={cancelDate}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={cancelDate} style={styles.modalCancelButton}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={confirmDate} style={styles.modalDoneButton}>
                  <Text style={[styles.modalButtonText, styles.modalDoneText]}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  themeVariant="dark"
                  style={styles.picker}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android Date Picker */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  form: {
    paddingHorizontal: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    ...commonStyles.input,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: spacing.md,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  dateButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  dateButtonIcon: {
    fontSize: 20,
  },
  helperText: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalCancelButton: {
    padding: spacing.sm,
    minWidth: 80,
  },
  modalDoneButton: {
    padding: spacing.sm,
    minWidth: 80,
    alignItems: 'flex-end',
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  modalButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalDoneText: {
    color: colors.primary,
    fontWeight: '700',
  },
  pickerContainer: {
    height: 260,
    justifyContent: 'center',
    paddingBottom: spacing.lg,
  },
  picker: {
    height: 260,
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  previewCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    ...shadows.glow,
  },
  previewLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  previewValue: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '800',
  },
  resultButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  resultButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  resultButtonActive: {
    borderColor: 'transparent',
    ...shadows.md,
  },
  resultButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resultButtonTextActive: {
    color: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadows.lg,
  },
  saveButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
