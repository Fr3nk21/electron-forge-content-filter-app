/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
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
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-center">Website Blocker</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter URL to block (e.g., https://example.com)"
          value={blockedUrl}
          onChange={(e) => setBlockedUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {!isBlocked ? (
          <button
            onClick={handleBlockWebsite}
            disabled={!blockedUrl}
            className="w-full py-2 text-white transition duration-300 bg-blue-500 rounded-md hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Block Website
          </button>
        ) : (
          <button
            onClick={handleUnblockWebsite}
            className="w-full py-2 text-white transition duration-300 bg-red-500 rounded-md hover:bg-red-600"
          >
            Unblock Website
          </button>
        )}

        {isBlocked && (
          <div className="mt-2 font-semibold text-center text-red-500">
            Website {blockedUrl} is currently blocked
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteBlocker;
