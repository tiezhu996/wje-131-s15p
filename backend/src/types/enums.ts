export enum ProjectStatus {
  Planning = 'Planning',
  InProgress = 'InProgress',
  Delayed = 'Delayed',
  Completed = 'Completed',
  Archived = 'Archived'
}

export enum PhaseStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Blocked = 'Blocked'
}

export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Review = 'Review',
  Done = 'Done'
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum MaterialUnit {
  Kg = 'kg',
  Ton = '吨',
  Piece = '件',
  Box = '箱',
  Meter = '米',
  CubicMeter = '立方米'
}

export enum UserRole {
  Admin = 'Admin',
  ProjectManager = 'ProjectManager',
  Foreman = 'Foreman',
  Worker = 'Worker'
}
