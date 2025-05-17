// services/youtubeAPI.ts

let isScriptLoaded = false;
let loadPromise: Promise<void> | null = null;

export const loadYouTubeAPI = (): Promise<void> => {
    if (isScriptLoaded) {
        return Promise.resolve();
    }
    if (loadPromise) {
        return loadPromise;
    }

    loadPromise = new Promise((resolve) => {
        const existingScript = document.getElementById('youtube-iframe-api');
        if (existingScript) {
            resolve();
            return;
        }

        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            isScriptLoaded = true;
            resolve();
        };
    });
    return loadPromise;
};
