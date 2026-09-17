let lockCount = 0;
let lockY = 0;

export function setBodyLock(on: boolean): void {
  if (typeof document === "undefined") return;

  if (on) {
    if (lockCount === 0) {
      lockY = window.scrollY;
      document.body.classList.add("is-locked");
      document.body.style.top = `-${lockY}px`;
    }
    lockCount += 1;
    return;
  }

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.classList.remove("is-locked");
    document.body.style.top = "";
    window.scrollTo(0, lockY);
  }
}

export function isBodyLocked(): boolean {
  return lockCount > 0;
}
