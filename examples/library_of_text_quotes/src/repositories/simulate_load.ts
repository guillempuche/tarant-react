export const simulateLoad: (timeMs?: number) => Promise<void> = async (
  timeMs
) => await new Promise((_) => setTimeout(() => {}, timeMs ?? 1000));
