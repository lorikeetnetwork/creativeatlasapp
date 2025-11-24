import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { LocationCSVRow } from './csvTemplate';

export interface ParsedLocation extends LocationCSVRow {
  rowNumber: number;
}

export interface InvalidLocation {
  rowNumber: number;
  data: Partial<LocationCSVRow>;
  errors: string[];
}

export interface ParsedResult {
  valid: ParsedLocation[];
  invalid: InvalidLocation[];
}

const VALID_CATEGORIES = [
  'Venue',
  'Studio',
  'Festival',
  'Label',
  'Management',
  'Services',
  'Education',
  'Government/Peak Body',
  'Community Organisation',
  'Co-working/Creative Hub',
  'Gallery/Arts Space',
  'Other'
];

const VALID_STATES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .replace(/\*/g, '')
    .replace(/\s+/g, '_')
    .trim();
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateURL(url: string): boolean {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
}

function validateLocationRow(row: any, rowNumber: number): { isValid: boolean; errors: string[]; data: Partial<LocationCSVRow> } {
  const errors: string[] = [];
  const data: Partial<LocationCSVRow> = {};

  // Required fields
  const name = row.name?.toString().trim();
  if (!name) {
    errors.push('Name is required');
  } else {
    data.name = name;
  }

  const category = row.category?.toString().trim();
  if (!category) {
    errors.push('Category is required');
  } else if (!VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  } else {
    data.category = category;
  }

  const address = row.address?.toString().trim();
  if (!address) {
    errors.push('Address is required');
  } else {
    data.address = address;
  }

  const suburb = row.suburb?.toString().trim();
  if (!suburb) {
    errors.push('Suburb is required');
  } else {
    data.suburb = suburb;
  }

  const state = row.state?.toString().trim().toUpperCase();
  if (!state) {
    errors.push('State is required');
  } else if (!VALID_STATES.includes(state)) {
    errors.push(`State must be one of: ${VALID_STATES.join(', ')}`);
  } else {
    data.state = state;
  }

  const postcode = row.postcode?.toString().trim();
  if (!postcode) {
    errors.push('Postcode is required');
  } else if (!/^\d{4}$/.test(postcode)) {
    errors.push('Postcode must be 4 digits');
  } else {
    data.postcode = postcode;
  }

  const latitude = parseFloat(row.latitude);
  if (isNaN(latitude)) {
    errors.push('Latitude is required and must be a number');
  } else if (latitude < -90 || latitude > 90) {
    errors.push('Latitude must be between -90 and 90');
  } else {
    data.latitude = latitude;
  }

  const longitude = parseFloat(row.longitude);
  if (isNaN(longitude)) {
    errors.push('Longitude is required and must be a number');
  } else if (longitude < -180 || longitude > 180) {
    errors.push('Longitude must be between -180 and 180');
  } else {
    data.longitude = longitude;
  }

  // Optional fields with validation
  data.country = row.country?.toString().trim() || 'Australia';

  if (row.subcategory) {
    data.subcategory = row.subcategory.toString().trim();
  }

  if (row.description) {
    data.description = row.description.toString().trim();
  }

  if (row.email) {
    const email = row.email.toString().trim();
    if (!validateEmail(email)) {
      errors.push('Email must be valid format');
    } else {
      data.email = email;
    }
  }

  if (row.phone) {
    data.phone = row.phone.toString().trim();
  }

  if (row.website) {
    const website = row.website.toString().trim();
    if (!validateURL(website)) {
      errors.push('Website must start with http:// or https://');
    } else {
      data.website = website;
    }
  }

  if (row.instagram) {
    const instagram = row.instagram.toString().trim();
    if (!instagram.startsWith('@')) {
      errors.push('Instagram must start with @');
    } else {
      data.instagram = instagram;
    }
  }

  if (row.capacity) {
    const capacity = parseInt(row.capacity);
    if (isNaN(capacity) || capacity < 0) {
      errors.push('Capacity must be a positive number');
    } else {
      data.capacity = capacity;
    }
  }

  if (row.best_for) {
    data.best_for = row.best_for.toString().trim();
  }

  if (row.accessibility_notes) {
    data.accessibility_notes = row.accessibility_notes.toString().trim();
  }

  return {
    isValid: errors.length === 0,
    errors,
    data
  };
}

async function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeHeader,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

async function parseXLSX(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: ''
        });

        // Skip validation notes row and convert to objects
        const headers = (jsonData[0] as string[]).map(normalizeHeader);
        const dataRows = jsonData.slice(1).filter((row: any) => {
          // Skip empty rows and the validation notes row
          return row.some((cell: any) => cell !== '' && cell !== null && cell !== undefined);
        });

        const objects = dataRows.map((row: any) => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });

        resolve(objects);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}

export async function parseLocationFile(file: File): Promise<ParsedResult> {
  const valid: ParsedLocation[] = [];
  const invalid: InvalidLocation[] = [];

  try {
    let rows: any[];

    if (file.name.endsWith('.csv')) {
      rows = await parseCSV(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      rows = await parseXLSX(file);
    } else {
      throw new Error('Unsupported file format. Please upload a CSV or XLSX file.');
    }

    rows.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because of header and 0-indexing
      const validation = validateLocationRow(row, rowNumber);

      if (validation.isValid) {
        valid.push({
          ...(validation.data as LocationCSVRow),
          rowNumber
        });
      } else {
        invalid.push({
          rowNumber,
          data: validation.data,
          errors: validation.errors
        });
      }
    });

    return { valid, invalid };
  } catch (error) {
    console.error('Error parsing file:', error);
    throw error;
  }
}
