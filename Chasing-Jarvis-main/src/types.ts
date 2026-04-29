/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Appliance {
  id: string;
  name: string;
  powerWatts: number;
  category: 'Kitchen' | 'Entertainment' | 'Lighting' | 'HVAC' | 'Other';
}

export interface EstimatedUse {
  applianceId: string;
  hoursPerDay: number;
  quantity: number;
}

export interface LogEntry {
  id: string;
  date: string;
  kwh: number;
  habit: string;
}

export interface BackupOption {
  id: string;
  name: string;
  type: 'Inverter' | 'Solar' | 'Generator';
  capacity: string;
  priceRange: string;
  description: string;
  suitability: string;
}
