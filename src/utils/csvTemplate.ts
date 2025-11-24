import * as XLSX from 'xlsx';

export interface LocationCSVRow {
  name: string;
  category: string;
  subcategory?: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  latitude: number;
  longitude: number;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  capacity?: number;
  best_for?: string;
  accessibility_notes?: string;
}

const TEMPLATE_HEADERS = [
  'Name*',
  'Category*',
  'Subcategory',
  'Address*',
  'Suburb*',
  'State*',
  'Postcode*',
  'Country',
  'Latitude*',
  'Longitude*',
  'Description',
  'Email',
  'Phone',
  'Website',
  'Instagram',
  'Capacity',
  'Best For',
  'Accessibility Notes'
];

const EXAMPLE_ROW = [
  'Example Venue',
  'Venue',
  'Music Venue',
  '123 Main Street',
  'Melbourne',
  'VIC',
  '3000',
  'Australia',
  '-37.8136',
  '144.9631',
  'A great live music venue in the heart of Melbourne',
  'contact@examplevenue.com',
  '0412345678',
  'https://examplevenue.com',
  '@examplevenue',
  '200',
  'Live music, Events, Functions',
  'Wheelchair accessible, Accessible bathrooms'
];

const VALIDATION_NOTES = [
  'Required field',
  'Must be: Venue, Studio, Festival, Label, Management, Services, Education, Government/Peak Body, Community Organisation, Co-working/Creative Hub, Gallery/Arts Space, or Other',
  'Optional additional category detail',
  'Full street address',
  'Suburb/City name',
  'VIC, NSW, QLD, SA, WA, TAS, NT, or ACT',
  '4 digit postcode',
  'Default: Australia',
  'Decimal number between -90 and 90',
  'Decimal number between -180 and 180',
  'Optional detailed description',
  'Valid email format',
  'Phone number',
  'Must start with http:// or https://',
  'Instagram handle starting with @',
  'Number of people',
  'Comma-separated tags',
  'Accessibility information'
];

export function generateCSVTemplate(): Blob {
  const rows = [
    TEMPLATE_HEADERS,
    EXAMPLE_ROW,
    VALIDATION_NOTES
  ];

  const csvContent = rows
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

export function generateXLSXTemplate(): Blob {
  const worksheet = XLSX.utils.aoa_to_sheet([
    TEMPLATE_HEADERS,
    EXAMPLE_ROW,
    VALIDATION_NOTES
  ]);

  // Set column widths for better readability
  const columnWidths = TEMPLATE_HEADERS.map((_, index) => ({ wch: index === 10 ? 40 : 20 }));
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Locations Template');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function downloadTemplate(type: 'csv' | 'xlsx') {
  const blob = type === 'csv' ? generateCSVTemplate() : generateXLSXTemplate();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `locations-template.${type}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
