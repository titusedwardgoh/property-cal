// Common constants shared across all states

export const STATE_OPTIONS = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'NT', label: 'Northern Territory' },
  { value: 'ACT', label: 'Australian Capital Territory' }
];

export const STATE_AVERAGES = {
  NSW: 1200000,
  VIC: 900000,
  QLD: 650000,
  SA: 550000,
  WA: 600000,
  TAS: 450000,
  NT: 500000,
  ACT: 800000
};

// Common PPR requirements by state
export const PPR_REQUIREMENTS = {
  'VIC': 'Must live for 12 months within 12 months of settlement',
  'NSW': 'Must live for 6 months within 12 months of settlement',
  'QLD': 'Must live for 6 months within 12 months of settlement',
  'SA': 'Must live for 6 months within 12 months of settlement',
  'WA': 'Must live for 6 months within 12 months of settlement',
  'TAS': 'Must live for 6 months within 12 months of settlement',
  'ACT': 'Must live for 12 months within 12 months of settlement',
  'NT': 'Must live for 12 months within 12 months of settlement'
};
