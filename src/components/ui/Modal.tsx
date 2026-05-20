import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/35 px-4">
      <div className="w-full max-w-3xl animate-fadeIn rounded-2xl border border-slate-200 bg-paper p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-serif text-xl text-mlan">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            关闭
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
