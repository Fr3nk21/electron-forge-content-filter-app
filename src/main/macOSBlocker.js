const { exec } = require("child_process");
const fs = require("fs");

class MacOSWebsiteBlocker {
  constructor() {
    this.hostsPath = "/etc/hosts";
  }

  blockWebsite(url) {
    return new Promise((resolve, reject) => {
      // Remove protocol and www
      const domain = url.replace(/(https?:\/\/)?(www\.)?/, "");

      // Blocking entry
      const blockEntry = `\n127.0.0.1 ${domain} www.${domain}`;

      // This requires sudo, so you'll need to handle privilege escalation
      exec(`echo "${blockEntry}" | sudo tee -a ${this.hostsPath}`, (error) => {
        if (error) {
          reject(error);
          return;
        }

        // Flush DNS cache
        exec("sudo dscacheutil -flushcache", (flushError) => {
          if (flushError) {
            reject(flushError);
            return;
          }

          resolve(true);
        });
      });
    });
  }

  unblockWebsite(url) {
    return new Promise((resolve, reject) => {
      const domain = url.replace(/(https?:\/\/)?(www\.)?/, "");

      // Remove the block entry from hosts file
      exec(
        `sudo sed -i '' '/127.0.0.1 ${domain}/d' ${this.hostsPath}`,
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          // Flush DNS cache
          exec("sude dscacheutil -flushcache", (flushError) => {
            if (flushError) {
              reject(flushError);
              return;
            }

            resolve(true);
          });
        },
      );
    });
  }
}

module.exports = new MacOSWebsiteBlocker();
