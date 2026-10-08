import { useEffect, useRef } from "react";
import { pauseParticles } from "../effects/particles.js";
let scrollLocks = 0;
let previousOverflow = "";
export default function Modal({
  children,
  titleId,
  onRequestClose,
  className = "",
}) {
  const ref = useRef(null),
    close = useRef(onRequestClose);
  close.current = onRequestClose;
  useEffect(() => {
    const dialog = ref.current,
      opener = document.activeElement;
    if (scrollLocks === 0) previousOverflow = document.body.style.overflow;
    scrollLocks += 1;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const resumeParticles = pauseParticles();
    return () => {
      dialog.close();
      scrollLocks -= 1;
      if (scrollLocks === 0) {
        document.body.style.overflow = previousOverflow;
      }
      resumeParticles();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
      else document.querySelector("dialog[open] button")?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`resource-dialog ${className}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        close.current();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            close.current();
        }
      }}
    >
      {children}
    </dialog>
  );
}
