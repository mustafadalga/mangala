import { create } from 'zustand';

interface ModalGameOver {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export default create<ModalGameOver>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

