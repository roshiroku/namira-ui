# Namira

Namira is a simple web interface designed for quick and secure image conversion. With Namira, you can easily convert images between popular formats without uploading your files to a server, ensuring full transparency and privacy.

## Features

- **Supported Formats:**
  - Input: JPG/JPEG, PNG, WEBP, SVG, AVIF, BMP
  - Output: JPG/JPEG, PNG, WEBP
- **Quality Settings:**
  - Automatic quality detection
  - Manual quality adjustment
- **Batch Processing:**
  - Download converted files individually or as a ZIP archive
- **Local Storage:**
  - Saves app settings locally for repeat use
- **Privacy-Focused:**
  - Fully client-side processing (no server upload required)

## How to Use

1. **Add Images:**
   - Drop files into the app window or click the file picker on the initial screen.
2. **Convert Files:**
   - Use the "Save As" button at the top to choose the desired output format and start the conversion process.
3. **Manage Files:**
   - Add more files by dropping them into the app window again.
   - Clear all files using the "Clear" button at the top.
4. **Adjust Settings:**
   - Access the settings menu by clicking the cog-wheel icon at the top to customize quality and other preferences.

## Deployment

Namira can be viewed directly on [GitHub Pages](https://roshiroku.github.io/namira/) or deployed locally for customization.

### Running Locally

To set up Namira locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/roshiroku/namira.git
   cd namira
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build the project for production:
   ```bash
   npm run build
   ```
5. Preview the production build:
   ```bash
   npm run preview
   ```

## Tech Stack

Namira is built using the following technologies:

- **React** for building the user interface
- **Material-UI** for styling and components
- **JSZip** for ZIP file generation
- **Vite** as the build tool
- **TypeScript** for type-safe development

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve Namira.

---

**Try Namira:** [GitHub Pages](https://roshiroku.github.io/namira/)
