import { TaskPhase } from '../models/taskPhase.entity';
import { SubTask } from '../models/subTask.entity';
import { TaskStatus } from '../types/enums';

/**
 * 阶段计划工期（天）。按自然日计，起止同一天也至少占 1 天，
 * 用于项目进度按阶段计划工期加权汇总。
 */
export function plannedDurationDays(phase: Pick<TaskPhase, 'plannedStartDate' | 'plannedEndDate'>): number {
  const start = new Date(phase.plannedStartDate).getTime();
  const end = new Date(phase.plannedEndDate).getTime();
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(diffDays, 1);
}

/**
 * 按“已完成子任务的预计工时 / 全部子任务预计工时”计算阶段完成百分比。
 * 全部子任务预计工时为 0 时退化为按子任务数量计数，避免除零。
 */
export function phasePercentFromTasks(subTasks: Pick<SubTask, 'estimatedHours' | 'status'>[]): number {
  const totalHours = subTasks.reduce((sum, task) => sum + Number(task.estimatedHours || 0), 0);
  const doneHours = subTasks
    .filter((task) => task.status === TaskStatus.Done)
    .reduce((sum, task) => sum + Number(task.estimatedHours || 0), 0);

  if (totalHours > 0) {
    return Math.round((doneHours / totalHours) * 100);
  }
  if (subTasks.length > 0) {
    return Math.round((subTasks.filter((task) => task.status === TaskStatus.Done).length / subTasks.length) * 100);
  }
  return 0;
}

/**
 * 项目进度按各阶段计划工期加权汇总；没有子任务的阶段沿用其自身 percentComplete。
 * 所有阶段工期合计为 0（理论上不会，因为每天数至少为 1）时回退为简单平均。
 */
export function projectProgressFromPhases(phases: Array<Pick<TaskPhase, 'plannedStartDate' | 'plannedEndDate' | 'percentComplete'>>): number {
  if (phases.length === 0) {
    return 0;
  }
  const totalWeight = phases.reduce((sum, phase) => sum + plannedDurationDays(phase), 0);
  if (totalWeight <= 0) {
    return Math.round(phases.reduce((sum, phase) => sum + phase.percentComplete, 0) / phases.length);
  }
  const weighted = phases.reduce((sum, phase) => sum + phase.percentComplete * plannedDurationDays(phase), 0);
  return Math.round(weighted / totalWeight);
}
