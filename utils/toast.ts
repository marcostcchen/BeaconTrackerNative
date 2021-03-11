interface ToastConfig {
  text: string,
  buttonText: string,
  duration: number,
  type?: "danger" | "success" | "warning",
}

export const ToastDanger = (text: string, duration: number = 5000): ToastConfig => {
  return {
    text,
    duration,
    buttonText: 'Fechar',
    type: "danger",
  }
}

export const ToastWarning = (text: string, duration: number = 5000): ToastConfig => {
  return {
    text,
    duration,
    buttonText: 'Fechar',
    type: "warning",
  }
}

export const ToastSuccess = (text: string, duration: number = 5000): ToastConfig => {
  return {
    text,
    duration,
    buttonText: 'Fechar',
    type: "success",
  }
}