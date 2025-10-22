import { create } from 'zustand';
import toysData from '../../app/data/toys.json';

const defaultMilestones = {
  0: ["Lifts head", "Responds to sound"],
  1: ["Smiles at people", "Follows objects"],
  2: ["Rolls over", "Holds head steady"],
  3: ["Sits without support", "Pushes down on legs"],
};

export const useMilestoneStore = create((set, get) => ({
  completed: {},
  completedMonths: new Set(),

  toggleMilestone: (month, milestone) => set((state) => {
    const key = `${month}:${milestone}`;
    const newCompleted = { ...state.completed };
    newCompleted[key] = !newCompleted[key];

    // Check if all milestones for month are completed
    const monthMilestones = defaultMilestones[month] || [];
    const allCompleted = monthMilestones.every(m => newCompleted[`${month}:${m}`]);

    const newCompletedMonths = new Set(state.completedMonths);
    if (allCompleted) {
      newCompletedMonths.add(month);
    } else {
      newCompletedMonths.delete(month);
    }

    return { completed: newCompleted, completedMonths: newCompletedMonths };
  }),

  getSuggestedToys: (month) => {
    const monthMilestones = defaultMilestones[month] || [];
    return toysData.filter(toy => {
      const toyMonth = parseInt(toy.age.replace('m', ''), 10);
      return toyMonth === month && toy.milestones.some(m => monthMilestones.includes(m));
    }).slice(0, 4); // Top 4
  },

  getLatestCompletedMonth: () => {
    const { completedMonths } = get();
    return Math.max(...Array.from(completedMonths));
  },
}));
