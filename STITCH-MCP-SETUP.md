# Stitch MCP Setup Guide

## Current Status: ✅ Connected

Stitch MCP server is now configured in OpenCode using remote API key authentication.

```
●  ✓ stitch [connected]
   https://stitch.googleapis.com/mcp
```

## How to Get Your Stitch API Key

1. **Visit Stitch:**
   Go to https://stitch.withgoogle.com

2. **Open Settings:**
   - Click on your profile icon in the top-right corner
   - Select "Stitch Settings" from the dropdown menu

3. **Generate API Key:**
   - Go to the "API Keys" section
   - Click "Create Key"
   - Copy the generated API key

4. **Set Environment Variable:**
   ```bash
   export GOOGLE_STITCH_API_KEY="your-api-key-here"
   ```

5. **Verify Connection:**
   ```bash
   opencode mcp list
   ```

## What Stitch MCP Can Do

Once authenticated, Stitch MCP provides tools for:
- **Project Management:** List and create Stitch projects
- **Screen Management:** List, create, fetch screens
- **Design Generation:** Generate screens from text prompts
- **Asset Download:** Download images and HTML/code from screens
- **Design System Export:** Export design tokens and components

## Usage in OpenCode

To use Stitch tools in your prompts, include:
```
use stitch tool to [your request]
```

Example:
```
use stitch tool to create a new project called "PostgreSQL Backup Dashboard"
use stitch tool to generate a dashboard screen with black background and green accents
```

## Next Steps

1. Get your API key from Stitch settings
2. Set the `GOOGLE_STITCH_API_KEY` environment variable
3. Start building with OpenCode and Stitch as your design system source of truth!
