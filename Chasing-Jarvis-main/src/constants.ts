/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Appliance } from './types';

export const DEFAULT_APPLIANCES: Appliance[] = [
  { id: '1', name: 'Refrigerator', powerWatts: 150, category: 'Kitchen' },
  { id: '2', name: 'LED Light Bulb', powerWatts: 10, category: 'Lighting' },
  { id: '3', name: 'Air Conditioner (1.5HP)', powerWatts: 1500, category: 'HVAC' },
  { id: '4', name: 'Television (55")', powerWatts: 100, category: 'Entertainment' },
  { id: '5', name: 'Laptop', powerWatts: 60, category: 'Other' },
  { id: '6', name: 'Microwave', powerWatts: 1200, category: 'Kitchen' },
  { id: '7', name: 'Washing Machine', powerWatts: 500, category: 'Other' },
  { id: '8', name: 'Fan', powerWatts: 75, category: 'Other' },
  { id: '9', name: 'Electric Kettle', powerWatts: 2000, category: 'Kitchen' },
  { id: '10', name: 'Desktop PC', powerWatts: 300, category: 'Entertainment' },
];
