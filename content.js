console.log("YouTube Clean Feed is running!");

let currentVideoId = null;
let lastLoggedPercentage = -1;
let videoSaved = false;

function getCurrentVideoId() {
    const url = new URL(window.location.href);

    if (url.pathname === "/watch") {
        return url.searchParams.get("v");
    }

    return null;
}

function saveWatchedVideo(videoId, percentage) {
    chrome.storage.local.get(["watchedVideos"], (result) => {
        const watchedVideos = result.watchedVideos || [];

        if (!watchedVideos.includes(videoId)) {
            watchedVideos.push(videoId);

            chrome.storage.local.set({
                watchedVideos: watchedVideos
            });

            console.log(
                "Video saved:",
                videoId,
                "at",
                percentage + "%"
            );
        }
    });
}

function checkWatchProgress() {
    const video = document.querySelector("video");

    if (!video) return;

    const videoId = getCurrentVideoId();

    if (!videoId) return;

    if (videoId !== currentVideoId) {
        currentVideoId = videoId;
        lastLoggedPercentage = -1;
        videoSaved = false;

        console.log("Currently watching:", videoId);
    }

    if (video.duration && !isNaN(video.duration)) {

        const percentage = Math.floor(
            (video.currentTime / video.duration) * 100
        );

        if (percentage !== lastLoggedPercentage) {
            lastLoggedPercentage = percentage;

            console.log(
                "Watch progress:",
                percentage + "%"
            );
        }

        // Temporary threshold: 50%
        if (percentage >= 50 && !videoSaved) {
            saveWatchedVideo(videoId, percentage);
            videoSaved = true;
        }
    }
}

setInterval(checkWatchProgress, 1000);
chrome.storage.local.get("watchedVideos", (result) => {
    console.log("Stored watched videos:", result.watchedVideos);
});