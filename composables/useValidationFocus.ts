export function useValidationFocus() {
  return async () => {
    await nextTick()
    const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog[open]')
    const container = dialogs[dialogs.length - 1] || document.querySelector('main')
    container?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }
}
