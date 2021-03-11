import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeData = async (key: string, value: any) => {
  await AsyncStorage.setItem('@storage_Key', value)
  await AsyncStorage.setItem(key, value)
}

export const getData: (key: string) => Promise<string | null> = async (key) => {
  return await AsyncStorage.getItem(key)
}

export const key_user = "@user"