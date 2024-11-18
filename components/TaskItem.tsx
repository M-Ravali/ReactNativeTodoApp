import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Animated } from 'react-native';

interface TaskItemProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
  };
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggle, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(task.completed ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation when component mounts
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDelete = (id: string) => {
    // Exit animation before deletion
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDelete(id));
  };

  const handleToggle = (id: string) => {
    // Checkbox animation
    Animated.spring(checkAnim, {
      toValue: task.completed ? 0 : 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    onToggle(id);
  };

  const handleEdit = () => {
    if (editing) {
      onEdit(task.id, newText);
    }
    setEditing(!editing);
  };

  // Interpolate animations for various properties
  const slideTransform = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const checkboxScale = checkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  return (
    <Animated.View
      style={[
        styles.taskContainer,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateX: slideTransform },
          ],
        },
      ]}
    >
      <TouchableOpacity 
        onPress={() => handleToggle(task.id)}
        style={styles.checkboxContainer}
      >
        <Animated.View
          style={[
            styles.checkbox,
            {
              transform: [{ scale: checkboxScale }],
              backgroundColor: checkAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['#ffffff', '#5C5CFF'],
              }),
            },
          ]}
        />
      </TouchableOpacity>

      {editing ? (
        <TextInput
          style={styles.input}
          value={newText}
          onChangeText={setNewText}
          onSubmitEditing={handleEdit}
          autoFocus
        />
      ) : (
        <Text 
          style={[
            styles.taskText,
            task.completed && styles.completedTaskText
          ]}
        >
          {task.text}
        </Text>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleEdit}>
          <Text style={styles.editButton}>
            {editing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(task.id)}>
          <Text style={styles.deleteButton}>X</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'white',
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5C5CFF',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteButton: {
    color: '#FF5C5C',
    fontWeight: 'bold',
    fontSize: 18,
  },
  editButton: {
    color: '#5C5CFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#5C5CFF',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default TaskItem;