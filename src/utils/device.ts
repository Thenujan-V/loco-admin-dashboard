// src/utils/device.ts
export const DEVICE_ID_KEY = 'deviceId';

export const getOrCreateDeviceId = (): string => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
};
