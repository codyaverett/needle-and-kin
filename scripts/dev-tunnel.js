#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, '..', 'nuxt.config.ts');

function updateNuxtConfig(ngrokUrl) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  const hostname = ngrokUrl.replace('https://', '');
  
  // Replace the allowedHosts array with the new ngrok URL
  const updatedContent = configContent.replace(
    /allowedHosts:\s*\[.*?\]/,
    `allowedHosts: ['*.ngrok-free.app', '${hostname}']`
  );
  
  fs.writeFileSync(configPath, updatedContent);
  console.log(`Updated nuxt.config.ts with ngrok URL: ${hostname}`);
}

// Start ngrok
console.log('Starting ngrok tunnel...');
const ngrok = spawn('ngrok', ['http', '3000', '--log=stdout'], { stdio: 'pipe' });

let urlFound = false;

ngrok.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  // Look for the ngrok URL in the output - try multiple patterns
  const urlPatterns = [
    /https:\/\/[a-zA-Z0-9-]+\.ngrok-free\.app/,
    /https:\/\/[a-zA-Z0-9-]+\.ngrok\.io/,
    /url=https:\/\/[a-zA-Z0-9-]+\.ngrok[^\\s]*/,
    /Forwarding\s+https:\/\/[a-zA-Z0-9-]+\.ngrok[^\\s]*/
  ];
  
  for (const pattern of urlPatterns) {
    const urlMatch = output.match(pattern);
    if (urlMatch && !urlFound) {
      let ngrokUrl = urlMatch[0];
      // Clean up the URL if it has extra text
      ngrokUrl = ngrokUrl.replace(/^url=/, '').replace(/^Forwarding\s+/, '');
      console.log(`Ngrok tunnel established: ${ngrokUrl}`);
      updateNuxtConfig(ngrokUrl);
      urlFound = true;
      break;
    }
  }
});

ngrok.stderr.on('data', (data) => {
  console.error(data.toString());
});

ngrok.on('close', (code) => {
  console.log(`Ngrok process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down ngrok tunnel...');
  ngrok.kill();
  process.exit();
});