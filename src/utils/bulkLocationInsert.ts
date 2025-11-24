import { supabase } from '@/integrations/supabase/client';
import { LocationCSVRow } from './csvTemplate';

export interface BulkInsertOptions {
  status: 'Active' | 'Pending';
  skipDuplicates: boolean;
  userId: string;
}

export interface BulkInsertResult {
  successful: number;
  failed: Array<{ row: LocationCSVRow; error: string }>;
  skipped: number;
}

async function checkDuplicateAddress(address: string, suburb: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('locations')
    .select('id')
    .eq('address', address)
    .eq('suburb', suburb)
    .maybeSingle();

  if (error) {
    console.error('Error checking duplicate:', error);
    return false;
  }

  return !!data;
}

export async function bulkInsertLocations(
  locations: LocationCSVRow[],
  options: BulkInsertOptions
): Promise<BulkInsertResult> {
  const result: BulkInsertResult = {
    successful: 0,
    failed: [],
    skipped: 0
  };

  // Process in batches of 50 for better performance and error handling
  const batchSize = 50;
  
  for (let i = 0; i < locations.length; i += batchSize) {
    const batch = locations.slice(i, i + batchSize);
    const locationsToInsert: any[] = [];

    // Check for duplicates if needed
    for (const location of batch) {
      if (options.skipDuplicates) {
        const isDuplicate = await checkDuplicateAddress(location.address, location.suburb);
        if (isDuplicate) {
          result.skipped++;
          continue;
        }
      }

      locationsToInsert.push({
        name: location.name,
        category: location.category,
        subcategory: location.subcategory || null,
        address: location.address,
        suburb: location.suburb,
        state: location.state,
        postcode: location.postcode,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        description: location.description || null,
        email: location.email || null,
        phone: location.phone || null,
        website: location.website || null,
        instagram: location.instagram || null,
        capacity: location.capacity || null,
        best_for: location.best_for || null,
        accessibility_notes: location.accessibility_notes || null,
        status: options.status,
        source: 'AdminImported',
        owner_user_id: options.userId
      });
    }

    // Insert the batch
    if (locationsToInsert.length > 0) {
      const { data, error } = await supabase
        .from('locations')
        .insert(locationsToInsert)
        .select();

      if (error) {
        console.error('Batch insert error:', error);
        // Add all failed locations from this batch
        locationsToInsert.forEach((loc, index) => {
          result.failed.push({
            row: batch[index],
            error: error.message
          });
        });
      } else {
        result.successful += data?.length || 0;
      }
    }
  }

  return result;
}

export function exportFailedRows(failed: Array<{ row: LocationCSVRow; error: string }>): Blob {
  const headers = [
    'Name',
    'Category',
    'Subcategory',
    'Address',
    'Suburb',
    'State',
    'Postcode',
    'Country',
    'Latitude',
    'Longitude',
    'Description',
    'Email',
    'Phone',
    'Website',
    'Instagram',
    'Capacity',
    'Best For',
    'Accessibility Notes',
    'Error'
  ];

  const rows = failed.map(({ row, error }) => [
    row.name,
    row.category,
    row.subcategory || '',
    row.address,
    row.suburb,
    row.state,
    row.postcode,
    row.country,
    row.latitude.toString(),
    row.longitude.toString(),
    row.description || '',
    row.email || '',
    row.phone || '',
    row.website || '',
    row.instagram || '',
    row.capacity?.toString() || '',
    row.best_for || '',
    row.accessibility_notes || '',
    error
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}
