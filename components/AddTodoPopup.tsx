import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import axios from "axios";

interface AddTodoPopupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (todo: { title: string; dueDate: Date; repeat: string; type: string; priority: string }) => void;
}

export default function AddTodoPopup({ visible, onClose, onSave }: AddTodoPopupProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeat, setRepeat] = useState("None");
  const [type, setType] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [aiChatVisible, setAiChatVisible] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // Setup notification permissions
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  // Handle due date change
  const onChangeDate = (event: any, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  // Schedule reminder notification
  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Todo Reminder",
        body: `Your task "${title}" is due soon!`,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: dueDate },
    });
  };

  // Save the Todo
  const handleSave = async () => {
    if (!title.trim()) return alert("Please enter a title.");

    await scheduleNotification();
    onSave({ title, dueDate, repeat, type, priority });
    setTitle("");
    setDueDate(new Date());
    setRepeat("None");
    setType("Personal");
    setPriority("Medium");
    onClose();
  };

  // Gemini API Chat
  const handleAskAI = async () => {
    if (!aiInput.trim()) return;

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCg3fyXq3gbIH0a7pO8kNqKJn6B0Ezrsa0",
        {
          contents: [{ parts: [{ text: aiInput }] }],
        }
      );
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiResponse(text || "No response received.");
    } catch (err) {
      setAiResponse("Error connecting to AI. Please try again.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView>
            <Text style={styles.title}>Add New Todo</Text>

            {/* Todo Title */}
            <TextInput
              style={styles.input}
              placeholder="Todo Title"
              value={title}
              onChangeText={setTitle}
            />

            {/* Due Date Picker */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.label}>
                Due Date: {dueDate.toLocaleString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="datetime"
                display="default"
                onChange={onChangeDate}
              />
            )}

            {/* Repeat Option */}
            <Text style={styles.label}>Repeat:</Text>
            <View style={styles.row}>
              {["None", "Daily", "Weekly", "Monthly"].map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRepeat(r)}
                  style={[
                    styles.option,
                    repeat === r && styles.optionSelected,
                  ]}
                >
                  <Text>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Todo Type */}
            <Text style={styles.label}>Todo Type:</Text>
            <View style={styles.row}>
              {["Personal", "Public", "Group"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[styles.option, type === t && styles.optionSelected]}
                >
                  <Text>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Priority */}
            <Text style={styles.label}>Priority:</Text>
            <View style={styles.row}>
              {["Low", "Medium", "High"].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.option,
                    priority === p && styles.optionSelected,
                  ]}
                >
                  <Text>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Ask AI Button */}
            <TouchableOpacity
              style={styles.aiButton}
              onPress={() => setAiChatVisible(!aiChatVisible)}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Ask AI 🤖</Text>
            </TouchableOpacity>

            {/* AI Chat Area */}
            {aiChatVisible && (
              <View style={styles.aiCard}>
                <TextInput
                  style={styles.aiInput}
                  placeholder="Ask AI to help with your todo..."
                  value={aiInput}
                  onChangeText={setAiInput}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleAskAI}>
                  <Text style={{ color: "white" }}>Send</Text>
                </TouchableOpacity>
                {aiResponse ? (
                  <Text style={styles.aiResponse}>{aiResponse}</Text>
                ) : null}
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={{ color: "white", fontWeight: "600" }}>Save Todo</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={{ color: "gray" }}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    maxHeight: "85%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    marginVertical: 6,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  optionSelected: {
    backgroundColor: "#dbeafe",
    borderColor: "#3b82f6",
  },
  aiButton: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  aiCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  aiInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  aiResponse: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  sendBtn: {
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelBtn: {
    alignItems: "center",
    marginTop: 8,
  },
});
