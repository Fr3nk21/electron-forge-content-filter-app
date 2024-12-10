import React, { useState } from "react";
import { ipcRenderer } from "electron";

const WebsiteBlocker = () => {
  const [blockedUrl, setBlockedUrl] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const handleBlockWebsite = async () => {
    if (!blockedUrl) return;

    try {
      // Electron-level blocking
      const { remote } = window.require("electron");
      const { session } = remote;

      // Block the specific URL in Electron
      session.defaultSession.webRequest.onBeforeRequest(
        { urls: [blockedUrl + "*"] },
        (details, callback) => {
          callback({ cancel: true });
        },
      );

      // System-wide blocking via IPC
      const result = await ipcRenderer.invoke("block-website", blockedUrl);

      if (result) {
        setIsBlocked(true);
      } else {
        throw new Error("Failed to block website system-wide");
      }
    } catch (error) {
      console.error("Error blocking website:", error);
      alert("Failed to block website. Check console for details.");
    }
  };

  const handleUnblockWebsite = async () => {
    try {
      // Electron-level unblocking
      const { remote } = window.require("electron");
      const { session } = remote;

      // Remove the web request filter
      session.defaultSession.webRequest.onBeforeRequest(null);

      // System-wide unblocking via IPC
      const result = await ipcRenderer.invoke("unblock-website", blockedUrl);

      if (result) {
        setIsBlocked(false);
        setBlockedUrl("");
      } else {
        throw new Error("Failed to unblock website system-wide");
      }
    } catch (error) {
      console.error("Error unblocking website:", error);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold">Website Blocker</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter URL to block (e.g., https://example.com)"
          value={blockedUrl}
          onChange={(e) => setBlockedUrl(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {!isBlocked ? (
          <button
            onClick={handleBlockWebsite}
            disabled={!blockedUrl}
            className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Block Website
          </button>
        ) : (
          <button
            onClick={handleUnblockWebsite}
            className="w-full rounded-md bg-red-500 py-2 text-white transition duration-300 hover:bg-red-600"
          >
            Unblock Website
          </button>
        )}

        {isBlocked && (
          <div className="mt-2 text-center font-semibold text-red-500">
            Website {blockedUrl} is currently blocked
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteBlocker;
