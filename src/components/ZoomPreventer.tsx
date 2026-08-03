"use client";

import { useEffect } from "react";

/**
 * PC・スマートフォンの両方でブラウザや端末の拡大縮小（ズーム/ピンチイン/ピンチアウト/キーボードショートカット等）を禁止し、
 * 常に設定された1.0倍スケールを保持することでアプリの視認性とレイアウト崩れを防ぐコンポーネント。
 */
export default function ZoomPreventer() {
  useEffect(() => {
    // 1. iOS Safari 等のジェスチャー（ピンチズーム）イベントを無効化
    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("gesturestart", preventGesture, { passive: false });
    document.addEventListener("gesturechange", preventGesture, { passive: false });
    document.addEventListener("gestureend", preventGesture, { passive: false });

    // 2. 2本指でのマルチタッチによるピンチズームを無効化
    const preventTouchZoom = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventTouchZoom, { passive: false });

    // 3. PCやMacの Ctrl + マウスホイール / トラックパッドピンチ によるブラウザ拡大縮小を無効化
    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", preventWheelZoom, { passive: false });

    // 4. PCのキーボードショートカット (Ctrl/Cmd + '+', '-', '0' など) による拡大縮小を無効化
    const preventKeyZoom = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0" || e.code === "NumpadAdd" || e.code === "NumpadSubtract")) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", preventKeyZoom);

    // 5. iOS のダブルタップによる意図しないズームを防ぐ（タップ間の短い連続タッチを抑制）
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener("touchend", preventDoubleTapZoom, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("touchmove", preventTouchZoom);
      document.removeEventListener("wheel", preventWheelZoom);
      document.removeEventListener("keydown", preventKeyZoom);
      document.removeEventListener("touchend", preventDoubleTapZoom);
    };
  }, []);

  return null;
}
