// sanity/preview.ts
import { defineLive } from 'sanity';

const setupLivePreview = () => {
  defineLive({
    serverToken: process.env.SANITY_WRITE_TOKEN,  // Using the server token for write operations
    browserToken: process.env.SANITY_BROWSER_TOKEN,  // Using the browser token for live previews
  });
};

export default setupLivePreview;