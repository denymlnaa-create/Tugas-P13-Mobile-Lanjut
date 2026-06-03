import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FETCH_QUOTE_TASK = 'FETCH_QUOTE_TASK';


TaskManager.defineTask(FETCH_QUOTE_TASK, async () => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    
    if (data.content) {
      await AsyncStorage.setItem('@info_kutipan', data.content);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }
    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const startBackgroundSync = async () => {
  try {
    const isAvailable = await BackgroundFetch.getStatusAsync();
    if (isAvailable === BackgroundFetch.BackgroundFetchStatus.Available) {
      await BackgroundFetch.registerTaskAsync(FETCH_QUOTE_TASK, {
        minimumInterval: 15 * 60, 
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background sync berhasil berjalan.');
    }
  } catch (err) {
    console.log('Gagal memulai background sync:', err);
  }
};