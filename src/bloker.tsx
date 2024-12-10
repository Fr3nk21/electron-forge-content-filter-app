import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WebsiteBlocker = () => {
  const [blockedUrl, setBlockedUrl] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const handleBlockWebsite = () => {
    if (!blockedUrl) return;

    try {
      // Use Electron's remote module to interact with the main process
      const { remote } = window.require("electron");
      const { session } = remote;

      // Block the specific URL
      session.defaultSession.webRequest.onBeforeRequest(
        { urls: [blockedUrl + "*"] },
        (details, callback) => {
          callback({ cancel: true });
        },
      );

      setIsBlocked(true);
    } catch (error) {
      console.error("Error blocking website:", error);
      alert(
        "Failed to block website. Ensure you are running in an Electron environment.",
      );
    }
  };

  const handleUnblockWebsite = () => {
    try {
      const { remote } = window.require("electron");
      const { session } = remote;

      // Remove the web request filter
      session.defaultSession.webRequest.onBeforeRequest(null);

      setIsBlocked(false);
      setBlockedUrl("");
    } catch (error) {
      console.error("Error unblocking website:", error);
    }
  };

  return (
    <Card className="mx-auto mt-10 w-full max-w-md">
      <CardHeader>
        <CardTitle>Website Blocker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter URL to block (e.g., https://example.com)"
            value={blockedUrl}
            onChange={(e) => setBlockedUrl(e.target.value)}
            className="w-full"
          />

          {!isBlocked ? (
            <Button
              onClick={handleBlockWebsite}
              className="w-full"
              disabled={!blockedUrl}
            >
              Block Website
            </Button>
          ) : (
            <Button
              inClick={handleUnblockWebsite}
              variant="destructive"
              className="w-full"
            >
              Unblock Website
            </Button>
          )}

          {isBlocked && (
            <div className="text-center text-red-500">
              Website {blockedUrl} is currently blocked
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteBlocker;
