import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your .env file
const envPath = path.resolve(__dirname, '.env.local');
console.log(`Looking for .env.local at: ${envPath}`);

// Function to fix the app URL
function fixAppUrl() {
  console.log('Reading .env.local file...');
  
  try {
    // Read the current .env file
    if (!fs.existsSync(envPath)) {
      console.error('Error: .env.local file does not exist');
      return;
    }
    
    console.log('.env.local file found');
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log(`File size: ${envContent.length} bytes`);
    
    // Create backup
    const backupPath = `${envPath}.backup.${Date.now()}`;
    fs.writeFileSync(backupPath, envContent);
    console.log(`Created backup at ${backupPath}`);
    
    // Process each environment variable
    const lines = envContent.split('\n');
    console.log(`Found ${lines.length} lines in .env.local`);
    const updatedLines = [];
    
    let appUrlUpdated = false;
    
    for (const line of lines) {
      // Check if this line contains the APP_URL variable
      if (line.startsWith('NEXT_PUBLIC_APP_URL=')) {
        console.log(`Found NEXT_PUBLIC_APP_URL: ${line}`);
        
        // Extract the value
        const parts = line.split('=');
        let value = parts.slice(1).join('=').trim();
        
        // Ensure it has a proper scheme
        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
          const updatedValue = `https://${value}`;
          console.log(`Updating NEXT_PUBLIC_APP_URL from "${value}" to "${updatedValue}"`);
          updatedLines.push(`NEXT_PUBLIC_APP_URL=${updatedValue}`);
          appUrlUpdated = true;
        } else {
          // Already has a scheme or is empty
          updatedLines.push(line);
          console.log(`NEXT_PUBLIC_APP_URL already has a scheme or is empty`);
        }
      } else {
        updatedLines.push(line);
      }
    }
    
    // If APP_URL wasn't found, add it with localhost default
    if (!appUrlUpdated && !updatedLines.some(line => line.startsWith('NEXT_PUBLIC_APP_URL='))) {
      console.log('NEXT_PUBLIC_APP_URL not found in .env.local, adding it');
      updatedLines.push('NEXT_PUBLIC_APP_URL=https://localhost:3000');
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(envPath, updatedLines.join('\n'));
    console.log('Updated .env.local file with fixed APP_URL');
    
    // Log the updated APP_URL value
    const newEnvContent = fs.readFileSync(envPath, 'utf8');
    const appUrlLine = newEnvContent.split('\n').find(line => line.startsWith('NEXT_PUBLIC_APP_URL='));
    if (appUrlLine) {
      console.log(`Updated NEXT_PUBLIC_APP_URL: ${appUrlLine}`);
    }
    
    console.log('\nDone! Please restart your Next.js server for the changes to take effect.');
  } catch (error) {
    console.error('Error processing .env file:', error);
    console.error(error.stack);
  }
}

// Run the function
fixAppUrl(); 