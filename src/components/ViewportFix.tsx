"use client";

import { useEffect } from "react";

/**
 * スマートフォン・タブレット（iPad等）での拡大縮小（ピンチズーム・ダブルタップズーム）を無効化し、
 * ビューポートを画面にぴったり収めて固定するためのコンポーネント。
 */
export default function ViewportFix() {
  useEffect(() => {
    // 1. ピンチイン・ピンチアウト（2本指以上でのズーム）をブロック
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // 2. iOS Safari での gesturestart / gesturechange / gestureend による拡大縮小をブロック
    const handleGesture = (e: Event) => {
      e.preventDefault();
    };

    // 3. ダブルタップによるズーム防止（300ms以内のタップを無効化）
    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Passiveをfalseに指定してイベントリスナーを登録（SafariでのpreventDefault有効化）
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("gesturestart", handleGesture, { passive: false });
    document.addEventListener("gesturechange", handleGesture, { passive: false });
    document.addEventListener("gestureend", handleGesture, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("gesturestart", handleGesture);
      document.removeEventListener("gesturechange", handleGesture);
      document.removeEventListener("gestureend", handleGesture);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return null;
}
