import { create } from "zustand";

interface PresenceState {
  members: any[];
  setMembers: (members: any[]) => void;
  addMember: (member: any) => void;
  removeMember: (socketId: string) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
  addMember: (member) =>
    set((state) => ({
      members: state.members.some((m) => m.socketId === member.socketId)
        ? state.members
        : [...state.members, member],
    })),
  removeMember: (socketId) =>
    set((state) => ({
      members: state.members.filter((m) => m.socketId !== socketId),
    })),
}));
