import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeData = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value)
}

export const getData: (key: string) => Promise<string | null> = async (key) => {
  return await AsyncStorage.getItem(key)
}

export const removeData = async (key: string) => {
  await AsyncStorage.removeItem(key);
}

export const key_user = "@user";
export const key_token = "@token";