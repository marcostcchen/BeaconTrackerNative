interface ToastConfig {
  text1: string,
  text2: string,
  visibilityTime: number,
  type: "success" | "error" | "info",
}

export const ToastDanger = (text1: string, text2: string, duration: number = 5000): ToastConfig => {
  return {
    text1,
    text2,
    visibilityTime: duration,
    type: "error",
  }
}

export const ToastWarning = (text1: string, text2: string, duration: number = 5000): ToastConfig => {
  return {
    text1,
    text2,
    visibilityTime: duration,
    type: "info",
  }
}

export const ToastSuccess = (text1: string, text2: string, duration: number = 5000): ToastConfig => {
  return {
    text1,
    text2,
    visibilityTime: duration,
    type: "success",
  }
}