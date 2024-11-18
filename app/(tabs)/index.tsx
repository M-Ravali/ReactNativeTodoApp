import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import TaskItem from '@/components/TaskItem'; 
import { getTasks, saveTasks } from '@/utils/storage'; 

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function HomeScreen() {
  const [task, setTask] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await getTasks();
      if (savedTasks) setTasks(savedTasks);
    };
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false }]);
      setTask('');
    }
  };

  const editTask = (taskId: string, newText: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, text: newText } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((item) => item.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const renderTaskItem = ({ item, index }: { item: Task; index: number }) => (
    <Animated.View
      key={item.id}
      style={{
        opacity: 1,
        transform: [{ translateY: 0 }]
      }}
    >
      <TaskItem
        task={item}
        onDelete={deleteTask}
        onToggle={toggleTaskCompletion}
        onEdit={editTask}
      />
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/image.png')}
            style={styles.reactLogo}
          />
        }
      >
        <View style={styles.container}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Welcome to ToDo Application! </ThemedText>
            <HelloWave />
          </ThemedView>
          
          <ThemedView style={styles.stepContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Add a new task"
                value={task}
                onChangeText={setTask}
                onSubmitEditing={addTask}
              />
              <TouchableOpacity style={styles.addButton} onPress={addTask}>
                <ThemedText type="defaultSemiBold" style={{ color: 'white' }}>+</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>

          {tasks.map((item, index) => renderTaskItem({ item, index }))}
        </View>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stepContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#5C5CFF',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  reactLogo: {
    height: 300,
    width: 500,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});