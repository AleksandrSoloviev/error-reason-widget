import React, { useEffect, useState } from "react";

type ClipboardImageViewerProps = {
  title?: string;
  imageSrc?: string;
};

export const ClipboardImageViewer: React.FC<ClipboardImageViewerProps> = ({
  title,
  imageSrc,
}) => {
  const [localImageSrc, setLocalImageSrc] = useState<string | null>(
    imageSrc ?? null,
  );

  // const [isReadingFromClipboard, setIsReadingFromClipboard] =
  //   useState<boolean>(false);
  const [clipboardError, setClipboardError] = useState<string | null>(null);

  const displayedTitle = title ?? "Причина ошибки";

  useEffect(() => {
    if (!imageSrc) {
      return;
    }

    setLocalImageSrc(imageSrc);
  }, [imageSrc]);

  // const handlePasteFromClipboard = async () => {
  //   if (!("clipboard" in navigator) || !("read" in navigator.clipboard)) {
  //     setClipboardError(
  //       "Чтение изображений из буфера обмена не поддерживается в этом браузере.",
  //     );
  //     return;
  //   }
  //
  //   setIsReadingFromClipboard(true);
  //
  //   try {
  //     const items = await navigator.clipboard.read();
  //
  //     if (!items.length) {
  //       setClipboardError("Буфер обмена пуст или в нём нет поддерживаемых данных.");
  //       return;
  //     }
  //
  //     let imageBlob: Blob | null = null;
  //
  //     for (const item of items) {
  //       const imageType = item.types.find((type) => type.startsWith("image/"));
  //
  //       if (!imageType) {
  //         // eslint-disable-next-line no-continue
  //         continue;
  //       }
  //
  //       const blob = await item.getType(imageType);
  //       imageBlob = blob;
  //       break;
  //     }
  //
  //     if (!imageBlob) {
  //       setClipboardError("В буфере обмена не найдено изображений.");
  //       return;
  //     }
  //
  //     const objectUrl = URL.createObjectURL(imageBlob);
  //     setLocalImageSrc(objectUrl);
  //     setClipboardError(null);
  //   } catch {
  //     setClipboardError(
  //       "Не удалось прочитать изображение из буфера обмена. Браузер может требовать дополнительное разрешение или пользовательский жест.",
  //     );
  //   } finally {
  //     setIsReadingFromClipboard(false);
  //   }
  // };

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-center gap-2">
        <h3 className="text-base font-semibold text-gray-900">
          {displayedTitle}
        </h3>

        {/*<button*/}
        {/*  type="button"*/}
        {/*  onClick={handlePasteFromClipboard}*/}
        {/*  disabled={isReadingFromClipboard}*/}
        {/*  className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"*/}
        {/*  aria-label="Вставить изображение из буфера обмена"*/}
        {/*>*/}
        {/*  {isReadingFromClipboard ? "Чтение..." : "Вставить из буфера"}*/}
        {/*</button>*/}
      </div>

      <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-gray-50">
        {localImageSrc ? (
          <img
              style={{width: 480}}
            src={localImageSrc}
            alt={displayedTitle}
            className="max-h-96 w-full max-w-full rounded-lg object-contain"
          />
        ) : (
          <p className="px-4 py-8 text-center text-sm text-gray-500">
            Изображение пока не загружено. После автоматического снимка оно
            появится здесь, либо вы можете вставить его из буфера обмена.
          </p>
        )}
      </div>

      {clipboardError ? (
        <p className="text-xs text-red-500">{clipboardError}</p>
      ) : null}
    </div>
  );
};

