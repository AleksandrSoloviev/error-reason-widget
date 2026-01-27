import React, { useEffect, useRef, useState } from "react";
import { AnalysisLoader } from "../../shared/ui/loader/AnalysisLoader";
import { ClipboardImageViewer } from "../../entities/error-reason/ui/ClipboardImageViewer";

type ErrorReasonWidgetProps = {
  loaderTitle?: string;
  resultTitle?: string;
  loadingDurationMs?: number;
};

export const ErrorReasonWidget: React.FC<ErrorReasonWidgetProps> = ({
                                                                      loaderTitle,
                                                                      resultTitle,
                                                                      loadingDurationMs = 5000,
                                                                    }) => {
  const [isLoadingPhase, setIsLoadingPhase] = useState(true);
  const [capturedImageSrc, setCapturedImageSrc] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoadingPhase(false);
    }, loadingDurationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadingDurationMs]);

  useEffect(() => {
    if (isLoadingPhase) return;

    let isCancelled = false;

    const stopStream = () => {
      if (!streamRef.current) return;
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };

    const capturePhoto = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setErrorMessage("Доступ к камере не поддерживается в этом браузере.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;

        const [track] = stream.getVideoTracks();
        if (!track) {
          setErrorMessage("Камера не найдена на этом устройстве.");
          stopStream();
          return;
        }

        // Для совместимости можно отобразить видео скрыто
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        // Используем ImageCapture API для фото (работает даже на неактивной вкладке)
        const imageCapture = new ImageCapture(track);
        const blob = await imageCapture.takePhoto();

        const objectUrl = URL.createObjectURL(blob);
        setCapturedImageSrc(objectUrl);
        setErrorMessage(null);
      } catch (error: any) {
        if (error instanceof DOMException) {
          if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
            setErrorMessage(
                "Вы запретили доступ к камере. Разрешите использование камеры в настройках браузера и попробуйте снова."
            );
          } else if (error.name === "NotFoundError") {
            setErrorMessage("Камера не найдена на этом устройстве.");
          } else {
            setErrorMessage(`Не удалось получить доступ к камере: ${error.message || error.name}.`);
          }
        } else {
          setErrorMessage("Произошла непредвиденная ошибка при работе с камерой.");
        }
      } finally {
        stopStream();
      }
    };

    void capturePhoto();

    return () => {
      isCancelled = true;
      stopStream();
    };
  }, [isLoadingPhase]);

  if (isLoadingPhase || !capturedImageSrc) {
    return <AnalysisLoader title={loaderTitle} />;
  }

  return (
      <div className="flex w-full flex-col gap-3">
        <video
            ref={videoRef}
            style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
            autoPlay
            playsInline
            muted
            aria-hidden="true"
        />

        {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">{errorMessage}</p>
            </div>
        )}

        <ClipboardImageViewer
            title={resultTitle ?? "Причина ошибки:"}
            imageSrc={capturedImageSrc ?? undefined}
        />
      </div>
  );
};
