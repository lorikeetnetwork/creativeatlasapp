import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { downloadTemplate } from '@/utils/csvTemplate';
import { parseLocationFile, ParsedResult } from '@/utils/csvParser';
import { bulkInsertLocations, exportFailedRows } from '@/utils/bulkLocationInsert';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export function BulkImport() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResult | null>(null);
  const [setActiveImmediately, setSetActiveImmediately] = useState(true);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(selectedFile.type) && 
        !selectedFile.name.endsWith('.csv') && 
        !selectedFile.name.endsWith('.xlsx') && 
        !selectedFile.name.endsWith('.xls')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a CSV or XLSX file.',
        variant: 'destructive'
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'File size must be less than 5MB.',
        variant: 'destructive'
      });
      return;
    }

    setFile(selectedFile);
    setParsedData(null);
  };

  const handleParseFile = async () => {
    if (!file) return;

    setParsing(true);
    try {
      const result = await parseLocationFile(file);
      setParsedData(result);
      
      toast({
        title: 'File Parsed Successfully',
        description: `Found ${result.valid.length} valid locations and ${result.invalid.length} invalid rows.`
      });
    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        title: 'Parse Error',
        description: error instanceof Error ? error.message : 'Failed to parse file.',
        variant: 'destructive'
      });
    } finally {
      setParsing(false);
    }
  };

  const handleImport = async () => {
    if (!parsedData || parsedData.valid.length === 0) return;

    setImporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const result = await bulkInsertLocations(parsedData.valid, {
        status: setActiveImmediately ? 'Active' : 'Pending',
        skipDuplicates,
        userId: user.id
      });

      toast({
        title: 'Import Complete',
        description: `Successfully imported ${result.successful} locations. ${result.skipped} duplicates skipped. ${result.failed.length} failed.`
      });

      // Reset form
      setFile(null);
      setParsedData(null);

      // Download failed rows if any
      if (result.failed.length > 0) {
        const blob = exportFailedRows(result.failed);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'failed-imports.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error importing locations:', error);
      toast({
        title: 'Import Error',
        description: error instanceof Error ? error.message : 'Failed to import locations.',
        variant: 'destructive'
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadErrorReport = () => {
    if (!parsedData || parsedData.invalid.length === 0) return;

    const headers = ['Row', 'Errors', 'Name', 'Category', 'Address'];
    const rows = parsedData.invalid.map(item => [
      item.rowNumber.toString(),
      item.errors.join('; '),
      item.data.name || '',
      item.data.category || '',
      item.data.address || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'validation-errors.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Template Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Step 1: Download Template
          </CardTitle>
          <CardDescription>
            Download a template file with all required fields and example data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={() => downloadTemplate('csv')} variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
            <Button onClick={() => downloadTemplate('xlsx')} variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download XLSX Template
            </Button>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Required fields are marked with * in the template. Make sure to fill out all required information.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Step 2: Upload File
          </CardTitle>
          <CardDescription>
            Upload your completed CSV or XLSX file (max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your file here, or click to browse
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </div>

          {file && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button onClick={handleParseFile} disabled={parsing}>
                {parsing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  'Parse File'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {parsedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Step 3: Review Data
            </CardTitle>
            <CardDescription>
              Check validation results before importing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{parsedData.valid.length + parsedData.invalid.length}</p>
                  <p className="text-sm text-muted-foreground">Total Rows</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{parsedData.valid.length}</p>
                  <p className="text-sm text-muted-foreground">Valid</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-red-500/10 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{parsedData.invalid.length}</p>
                  <p className="text-sm text-muted-foreground">Invalid</p>
                </div>
              </div>
            </div>

            {parsedData.invalid.length > 0 && (
              <div className="space-y-2">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {parsedData.invalid.length} rows have validation errors and will be skipped during import.
                  </AlertDescription>
                </Alert>
                <Button onClick={downloadErrorReport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Error Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Options */}
      {parsedData && parsedData.valid.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Import Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={setActiveImmediately}
                onCheckedChange={(checked) => setSetActiveImmediately(checked === true)}
              />
              <label htmlFor="active" className="text-sm font-medium cursor-pointer">
                Set all locations to Active immediately (otherwise they'll be Pending for review)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="duplicates"
                checked={skipDuplicates}
                onCheckedChange={(checked) => setSkipDuplicates(checked === true)}
              />
              <label htmlFor="duplicates" className="text-sm font-medium cursor-pointer">
                Skip duplicate addresses (check if location already exists)
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleImport}
                disabled={importing || parsedData.valid.length === 0}
                className="flex-1"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import {parsedData.valid.length} Locations
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setFile(null);
                  setParsedData(null);
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
