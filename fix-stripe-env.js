import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your .env file
const envPath = path.resolve(__dirname, '.env.local');
console.log(`Looking for .env.local at: ${envPath}`);

// Function to fix the Stripe keys
function fixStripeKeys() {
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
    
    let inStripeKey = false;
    let currentKey = '';
    let currentValue = '';
    
    for (const line of lines) {
      // Check if this line contains a Stripe key
      if (line.startsWith('STRIPE_')) {
        console.log(`Processing Stripe key: ${line.substring(0, line.indexOf('=') > 0 ? line.indexOf('=') : line.length)}`);
        const parts = line.split('=');
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        
        // If this is a continuation of a previous key, ignore it
        if (inStripeKey) {
          currentValue += value.replace(/\s+/g, '');
          console.log(`Continuing previous key ${currentKey}, new value length: ${currentValue.length}`);
          continue;
        }
        
        // Start a new Stripe key
        inStripeKey = true;
        currentKey = key;
        currentValue = value.replace(/\s+/g, '');
        console.log(`New Stripe key ${currentKey}, value length: ${currentValue.length}`);
        
        // Check if the value is complete (ends with a complete key format)
        if (key.includes('SECRET_KEY') && 
            (currentValue.startsWith('sk_test_') || currentValue.startsWith('sk_live_'))) {
          if (currentValue.length >= 30) {
            updatedLines.push(`${currentKey}=${currentValue}`);
            console.log(`Added complete SECRET_KEY, length: ${currentValue.length}`);
            inStripeKey = false;
          }
        } else if (key.includes('PUBLISHABLE_KEY') && 
                  (currentValue.startsWith('pk_test_') || currentValue.startsWith('pk_live_'))) {
          if (currentValue.length >= 30) {
            updatedLines.push(`${currentKey}=${currentValue}`);
            console.log(`Added complete PUBLISHABLE_KEY, length: ${currentValue.length}`);
            inStripeKey = false;
          }
        } else if (key.includes('WEBHOOK_SECRET') && 
                  currentValue.startsWith('whsec_')) {
          if (currentValue.length >= 30) {
            updatedLines.push(`${currentKey}=${currentValue}`);
            console.log(`Added complete WEBHOOK_SECRET, length: ${currentValue.length}`);
            inStripeKey = false;
          }
        } else if (key.includes('PRICE_')) {
          // Price IDs should start with 'price_'
          if (currentValue.startsWith('price_') || currentValue === '') {
            updatedLines.push(`${currentKey}=${currentValue}`);
            console.log(`Added PRICE_ key: ${key}=${currentValue.substring(0, Math.min(4, currentValue.length))}...`);
            inStripeKey = false;
          }
        } else {
          // Other Stripe keys - just add them normally
          updatedLines.push(line);
          console.log(`Added other Stripe key: ${key}`);
          inStripeKey = false;
        }
      } else if (inStripeKey) {
        // This is a continuation of a Stripe key value
        currentValue += line.replace(/\s+/g, '');
        console.log(`Continuing Stripe key ${currentKey}, new value length: ${currentValue.length}`);
        
        // Check if the key is now complete
        if (currentKey.includes('SECRET_KEY') && 
            (currentValue.startsWith('sk_test_') || currentValue.startsWith('sk_live_'))) {
          if (currentValue.length >= 30) {
            updatedLines.push(`${currentKey}=${currentValue}`);
            console.log(`Completed SECRET_KEY, total length: ${currentValue.length}`);
            inStripeKey = false;
          }
        } else if (currentKey.includes('PUBLISHABLE_KEY') && 
                  (currentValue.startsWith('pk_test_') || currentValue.startsWith('pk_live_'))) {
          if (currentValue.length >= 30) {
            updatedLines.push(`${currentKey}=${currentValue}`);
            console.log(`Completed PUBLISHABLE_KEY, total length: ${currentValue.length}`);
            inStripeKey = false;
          }
        } else if (currentKey.includes('WEBHOOK_SECRET') && 
                  currentValue.startsWith('whsec_')) {
          if (currentValue.length >= 30) {
            updatedLines.push(`${currentKey}=${currentValue}`);
            console.log(`Completed WEBHOOK_SECRET, total length: ${currentValue.length}`);
            inStripeKey = false;
          }
        }
      } else {
        // Regular line, not a Stripe key
        updatedLines.push(line);
      }
    }
    
    // Handle any remaining Stripe key
    if (inStripeKey) {
      updatedLines.push(`${currentKey}=${currentValue}`);
      console.log(`Added remaining Stripe key: ${currentKey}, length: ${currentValue.length}`);
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(envPath, updatedLines.join('\n'));
    console.log('Updated .env.local file with fixed Stripe keys');
    
    // Display the fixed keys (with values partially masked)
    const fixedEnv = fs.readFileSync(envPath, 'utf8');
    const stripeLines = fixedEnv.split('\n').filter(line => line.startsWith('STRIPE_'));
    
    console.log('\nFixed Stripe environment variables:');
    for (const line of stripeLines) {
      const parts = line.split('=');
      const key = parts[0];
      let value = parts.slice(1).join('=');
      
      // Mask the value for security
      if (value && value.length > 8) {
        value = value.substring(0, 8) + '...' + value.substring(value.length - 4);
      }
      
      console.log(`${key}=${value}`);
    }
    
    console.log('\nDone! Please restart your Next.js server for the changes to take effect.');
  } catch (error) {
    console.error('Error processing .env file:', error);
    console.error(error.stack);
  }
}

// Run the function
fixStripeKeys(); 