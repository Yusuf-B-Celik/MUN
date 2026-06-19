"use client";

import { useEffect, useRef, useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load key from localStorage
    const savedKey = localStorage.getItem("minimax_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Fallback for click outside (backdrop click) for older browsers or Safari
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      // If native closedby is supported, let browser handle it
      if ("closedBy" in HTMLDialogElement.prototype) return;

      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        onClose();
      }
    };

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener("click", handleBackdropClick);
    dialog.addEventListener("cancel", handleCancel);

    return () => {
      dialog.removeEventListener("click", handleBackdropClick);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [onClose]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem("minimax_api_key", apiKey.trim());
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1000);
    } else {
      localStorage.removeItem("minimax_api_key");
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      id="settings-dialog"
      // @ts-ignore: closedby is a newer web feature
      closedby="any"
      aria-labelledby="settings-title"
    >
      <form onSubmit={handleSave} className="dialog-content">
        <div className="dialog-header">
          <h2 id="settings-title">⚙️ Ayarlar</h2>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ padding: "0.25rem 0.5rem", borderRadius: "8px", fontSize: "0.85rem" }}
          >
            ✕
          </button>
        </div>

        <div>
          <label htmlFor="api-key-input">MiniMax API Anahtarı (API Key)</label>
          <input
            id="api-key-input"
            type="password"
            placeholder="eyJhbGciOi..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.8 }}>
            API anahtarınız sadece tarayıcınızda (localStorage) saklanır ve güvenli bir şekilde sunucumuz üzerinden MiniMax API'sine iletilir.
          </p>
        </div>

        <div className="dialog-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            İptal
          </button>
          <button type="submit" className="btn-primary">
            {isSaved ? "Kaydedildi! ✓" : "Kaydet"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
