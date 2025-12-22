/*TypingMind Cloud Sync v4.2 (Google Drive Only Edition)
Original by ITCON, AU | Edited by Enjoy
Modified to strictly support Google Drive only.
-------------------------
Features:
- Sync typingmind database with Google Drive
- Snapshots on demand
- Automatic daily backups
- Detailed logging
- Attachment Sync and backup support
*/

if (window.typingMindCloudSync) {
  console.log("TypingMind Cloud Sync already loaded");
} else {
  window.typingMindCloudSync = true;

  async function retryAsync(operation, options = {}) {
    const {
      maxRetries = 3,
      delay = 1000,
      isRetryable = () => true,
      onRetry = () => {},
    } = options;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries || !isRetryable(error)) {
          throw error;
        }
        const retryDelay = Math.min(
          delay * Math.pow(2, attempt) + Math.random() * 1000,
          30000
        );
        onRetry(error, attempt + 1, retryDelay);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
    throw lastError;
  }

  class ConfigManager {
    constructor() {
      this.PEPPER = "tcs-v3-pepper-!@#$%^&*()";
      this.config = this.loadConfig();
      this.exclusions = this.loadExclusions();
    }
    _obfuscate(str, key) {
      if (!str || !key) return str;
      const combinedKey = key + this.PEPPER;
      let output = "";
      for (let i = 0; i < str.length; i++) {
        const charCode =
          str.charCodeAt(i) ^ combinedKey.charCodeAt(i % combinedKey.length);
        output += String.fromCharCode(charCode);
      }
      return btoa(output);
    }
    _deobfuscate(b64str, key) {
      if (!b64str || !key) return b64str;
      const combinedKey = key + this.PEPPER;
      let output = "";
      const decodedStr = atob(b64str);
      for (let i = 0; i < decodedStr.length; i++) {
        const charCode =
          decodedStr.charCodeAt(i) ^
          combinedKey.charCodeAt(i % combinedKey.length);
        output += String.fromCharCode(charCode);
      }
      return output;
    }
    loadConfig() {
      // Default storageType forced to googleDrive
      const defaults = {
        storageType: "googleDrive",
        syncInterval: 15,
        encryptionKey: "",
        googleClientId: "",
      };
      const stored = {};
      const encryptionKey = localStorage.getItem("tcs_encryptionkey") || "";

      const keyMap = {
        storageType: "tcs_storagetype",
        syncInterval: "tcs_aws_syncinterval", // Keeping original key for compatibility
        encryptionKey: "tcs_encryptionkey",
        googleClientId: "tcs_google_clientid",
      };

      Object.keys(defaults).forEach((key) => {
        const storageKey = keyMap[key];
        if (!storageKey) return;

        let value = localStorage.getItem(storageKey);
        
        if (value !== null) {
          stored[key] = key === "syncInterval" ? parseInt(value) || 15 : value;
        }
      });
      return { ...defaults, ...stored };
    }
    loadExclusions() {
      const exclusions = localStorage.getItem("tcs_sync-exclusions");
      const userExclusions = exclusions
        ? exclusions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];
      const systemExclusions = [
        "tcs_storagetype",
        "tcs_aws_bucketname", // Legacy exclusion
        "tcs_aws_accesskey",  // Legacy exclusion
        "tcs_aws_secretkey",  // Legacy exclusion
        "tcs_aws_region",     // Legacy exclusion
        "tcs_aws_endpoint",   // Legacy exclusion
        "tcs_google_clientid",
        "tcs_google_access_token",
        "tcs_google_token_expiry",
        "gsi_client_id",
        "tcs_encryptionkey",
        "tcs_last-cloud-sync",
        "tcs_last-daily-backup",
        "tcs_backup-size",
        "tcs_sync-exclusions",
        "tcs_local-metadata",
        "tcs_localMigrated",
        "tcs_migrationBackup",
        "tcs_last-tombstone-cleanup",
        "tcs_autosync_enabled",
        "referrer",
        "TM_useLastVerifiedToken",
        "TM_useStateUpdateHistory",
        "INSTANCE_ID",
        "eruda-console",
        "TM_useExtensionURLs",
      ];
      return [...systemExclusions, ...userExclusions];
    }
    get(key) {
      return this.config[key];
    }
    set(key, value) {
      this.config[key] = value;
    }
    save() {
      const keyMap = {
        storageType: "tcs_storagetype",
        syncInterval: "tcs_aws_syncinterval",
        encryptionKey: "tcs_encryptionkey",
        googleClientId: "tcs_google_clientid",
      };

      Object.keys(this.config).forEach((key) => {
        const storageKey = keyMap[key];
        if (!storageKey) return;
        let valueToStore = this.config[key]?.toString() || "";
        localStorage.setItem(storageKey, valueToStore);
      });
    }
    shouldExclude(key) {
      const always =
        key.startsWith("tcs_") && !key.startsWith("tcs_tombstone_");
      return (
        this.exclusions.includes(key) ||
        always ||
        key.startsWith("gsi_") ||
        key.includes("eruda")
      );
    }
    reloadExclusions() {
      this.exclusions = this.loadExclusions();
    }
  }

  class Logger {
    constructor() {
      const urlParams = new URLSearchParams(window.location.search);
      this.enabled = urlParams.get("log") === "true" || urlParams.has("log");
      this.icons = {
        info: "ℹ️",
        success: "✅",
        warning: "⚠️",
        error: "❌",
        start: "🔄",
        skip: "⏭️",
      };
      if (this.enabled) {
        this.loadEruda();
      }
    }
    loadEruda() {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (!isMobile) return;
      if (document.getElementById("eruda-script")) return;
      const script = document.createElement("script");
      script.id = "eruda-script";
      script.src = "https://cdn.jsdelivr.net/npm/eruda@3.0.1/eruda.min.js";
      script.onload = () => {
        window.eruda?.init();
      };
      document.head.appendChild(script);
    }
    destroyEruda() {
      window.eruda?.destroy();
      document.getElementById("eruda-script")?.remove();
    }
    log(type, message, data = null) {
      if (!this.enabled) return;
      const timestamp = new Date().toLocaleTimeString();
      const icon = this.icons[type] || "ℹ️";
      const logMessage = `${icon} [${timestamp}] ${message}`;
      switch (type) {
        case "error":
          console.error(logMessage, data || "");
          break;
        case "warning":
          console.warn(logMessage, data || "");
          break;
        default:
          console.log(logMessage, data || "");
      }
    }
    setEnabled(enabled) {
      this.enabled = enabled;
      const url = new URL(window.location);
      if (enabled) {
        url.searchParams.set("log", "");
        this.loadEruda();
      } else {
        url.searchParams.delete("log");
        this.destroyEruda();
      }
      window.history.replaceState({}, "", url);
    }
  }

  class DataService {
    constructor(configManager, logger, operationQueue = null) {
      this.config = configManager;
      this.logger = logger;
      this.operationQueue = operationQueue;
      this.dbPromise = null;
      this.streamBatchSize = 1000;
      this.memoryThreshold = 100 * 1024 * 1024;
      this.throttleDelay = 10;
    }
    async getDB() {
      if (!this.dbPromise) {
        this.dbPromise = new Promise((resolve, reject) => {
          const request = indexedDB.open("keyval-store");
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(new Error("Failed to open IndexedDB"));
        });
      }
      return this.dbPromise;
    }
    async estimateDataSize() {
      let totalSize = 0;
      let itemCount = 0;
      let excludedItemCount = 0;
      const db = await this.getDB();
      const transaction = db.transaction(["keyval"], "readonly");
      const store = transaction.objectStore("keyval");
      await new Promise((resolve) => {
        const request = store.openCursor();
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const key = cursor.key;
            const value = cursor.value;
            if (
              typeof key === "string" &&
              value !== undefined &&
              !this.config.shouldExclude(key)
            ) {
              try {
                const itemSize = JSON.stringify(value).length * 2;
                totalSize += itemSize;
                itemCount++;
              } catch (e) {
                this.logger.log("warning", `Error estimating size for ${key}`);
              }
            } else if (typeof key === "string") {
              excludedItemCount++;
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => resolve();
      });
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !this.config.shouldExclude(key)) {
          const value = localStorage.getItem(key);
          if (value !== null) {
            totalSize += value.length * 2;
            itemCount++;
          }
        } else if (key) {
          excludedItemCount++;
        }
      }
      return { totalSize, itemCount, excludedItemCount };
    }
    async *streamAllItems() {
      // Deprecated in favor of streamAllItemsInternal, but kept for interface compat if needed
      return this.streamAllItemsInternal();
    }
    async *streamAllItemsInternal() {
      const batchSize = this.streamBatchSize;
      let batch = [];
      let batchSize_bytes = 0;
      let db = null;
      let transaction = null;
      let pendingBatches = [];
      let currentBatchIndex = 0;
      try {
        const processItem = (item) => {
          try {
            const estimatedSize = this.estimateItemSize(item.data);
            if (
              batchSize_bytes + estimatedSize > this.memoryThreshold &&
              batch.length > 0
            ) {
              const currentBatch = [...batch];
              batch = [item];
              batchSize_bytes = estimatedSize;
              return currentBatch;
            }
            batch.push(item);
            batchSize_bytes += estimatedSize;
            if (batch.length >= batchSize) {
              const currentBatch = [...batch];
              batch = [];
              batchSize_bytes = 0;
              return currentBatch;
            }
            return null;
          } catch (error) {
            this.logger.log(
              "warning",
              `Error processing item: ${error.message}`
            );
            return null;
          }
        };
        db = await this.getDB();
        transaction = db.transaction(["keyval"], "readonly");
        const store = transaction.objectStore("keyval");
        let idbProcessed = 0;
        await new Promise((resolve, reject) => {
          const request = store.openCursor();
          request.onsuccess = async (event) => {
            try {
              const cursor = event.target.result;
              if (cursor) {
                const key = cursor.key;
                const value = cursor.value;
                if (value instanceof Blob) {
                  const item = {
                    id:   key,
                    data: value,                 
                    type: "blob",
                    blobType: value.type,
                    size: value.size,
                  };
                  const batchToYield = processItem(item);
                  if (batchToYield) pendingBatches.push(batchToYield);
                  cursor.continue();
                  return;
                }

                if (
                  typeof key === "string" &&
                  value !== undefined &&
                  !this.config.shouldExclude(key)
                ) {
                  const item = { id: key, data: value, type: "idb" };
                  const batchToYield = processItem(item);
                  if (batchToYield) {
                    pendingBatches.push(batchToYield);
                    if (pendingBatches.length >= 10) {
                      this.logger.log(
                        "warning",
                        `Large number of pending batches (${pendingBatches.length}), potential memory issue`
                      );
                    }
                  }
                  idbProcessed++;
                  if (idbProcessed % 5000 === 0) {
                    this.logger.log(
                      "info",
                      `Processed ${idbProcessed} IndexedDB items`
                    );
                  }
                }
                cursor.continue();
              } else {
                resolve();
              }
            } catch (error) {
              this.logger.log(
                "error",
                `Error in cursor processing: ${error.message}`
              );
              reject(error);
            }
          };
          request.onerror = () => {
            this.logger.log("error", "IndexedDB cursor error");
            reject(request.error);
          };
        });
        for (let i = 0; i < pendingBatches.length; i++) {
          yield pendingBatches[i];
          pendingBatches[i] = null;
          currentBatchIndex = i + 1;
          if (i % 5 === 0) {
            await this.forceGarbageCollection();
          }
        }
        pendingBatches = null;
        let lsProcessed = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !this.config.shouldExclude(key)) {
            const value = localStorage.getItem(key);
            if (value !== null) {
              const item = { id: key, data: { key, value }, type: "ls" };
              const batchToYield = processItem(item);
              if (batchToYield) {
                yield batchToYield;
                await this.forceGarbageCollection();
              }
              lsProcessed++;
              if (lsProcessed % 1000 === 0) {
                this.logger.log(
                  "info",
                  `Processed ${lsProcessed} localStorage items`
                );
              }
            }
          }
        }
        if (batch && batch.length > 0) {
          yield batch;
          await this.forceGarbageCollection();
        }
      } catch (error) {
        this.logger.log(
          "error",
          `Error in streamAllItemsInternal: ${error.message}`
        );
        throw error;
      } finally {
        try {
          if (pendingBatches) {
            for (let i = currentBatchIndex; i < pendingBatches.length; i++) {
              pendingBatches[i] = null;
            }
            pendingBatches = null;
          }
          batch = null;
          transaction = null;
          db = null;
          await this.forceGarbageCollection();
        } catch (cleanupError) {
          this.logger.log("warning", `Cleanup error: ${cleanupError.message}`);
        }
      }
    }
    async getAllItemsEfficient() {
      const { totalSize } = await this.estimateDataSize();
      if (totalSize > this.memoryThreshold) {
        this.logger.log(
          "info",
          `Large dataset detected (${this.formatSize(
            totalSize
          )}), using memory-efficient processing`
        );
        return this.streamAllItemsInternal();
      } else {
        this.logger.log(
          "info",
          `Small dataset (${this.formatSize(
            totalSize
          )}), using standard loading`
        );
        return [await this.getAllItems()];
      }
    }
        estimateItemSize(data) {
      if (typeof data === "string") return data.length * 2;
      if (data instanceof Blob) return data.size;          
      if (data && typeof data === "object") {
        return Object.keys(data).length * 50;
      }
      return 1000;
    }
    formatSize(bytes) {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
    async forceGarbageCollection() {
      if (window?.gc) {
        window.gc();
      } else if (typeof global !== "undefined" && global?.gc) {
        global.gc();
      }
      await new Promise((resolve) => setTimeout(resolve, this.throttleDelay));
    }
    async getAllItems() {
      const items = new Map();
      const db = await this.getDB();
      const transaction = db.transaction(["keyval"], "readonly");
      const store = transaction.objectStore("keyval");
      let totalIDB = 0;
      let includedIDB = 0;
      let excludedIDB = 0;
      await new Promise((resolve) => {
        const request = store.openCursor();
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const key = cursor.key;
            const value = cursor.value;
            totalIDB++;
            if (
              typeof key === "string" &&
              value !== undefined &&
              !this.config.shouldExclude(key)
            ) {
              items.set(key, {
                id: key,
                data: value,
                type: "idb",
              });
              includedIDB++;
            } else {
              excludedIDB++;
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => resolve();
      });
      const urlParams = new URLSearchParams(window.location.search);
      const debugEnabled =
        urlParams.get("log") === "true" || urlParams.has("log");
      let totalLS = 0;
      let excludedLS = 0;
      let includedLS = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        totalLS++;
        if (key && !this.config.shouldExclude(key)) {
          const value = localStorage.getItem(key);
          if (value !== null) {
            items.set(key, { id: key, data: { key, value }, type: "ls" });
            includedLS++;
          }
        } else {
          excludedLS++;
        }
      }
      if (debugEnabled) {
        console.log(
          `📊 IndexedDB Stats: Total=${totalIDB}, Included=${includedIDB}, Excluded=${excludedIDB}`
        );
        console.log(
          `📊 localStorage Stats: Total=${totalLS}, Included=${includedLS}, Excluded=${excludedLS}`
        );
        console.log(`📊 Total items to sync: ${items.size} (IDB + LS)`);
      }
      const chatItems = Array.from(items.keys()).filter((id) =>
        id.startsWith("CHAT_")
      );
      const otherItems = Array.from(items.keys()).filter(
        (id) => !id.startsWith("CHAT_")
      );
      this.logger.log("success", "📋 Retrieved all items for deletion check", {
        totalItems: items.size,
        idbStats: {
          total: totalIDB,
          included: includedIDB,
          excluded: excludedIDB,
        },
        lsStats: { total: totalLS, included: includedLS, excluded: excludedLS },
        chatCount: chatItems.length,
        otherCount: otherItems.length,
      });
      return Array.from(items.values());
    }
    async getAllItemKeys() {
      const itemKeys = new Set();
      const db = await this.getDB();
      const transaction = db.transaction(["keyval"], "readonly");
      const store = transaction.objectStore("keyval");
      await new Promise((resolve) => {
        const request = store.openKeyCursor();
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const key = cursor.key;
            if (typeof key === "string" && !this.config.shouldExclude(key)) {
              itemKeys.add(key);
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => resolve();
      });
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !this.config.shouldExclude(key)) {
          itemKeys.add(key);
        }
      }
      return itemKeys;
    }
    async getItem(itemId, type) {
      if (type === "idb") {
        const db = await this.getDB();
        const transaction = db.transaction(["keyval"], "readonly");
        const store = transaction.objectStore("keyval");
        return new Promise((resolve) => {
          const request = store.get(itemId);
          request.onsuccess = () => {
            const result = request.result;
            resolve(result || null);
          };
          request.onerror = () => resolve(null);
        });
      } else if (type === "ls") {
        const value = localStorage.getItem(itemId);
        return value !== null ? { key: itemId, value } : null;
      } else if (type === "blob") {
      const db = await this.getDB();
      const tx = db.transaction(["keyval"], "readonly");
      const store = tx.objectStore("keyval");
      return new Promise(res => {
          const req = store.get(itemId);
          req.onsuccess = () => res(req.result || null);
          req.onerror   = () => res(null);
      });
    }
      return null;
    }
    async saveItem(item, type, itemKey = null) {
      if (type === "idb") {
        const db = await this.getDB();
        const transaction = db.transaction(["keyval"], "readwrite");
        const store = transaction.objectStore("keyval");
        const itemId = itemKey || item?.id;
        const itemData = item;
        return new Promise((resolve) => {
          const request = store.put(itemData, itemId);
          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(false);
        });
      } else if (type === "ls") {
        try {
          localStorage.setItem(item.key, item.value);
          return true;
        } catch {
          return false;
        }
      } else if (type === "blob") {
        const blob = new Blob([item], {
          type: item.blobType || "application/octet-stream",
        });
        return this.saveItem(blob, "idb", itemKey);
      }
      return false;
    }
    async deleteItem(itemId, type) {
      const success = await this.performDelete(itemId, type);
      if (success) {
        this.createTombstone(itemId, type, "manual-delete");
      }
      return success;
    }
    async performDelete(itemId, type) {
      if (type === "idb") {
        const db = await this.getDB();
        const transaction = db.transaction(["keyval"], "readwrite");
        const store = transaction.objectStore("keyval");
        return new Promise((resolve) => {
          const request = store.delete(itemId);
          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(false);
        });
      } else if (type === "ls") {
        try {
          localStorage.removeItem(itemId);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
    createTombstone(itemId, type, source = "unknown") {
      const orchestrator = window.cloudSyncApp?.syncOrchestrator;
      if (!orchestrator) {
        this.logger.log(
          "error",
          "❌ Cannot create tombstone: SyncOrchestrator not found."
        );
        return null;
      }
      const timestamp = Date.now();
      const tombstone = {
        deleted: timestamp,
        deletedAt: timestamp,
        type: type,
        source: source,
        tombstoneVersion: 1,
      };
      this.logger.log("start", "🪦 Creating tombstone in metadata", {
        itemId: itemId,
        type: type,
        source: source,
      });
      const existingItem = orchestrator.metadata.items[itemId];
      if (existingItem?.deleted) {
        tombstone.tombstoneVersion = (existingItem.tombstoneVersion || 0) + 1;
        this.logger.log(
          "info",
          "📈 Incrementing existing tombstone version in metadata",
          {
            newVersion: tombstone.tombstoneVersion,
          }
        );
      }
      orchestrator.metadata.items[itemId] = {
        ...tombstone,
        synced: 0,
      };
      orchestrator.saveMetadata();
      this.logger.log("success", "✅ Tombstone created in metadata", {
        itemId: itemId,
        version: tombstone.tombstoneVersion,
      });
      this.operationQueue?.add(
        `tombstone-sync-${itemId}`,
        () => this.syncTombstone(itemId),
        "high"
      );
      return tombstone;
    }
    getTombstoneFromStorage(itemId) {
      try {
        const storageKey = `tcs_tombstone_${itemId}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const tombstone = JSON.parse(stored);
          return tombstone;
        } else {
          return null;
        }
      } catch (error) {
        this.logger.log("error", "❌ Error reading tombstone from storage", {
          itemId: itemId,
          error: error.message,
        });
        return null;
      }
    }
    saveTombstoneToStorage(itemId, tombstone) {
      try {
        const storageKey = `tcs_tombstone_${itemId}`;
        localStorage.setItem(storageKey, JSON.stringify(tombstone));
        const verification = localStorage.getItem(storageKey);
        if (verification) {
          this.logger.log(
            "success",
            "✅ Tombstone successfully saved and verified",
            {
              itemId: itemId,
              storageKey: storageKey,
            }
          );
        } else {
          this.logger.log("error", "❌ Tombstone save verification failed", {
            itemId: itemId,
            storageKey: storageKey,
          });
        }
      } catch (error) {
        this.logger.log("error", "❌ Failed to save tombstone to storage", {
          itemId: itemId,
          error: error.message,
        });
      }
    }
    getAllTombstones() {
      const tombstones = new Map();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("tcs_tombstone_")) {
          const itemId = key.replace("tcs_tombstone_", "");
          try {
            const tombstone = JSON.parse(localStorage.getItem(key));
            tombstones.set(itemId, tombstone);
          } catch {
            continue;
          }
        }
      }
      return tombstones;
    }
    async syncTombstone(itemId) {
      this.logger.log("info", `🔄 Triggering sync for tombstone ${itemId}`);
      if (window.cloudSyncApp?.syncOrchestrator) {
        try {
          await window.cloudSyncApp.syncOrchestrator.syncToCloud();
          this.logger.log(
            "success",
            `✅ Tombstone sync completed for ${itemId}`
          );
        } catch (error) {
          this.logger.log(
            "error",
            `❌ Tombstone sync failed for ${itemId}`,
            error.message
          );
          throw error;
        }
      } else {
        this.logger.log(
          "warning",
          `⚠️ Sync orchestrator not available for ${itemId}`
        );
      }
    }
    cleanup() {
      this.logger?.log("info", "🧹 DataService cleanup starting");
      try {
        if (this.dbPromise) {
          this.dbPromise
            .then((db) => {
              if (db) {
                db.close();
                this.logger?.log("info", "✅ IndexedDB connection closed");
              }
            })
            .catch((error) => {
              this.logger?.log(
                "warning",
                `IndexedDB close error: ${error.message}`
              );
            });
        }
        this.dbPromise = null;
        this.streamYield = null;
        this.config = null;
        this.operationQueue = null;
        if (this.forceGarbageCollection) {
          this.forceGarbageCollection().catch(() => {});
        }
        this.logger?.log("success", "✅ DataService cleanup completed");
        this.logger = null;
      } catch (error) {
        console.warn("DataService cleanup error:", error);
      }
    }
  }

  class CryptoService {
    constructor(configManager, logger) {
      this.config = configManager;
      this.logger = logger;
      this.keyCache = new Map();
      this.maxCacheSize = 10;
      this.lastCacheCleanup = Date.now();
      this.largeArrayKeys = ["TM_useUserCharacters"];
    }
    async deriveKey(password) {
      const now = Date.now();
      if (now - this.lastCacheCleanup > 30 * 60 * 1000) {
        this.cleanupKeyCache();
        this.lastCacheCleanup = now;
      }
      if (this.keyCache.has(password)) return this.keyCache.get(password);
      if (this.keyCache.size >= this.maxCacheSize) {
        const firstKey = this.keyCache.keys().next().value;
        this.keyCache.delete(firstKey);
      }
      const data = new TextEncoder().encode(password);
      const hash = await crypto.subtle.digest("SHA-256", data);
      const key = await crypto.subtle.importKey(
        "raw",
        hash,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
      );
      this.keyCache.set(password, key);
      return key;
    }
    cleanupKeyCache() {
      if (this.keyCache.size > this.maxCacheSize / 2) {
        const keysToRemove = Math.floor(this.keyCache.size / 2);
        const keyIterator = this.keyCache.keys();
        for (let i = 0; i < keysToRemove; i++) {
          const oldestKey = keyIterator.next().value;
          if (oldestKey) {
            this.keyCache.delete(oldestKey);
          }
        }
      }
    }
    _createJsonStreamForArray(array) {
      let i = 0;
      const encoder = new TextEncoder();
      return new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode("["));
        },
        pull(controller) {
          if (i >= array.length) {
            controller.enqueue(encoder.encode("]"));
            controller.close();
            return;
          }

          try {
            const chunk = JSON.stringify(array[i]);
            if (i < array.length - 1) {
              controller.enqueue(encoder.encode(chunk + ","));
            } else {
              controller.enqueue(encoder.encode(chunk));
            }
            i++;
          } catch (e) {
            this.logger.log(
              "error",
              `Streaming serialization failed for element ${i}`,
              e
            );
            controller.error(e);
          }
        },
      });
    }
    async encrypt(data, key = null) {
      const encryptionKey = this.config.get("encryptionKey");
      if (!encryptionKey) throw new Error("No encryption key configured");

      const cryptoKey = await this.deriveKey(encryptionKey);
      let dataStream;

      if (key && this.largeArrayKeys.includes(key) && Array.isArray(data)) {
        this.logger.log(
          "info",
          `Using streaming serialization for large array: ${key}`
        );
        dataStream = this._createJsonStreamForArray(data);
      } else {
        const encodedData = new TextEncoder().encode(JSON.stringify(data));
        dataStream = new Blob([encodedData]).stream();
      }

      let processedStream = dataStream;
      try {
        if (window.CompressionStream) {
          processedStream = dataStream.pipeThrough(
            new CompressionStream("deflate-raw")
          );
        } else {
          this.logger.log(
            "warning",
            "CompressionStream API not supported, uploading uncompressed."
          );
        }
      } catch (e) {
        this.logger.log(
          "warning",
          "Could not compress data, uploading uncompressed.",
          e
        );
      }

      const finalData = new Uint8Array(
        await new Response(processedStream).arrayBuffer()
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        finalData
      );

      const result = new Uint8Array(iv.length + encrypted.byteLength);
      result.set(iv, 0);
      result.set(new Uint8Array(encrypted), iv.length);
      return result;
    }
    async encryptBytes(data) {
      const encryptionKey = this.config.get("encryptionKey");
      if (!encryptionKey) throw new Error("No encryption key configured");
      const key = await this.deriveKey(encryptionKey);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        data
      );
      const result = new Uint8Array(iv.length + encrypted.byteLength);
      result.set(iv, 0);
      result.set(new Uint8Array(encrypted), iv.length);
      return result;
    }
    async decrypt(encryptedData) {
      const encryptionKey = this.config.get("encryptionKey");
      if (!encryptionKey) throw new Error("No encryption key configured");
      const key = await this.deriveKey(encryptionKey);
      const iv = encryptedData.slice(0, 12);
      const data = encryptedData.slice(12);
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data
      );
      try {
        if (window.DecompressionStream) {
          const stream = new Blob([decrypted])
            .stream()
            .pipeThrough(new DecompressionStream("deflate-raw"));
          const text = await new Response(stream).text();
          return JSON.parse(text);
        } else {
          this.logger.log(
            "warning",
            "DecompressionStream API not supported, decoding as text."
          );
          return JSON.parse(new TextDecoder().decode(decrypted));
        }
      } catch (e) {
        return JSON.parse(new TextDecoder().decode(decrypted));
      }
    }
    async decryptBytes(encryptedData) {
      const encryptionKey = this.config.get("encryptionKey");
      if (!encryptionKey) throw new Error("No encryption key configured");
      const key = await this.deriveKey(encryptionKey);
      const iv = encryptedData.slice(0, 12);
      const data = encryptedData.slice(12);
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data
      );
      return new Uint8Array(decrypted);
    }
    cleanup() {
      this.logger?.log("info", "🧹 CryptoService cleanup starting");
      try {
        if (this.keyCache) {
          this.keyCache.clear();
        }
        this.keyCache = null;
        this.lastCacheCleanup = 0;
        this.config = null;
        this.logger?.log("success", "✅ CryptoService cleanup completed");
        this.logger = null;
      } catch (error) {
        console.warn("CryptoService cleanup error:", error);
      }
    }
  }
  class IStorageProvider {
    constructor(configManager, cryptoService, logger) {
      if (this.constructor === IStorageProvider) {
        throw new Error("Cannot instantiate abstract class IStorageProvider.");
      }
      this.config = configManager;
      this.crypto = cryptoService;
      this.logger = logger;
    }

    static get displayName() {
      return "Unnamed Provider";
    }

    /**
     * Returns the HTML and event setup logic for this provider's config UI.
     * @returns {{html: string, setupEventListeners: function(HTMLElement, IStorageProvider, ConfigManager, Logger): void}}
     */
    static getConfigurationUI() {
      return {
        html: '<p class="text-zinc-400">This provider has no specific configuration.</p>',
        setupEventListeners: () => {},
      };
    }

    async delete(key) {
      throw new Error("Method 'delete()' must be implemented.");
    }

    async deleteFolder(folderPath) {
      throw new Error("Method 'deleteFolder()' must be implemented.");
    }

    isConfigured() {
      throw new Error("Method 'isConfigured()' must be implemented.");
    }

    async initialize() {
      throw new Error("Method 'initialize()' must be implemented.");
    }

    async handleAuthentication() {
      this.logger.log(
        "info",
        `${this.constructor.name} does not require interactive authentication.`
      );
      return Promise.resolve();
    }

    async upload(key, data, isMetadata = false) {
      throw new Error("Method 'upload()' must be implemented.");
    }

    async download(key, isMetadata = false) {
      throw new Error("Method 'download()' must be implemented.");
    }

    async delete(key) {
      throw new Error("Method 'delete()' must be implemented.");
    }

    async list(prefix = "") {
      throw new Error("Method 'list()' must be implemented.");
    }

    async downloadWithResponse(key) {
      throw new Error("Method 'downloadWithResponse()' must be implemented.");
    }

    async copyObject(sourceKey, destinationKey) {
      throw new Error("Method 'copyObject()' must be implemented.");
    }

    async verify() {
      this.logger.log(
        "info",
        `Verifying connection for ${this.constructor.name}...`
      );
      await this.list("");
      this.logger.log(
        "success",
        `Connection for ${this.constructor.name} verified.`
      );
    }

    async ensurePathExists(path) {
      throw new Error("Method 'ensurePathExists()' must be implemented.");
    }
  }

  class GoogleDriveService extends IStorageProvider {
    constructor(configManager, cryptoService, logger) {
      super(configManager, cryptoService, logger);
      this.DRIVE_SCOPES = "https://www.googleapis.com/auth/drive.file";
      this.APP_FOLDER_NAME = "TypingMind-Cloud-Sync";
      this.gapiReady = false;
      this.gisReady = false;
      this.tokenClient = null;
      this.pathIdCache = new Map();
      this.pathCreationPromises = new Map();
    }

    static get displayName() {
      return "Google Drive";
    }

    static getConfigurationUI() {
      const html = `
        <div class="space-y-2">
          <div>
            <label for="google-client-id" class="block text-sm font-medium text-zinc-300">Google Cloud Client ID <span class="text-red-400">*</span></label>
            <input id="google-client-id" name="google-client-id" type="text" class="w-full px-2 py-1.5 border border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-700 text-white" autocomplete="off" required>
          </div>
          <div class="pt-1">
            <button id="google-auth-btn" class="w-full inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-default transition-colors">Sign in with Google</button>
            <div id="google-auth-status" class="text-xs text-center text-zinc-400 pt-2"></div>
          </div>
           
          <div class="pt-2 text-center">
            <span id="toggle-google-guide" class="text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer">How to get a Google Client ID?</span>
          </div>
          <div id="google-guide-content" class="hidden mt-2 p-3 bg-zinc-900 border border-zinc-700 rounded-lg max-h-48 overflow-y-auto text-xs text-zinc-300">
            <p class="font-bold mb-2">Follow these steps to create your own Client ID:</p>
            <ol class="list-decimal list-inside space-y-2">
              <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">Google Cloud Console</a> and create a new project (or select an existing one).</li>
              <li>In the search bar, find and enable the <strong>"Google Drive API"</strong> for your project.</li>
              <li>Go to "APIs & Services" > <strong>"OAuth consent screen"</strong>.
                <ul class="list-disc list-inside pl-4 mt-1 space-y-1">
                  <li>Choose User Type: <strong>External</strong>.</li>
                  <li>Fill in the required app name (e.g., "My TypingMind Sync"), user support email, and developer contact.</li>
                  <li>Click "Save and Continue" through the "Scopes" and "Test Users" sections. You don't need to add anything here.</li>
                  <li>Finally, click "Back to Dashboard" and <strong>"Publish App"</strong> to make it available for your own use.</li>
                </ul>
              </li>
              <li>Go to "APIs & Services" > <strong>"Credentials"</strong>.</li>
              <li>Click <strong>"+ Create Credentials"</strong> and select <strong>"OAuth client ID"</strong>.</li>
              <li>For Application type, select <strong>"Web application"</strong>.</li>
              <li>Under <strong>"Authorized JavaScript origins"</strong>, click "+ Add URI".
                  <br>
                  <strong class="text-amber-300">IMPORTANT:</strong> You MUST add the URL you use to access TypingMind. For example:
                  <ul class="list-disc list-inside pl-4 mt-1">
                    <li>If you use the official web app: <code class="bg-zinc-700 p-1 rounded">https://www.typingmind.com</code></li>
                    <li>If you self-host: <code class="bg-zinc-700 p-1 rounded">http://localhost:3000</code> (or your custom domain)</li>
                  </ul>
              </li>
              <li>Click "Create". A modal will appear with your <strong>Client ID</strong>. Copy it and paste it into the field above.</li>
            </ol>
          </div>
        </div>
      `;

      const setupEventListeners = (
        container,
        providerInstance,
        config,
        logger
      ) => {
        container.querySelector("#google-client-id").value =
          config.get("googleClientId") || "";

        const googleAuthBtn = container.querySelector("#google-auth-btn");
        const googleAuthStatus = container.querySelector("#google-auth-status");
        const googleClientIdInput =
          container.querySelector("#google-client-id");

        const toggleGuideLink = container.querySelector("#toggle-google-guide");
        const guideContent = container.querySelector("#google-guide-content");

        toggleGuideLink.addEventListener("click", () => {
          guideContent.classList.toggle("hidden");
        });

        const updateAuthButtonState = () => {
          googleAuthBtn.disabled = !googleClientIdInput.value.trim();
          if (
            providerInstance &&
            providerInstance.isConfigured() &&
            window.gapi?.client.getToken()
          ) {
            googleAuthStatus.textContent = "Status: Signed in.";
            googleAuthStatus.style.color = "#22c55e";
          } else {
            googleAuthStatus.textContent = providerInstance?.isConfigured()
              ? "Status: Not signed in."
              : "Status: Client ID required.";
            googleAuthStatus.style.color = "";
          }
        };

        const handleGoogleAuth = async () => {
          const clientId = googleClientIdInput.value.trim();
          if (!clientId) {
            alert("Please enter a Google Client ID first.");
            return;
          }
          config.set("googleClientId", clientId);

          try {
            googleAuthBtn.disabled = true;
            googleAuthBtn.textContent = "Authenticating...";
            googleAuthStatus.textContent =
              "Please follow the Google sign-in prompt...";

            const tempProvider = new GoogleDriveService(
              config,
              providerInstance.crypto,
              logger
            );
            await tempProvider.initialize();
            await tempProvider.handleAuthentication();

            googleAuthStatus.textContent =
              "✅ Authentication successful! Please Save & Verify.";
            googleAuthStatus.style.color = "#22c55e";
            googleAuthBtn.textContent = "Re-authenticate";
          } catch (error) {
            logger.log("error", "Google authentication failed", error);
            googleAuthStatus.textContent = `❌ Auth failed: ${error.message}`;
            googleAuthStatus.style.color = "#ef4444";
            googleAuthBtn.textContent = "Sign in with Google";
          } finally {
            googleAuthBtn.disabled = false;
          }
        };

        googleAuthBtn.addEventListener("click", handleGoogleAuth);
        googleClientIdInput.addEventListener("input", updateAuthButtonState);
        updateAuthButtonState();
      };

      return { html, setupEventListeners };
    }

    _isAuthError(error) {
      const apiError = error.result?.error || error.error || {};
      if (apiError.code === 401 || apiError.status === "UNAUTHENTICATED") {
        return true;
      }
      if (error.status === 401) {
        return true;
      }
      if (apiError.message?.toLowerCase().includes("invalid credentials")) {
        return true;
      }
      return false;
    }

    _isRateLimitError(error) {
      const apiError = error.result?.error || error.error || {};
      return (
        apiError.code === 403 &&
        apiError.message?.toLowerCase().includes("rate limit")
      );
    }

    _operationWithRetry(operation) {
      return retryAsync(operation, {
        maxRetries: 5,
        delay: 1000,
        isRetryable: (error) => {
          if (this._isAuthError(error)) {
            this.logger.log(
              "error",
              "Google Drive authentication token expired or invalid."
            );
            localStorage.removeItem("tcs_google_access_token");
            if (gapi?.client) gapi.client.setToken(null);

            window.cloudSyncApp?.handleExpiredToken();

            return false;
          }
          return this._isRateLimitError(error);
        },
        onRetry: (error, attempt, delay) => {
          this.logger.log(
            "warning",
            `[Google Drive] Rate limit exceeded. Retrying in ${Math.round(
              delay / 1000
            )}s... (Attempt ${attempt}/5)`
          );
        },
      });
    }

    async _deleteFolderIfExists(path) {
      return this._operationWithRetry(async () => {
        const folderId = await this._getPathId(path, false);

        if (folderId) {
          this.logger.log(
            "info",
            `[Google Drive] Deleting existing backup folder to prevent duplication: "${path}"`
          );
          await gapi.client.drive.files.delete({
            fileId: folderId,
          });

          const keysToDelete = [];
          for (const key of this.pathIdCache.keys()) {
            if (key === path || key.startsWith(path + "/")) {
              keysToDelete.push(key);
            }
          }
          for (const key of this.pathCreationPromises.keys()) {
            if (key === path || key.startsWith(path + "/")) {
              if (!keysToDelete.includes(key)) {
                keysToDelete.push(key);
              }
            }
          }

          keysToDelete.forEach((key) => {
            this.pathIdCache.delete(key);
            this.pathCreationPromises.delete(key);
          });

          this.pathIdCache.clear();
          this.pathCreationPromises.clear();

          this.logger.log(
            "info",
            `[Google Drive] Cleared ${keysToDelete.length} cache/promise entries for path: "${path}"`
          );
        }
      });
    }

    isConfigured() {
      return !!this.config.get("googleClientId");
    }

    async initialize() {
      if (!this.isConfigured())
        throw new Error("Google Drive configuration incomplete");
      await this._loadGapiAndGis();

      await new Promise((resolve) => gapi.load("client", resolve));

      await gapi.client.load(
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
      );

      await gapi.client.init({});

      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.config.get("googleClientId"),
        scope: this.DRIVE_SCOPES,
        callback: () => {},
      });

      const storedToken = localStorage.getItem("tcs_google_access_token");
      if (storedToken) {
        try {
          const token = JSON.parse(storedToken);
          const isExpired =
            Date.now() > token.iat + token.expires_in * 1000 - 5 * 60 * 1000;

          if (!isExpired) {
            gapi.client.setToken(token);
            this.logger.log(
              "info",
              "Successfully restored Google Drive session from storage."
            );
          } else {
            this.logger.log(
              "info",
              "Google Drive token from storage has expired."
            );
            localStorage.removeItem("tcs_google_access_token");
          }
        } catch (e) {
          this.logger.log("error", "Failed to parse stored Google token", e);
          localStorage.removeItem("tcs_google_access_token");
        }
      }
    }

    _storeToken(tokenResponse) {
      if (!tokenResponse.access_token) return;

      const tokenToStore = { ...tokenResponse, iat: Date.now() };

      localStorage.setItem(
        "tcs_google_access_token",
        JSON.stringify(tokenToStore)
      );
      this.logger.log("success", "Google Drive token stored successfully.");
    }

    async _loadScript(id, src) {
      if (document.getElementById(id)) return;
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    async _loadGapiAndGis() {
      if (this.gapiReady && this.gisReady) return;
      await this._loadScript(
        "gapi-client-script",
        "https://apis.google.com/js/api.js"
      );
      await this._loadScript(
        "gis-client-script",
        "https://accounts.google.com/gsi/client"
      );
      this.gapiReady = true;
      this.gisReady = true;
    }

    async handleAuthentication(options = { interactive: false }) {
      if (!this.isConfigured() || !this.tokenClient) {
        throw new Error("Google Drive is not configured or initialized.");
      }

      const token = gapi.client.getToken();

      if (token?.access_token) {
        const isExpired =
          Date.now() > token.iat + token.expires_in * 1000 - 5 * 60 * 1000;
        if (!isExpired) {
          return Promise.resolve();
        }
        this.logger.log(
          "info",
          "Access token is expired, attempting silent refresh."
        );
      }

      return new Promise((resolve, reject) => {
        const callback = (tokenResponse) => {
          if (tokenResponse.error) {
            this.logger.log("error", "Google Auth Error", tokenResponse);
            if (options.interactive) {
              reject(
                new Error(
                  tokenResponse.error_description || "Authentication failed."
                )
              );
            } else {
              this.logger.log(
                "warning",
                "Silent token refresh failed. User interaction will be required."
              );
              resolve();
            }
            return;
          }

          this._storeToken(tokenResponse);
          this.logger.log("success", "Google Drive authentication successful.");
          resolve();
        };

        this.tokenClient.callback = callback;
        const prompt = options.interactive ? "consent" : "";
        this.tokenClient.requestAccessToken({ prompt: prompt });
      });
    }

    async _getAppFolderId() {
      return this._operationWithRetry(async () => {
        if (this.pathIdCache.has(this.APP_FOLDER_NAME)) {
          return this.pathIdCache.get(this.APP_FOLDER_NAME);
        }

        const response = await gapi.client.drive.files.list({
          q: `mimeType='application/vnd.google-apps.folder' and name='${this.APP_FOLDER_NAME}' and trashed=false`,
          fields: "files(id, name)",
          spaces: "drive",
        });

        if (response.result.error) throw response;

        if (response.result.files.length > 0) {
          const folderId = response.result.files[0].id;
          this.pathIdCache.set(this.APP_FOLDER_NAME, folderId);
          return folderId;
        } else {
          this.logger.log(
            "info",
            `App folder '${this.APP_FOLDER_NAME}' not found, creating it.`
          );
          const fileMetadata = {
            name: this.APP_FOLDER_NAME,
            mimeType: "application/vnd.google-apps.folder",
          };
          const createResponse = await gapi.client.drive.files.create({
            resource: fileMetadata,
            fields: "id",
          });

          if (createResponse.result.error) throw createResponse;

          const folderId = createResponse.result.id;
          this.pathIdCache.set(this.APP_FOLDER_NAME, folderId);
          return folderId;
        }
      });
    }

    async _getPathId(path, createIfNotExists = false) {
      if (this.pathIdCache.has(path)) {
        return this.pathIdCache.get(path);
      }

      if (this.pathCreationPromises.has(path)) {
        this.logger.log(
          "info",
          `[Google Drive] Awaiting in-flight creation for path: "${path}"`
        );
        return this.pathCreationPromises.get(path);
      }

      const promise = this._operationWithRetry(async () => {
        if (this.pathIdCache.has(path)) return this.pathIdCache.get(path);

        const parts = path.split("/").filter((p) => p);
        let parentId = await this._getAppFolderId();
        let currentPath = this.APP_FOLDER_NAME;

        for (const part of parts) {
          currentPath += `/${part}`;
          if (this.pathIdCache.has(currentPath)) {
            parentId = this.pathIdCache.get(currentPath);
            continue;
          }

          const response = await gapi.client.drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='${part}' and '${parentId}' in parents and trashed=false`,
            fields: "files(id)",
            spaces: "drive",
          });

          if (response.result.error) throw response;

          if (response.result.files.length > 0) {
            parentId = response.result.files[0].id;
            this.pathIdCache.set(currentPath, parentId);
          } else if (createIfNotExists) {
            this.logger.log(
              "info",
              `Creating folder '${part}' inside parent ID ${parentId}.`
            );
            const fileMetadata = {
              name: part,
              mimeType: "application/vnd.google-apps.folder",
              parents: [parentId],
            };
            const createResponse = await gapi.client.drive.files.create({
              resource: fileMetadata,
              fields: "id",
            });
            if (createResponse.result.error) throw createResponse;
            parentId = createResponse.result.id;
            this.pathIdCache.set(currentPath, parentId);
          } else {
            return null;
          }
        }
        return parentId;
      });

      this.pathCreationPromises.set(path, promise);

      try {
        const pathId = await promise;
        if (pathId) {
          this.pathIdCache.set(path, pathId);
        }
        return pathId;
      } finally {
        this.pathCreationPromises.delete(path);
      }
    }

    async _getFileMetadata(path) {
      return this._operationWithRetry(async () => {
        const parts = path.split("/").filter((p) => p);
        const filename = parts.pop();
        const folderPath = parts.join("/");

        const parentId = await this._getPathId(folderPath);
        if (!parentId) return null;

        const queryParams = new URLSearchParams({
          q: `name='${filename}' and '${parentId}' in parents and trashed=false`,
          fields: "files(id, name, size, modifiedTime)",
          spaces: "drive",
        });

        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?${queryParams.toString()}`,
          {
            method: "GET",
            headers: new Headers({
              Authorization: "Bearer " + gapi.client.getToken().access_token,
            }),
          }
        );

        if (!response.ok) {
          const errorBody = await response.json();
          this.logger.log(
            "error",
            `Google Drive file list failed for ${path}`,
            errorBody
          );
          throw errorBody;
        }

        const result = await response.json();
        return result.files.length > 0 ? result.files[0] : null;
      });
    }

    async upload(key, data, isMetadata = false, itemKey = null) {
      return this._operationWithRetry(async () => {
        await this.handleAuthentication();
        const parts = key.split("/").filter((p) => p);
        const filename = parts.pop();
        const folderPath = parts.join("/");

        const parentId = await this._getPathId(folderPath, true);
        const existingFile = await this._getFileMetadata(key);

        const body = isMetadata
          ? JSON.stringify(data)
          : key.startsWith("attachments/")
            ? await this.crypto.encryptBytes(data) 
            : await this.crypto.encrypt(data, itemKey || key); 
        const blob = new Blob([body], {
          type: isMetadata ? "application/json" : "application/octet-stream",
        });

        const metadata = {
          name: filename,
          mimeType: isMetadata
            ? "application/json"
            : "application/octet-stream",
        };
        if (!existingFile) {
          metadata.parents = [parentId];
        }

        const formData = new FormData();
        formData.append(
          "metadata",
          new Blob([JSON.stringify(metadata)], { type: "application/json" })
        );
        formData.append("file", blob);

        const uploadUrl = existingFile
          ? `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`
          : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

        const method = existingFile ? "PATCH" : "POST";

        const response = await fetch(uploadUrl, {
          method: method,
          headers: new Headers({
            Authorization: "Bearer " + gapi.client.getToken().access_token,
          }),
          body: formData,
        });

        const result = await response.json();
        if (result.error) {
          this.logger.log(
            "error",
            `Google Drive upload failed for ${key}`,
            result.error
          );
          throw result;
        }

        const etag = response.headers.get("ETag") || result.etag;

        this.logger.log("success", `Uploaded ${key} to Google Drive`, {
          ETag: etag,
        });
        return { ETag: etag, ...result };
      });
    }

    async download(key, isMetadata = false) {
      return this._operationWithRetry(async () => {
        await this.handleAuthentication();
        const file = await this._getFileMetadata(key);
        if (!file) {
          const error = new Error(`File not found in Google Drive: ${key}`);
          error.code = "NoSuchKey";
          error.statusCode = 404;
          throw error;
        }

        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            method: "GET",
            headers: new Headers({
              Authorization: "Bearer " + gapi.client.getToken().access_token,
            }),
          }
        );

        if (!response.ok) {
          const errorBody = await response.json();
          this.logger.log(
            "error",
            `Google Drive download failed for ${key}`,
            errorBody
          );
          throw errorBody;
        }

        if (isMetadata) {
          return await response.json();
        } else {
          const isAttachment = key.startsWith("attachments/"); 
      const encryptedBuffer = await response.arrayBuffer();
      const bodyBytes = new Uint8Array(encryptedBuffer);

      if (isAttachment) {
          return await this.crypto.decryptBytes(bodyBytes);
      } else {
          return await this.crypto.decrypt(bodyBytes);
      }
    }
      });
    }

    async delete(key) {
      return this._operationWithRetry(async () => {
        await this.handleAuthentication();
        const file = await this._getFileMetadata(key);
        if (!file) {
          this.logger.log("warning", `File to delete not found: ${key}`);
          return;
        }

        const response = await gapi.client.drive.files.delete({
          fileId: file.id,
        });
        if (
          response.result &&
          typeof response.result === "object" &&
          Object.keys(response.result).length > 0
        ) {
        } else if (response.status >= 400) {
          throw {
            result: {
              error: response.body
                ? JSON.parse(response.body)
                : { message: "Delete failed" },
            },
          };
        }

        this.logger.log("success", `Deleted ${key} from Google Drive.`);
      });
    }

    async deleteFolder(folderPath) {
      return this._operationWithRetry(async () => {
        this.logger.log(
          "info",
          `[Google Drive] Deleting folder: ${folderPath}`
        );

        const folderId = await this._getPathId(folderPath, false);

        if (!folderId) {
          this.logger.log(
            "warning",
            `[Google Drive] Folder to delete not found: ${folderPath}`
          );
          return;
        }

        await gapi.client.drive.files.delete({
          fileId: folderId,
        });

        const keysToClear = Array.from(this.pathIdCache.keys()).filter(
          (key) => key === folderPath || key.startsWith(folderPath + "/")
        );

        keysToClear.forEach((key) => {
          this.pathIdCache.delete(key);
          this.pathCreationPromises.delete(key);
        });

        this.logger.log(
          "success",
          `[Google Drive] Deleted folder ${folderPath} and cleared ${keysToClear.length} cache entries.`
        );
      });
    }

    async list(prefix = "") {
      return this._operationWithRetry(async () => {
        await this.handleAuthentication();
        const parentId = await this._getPathId(prefix);
        if (!parentId) return [];

        let pageToken = null;
        const allFiles = [];
        do {
          const response = await gapi.client.drive.files.list({
            q: `'${parentId}' in parents and trashed=false`,
            fields: "nextPageToken, files(id, name, size, modifiedTime)",
            spaces: "drive",
            pageSize: 1000,
            pageToken: pageToken,
          });

          if (response.result.error) throw response;

          allFiles.push(...response.result.files);
          pageToken = response.result.nextPageToken;
        } while (pageToken);

        return allFiles.map((file) => ({
          Key: `${prefix}${file.name}`,
          LastModified: new Date(file.modifiedTime),
          Size: file.size,
        }));
      });
    }

    async downloadWithResponse(key) {
      return this._operationWithRetry(async () => {
        await this.handleAuthentication();
        const file = await this._getFileMetadata(key);
        if (!file) {
          const error = new Error(`File not found in Google Drive: ${key}`);
          error.code = "NoSuchKey";
          error.statusCode = 404;
          throw error;
        }

        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            method: "GET",
            headers: new Headers({
              Authorization
