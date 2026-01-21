export const promiseHelper = {
  delay(ms: number = 0): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  },
};
