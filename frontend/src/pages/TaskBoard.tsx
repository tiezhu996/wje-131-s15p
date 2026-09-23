import { Button, Select, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { subTaskApi } from '../api/subTask';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { UserAvatar } from '../components/common/UserAvatar';
import { useProject } from '../hooks/useProject';
import { useTaskStore } from '../stores/taskStore';
import { TaskStatus } from '../types';
import { formatDuration } from '../utils/formatDuration';

const columns = [TaskStatus.Todo, TaskStatus.InProgress, TaskStatus.Review, TaskStatus.Done];

export function TaskBoard() {
  const id = Number(useParams().id || 1);
  const { project, refresh } = useProject(id);
  const { phases, tasks, loadPhases } = useTaskStore();

  useEffect(() => {
    void loadPhases(id);
  }, [id, loadPhases]);

  const moveTask = async (taskId: number, status: TaskStatus) => {
    await subTaskApi.updateStatus(taskId, status);
    // 状态变更会触发后端重算阶段/项目进度，看板与甘特图、总览刷新同一组数值
    await Promise.all([loadPhases(id), refresh()]);
  };

  return (
    <>
      <div className="page-title">
        <div>
          <Typography.Title level={2}>{project?.name || '项目'} · 任务看板</Typography.Title>
          <Typography.Text type="secondary">按任务状态推进，现场负责人可直接更新流转状态</Typography.Text>
        </div>
        <Button type="primary">新增子任务</Button>
      </div>
      <div className="surface" style={{ marginBottom: 16 }}>
        <Space direction="vertical" size={10} style={{ width: '100%' }}>
          <Typography.Text strong>项目进度</Typography.Text>
          <ProgressBar value={project?.progress || 0} />
          <Space size={24} wrap>
            {phases.map((phase) => (
              <Space key={phase.id} size={8}>
                <Typography.Text type="secondary">{phase.name}</Typography.Text>
                <div style={{ width: 120 }}>
                  <ProgressBar value={phase.percentComplete} size="small" />
                </div>
              </Space>
            ))}
          </Space>
        </Space>
      </div>
      <div className="board">
        {columns.map((status) => (
          <div className="board-column" key={status}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <StatusBadge value={status} />
              <Typography.Text type="secondary">{tasks.filter((task) => task.status === status).length}</Typography.Text>
            </Space>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div className="task-card" key={task.id}>
                  <Typography.Text strong>{task.name}</Typography.Text>
                  <p>{task.description}</p>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <UserAvatar name={task.owner?.name} />
                    <Typography.Text type="secondary">
                      计划 {formatDuration(task.estimatedHours)} / 实际 {formatDuration(task.actualHours)}
                    </Typography.Text>
                    <Select
                      size="small"
                      value={task.status}
                      style={{ width: '100%' }}
                      options={columns.map((item) => ({ value: item, label: item }))}
                      onChange={(next) => void moveTask(task.id, next)}
                    />
                  </Space>
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
