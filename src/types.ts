export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  category: string;
  priority: TaskPriority;
  createdAt: Date;
  completedAt?: Date;
  reminderDate?: Date;
  reminderSent?: boolean;
  parentId?: string; // For subtasks
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}
