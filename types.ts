
export enum Screen {
  HOME = 'HOME',
  DEVICES = 'DEVICES',
  NOTIFICATIONS = 'NOTIFICATIONS',
  ACCOUNT = 'ACCOUNT',
}

export enum SupportView {
  MAIN = 'MAIN',
  FORM = 'FORM',
  STATUS = 'STATUS',
}

export type DeviceMode = 'ON' | 'OFF' | 'ECO';

export interface Device {
  id: string;
  name: string;
  type: 'AC' | 'WASHER' | 'FRIDGE' | 'TV';
  mode: DeviceMode;
  statusDetails: string; // e.g., "24°C Cool" or "Spinning"
  energy: string;
}

export interface Ticket {
  id: string;
  device: string;
  issue: string;
  status: 'Received' | 'In Progress' | 'Completed';
  priority: 'Mild' | 'Medium' | 'Severe';
  date: string;
  response?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'alert' | 'offer';
  read: boolean;
}
