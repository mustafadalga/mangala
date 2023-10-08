import { create } from 'zustand';

interface LoaderStore {
    isOpen: boolean,
    onOpen: () => void;
    onClose: () => void;
}


export default create<LoaderStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

