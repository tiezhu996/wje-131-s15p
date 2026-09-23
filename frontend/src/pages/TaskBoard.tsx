import { Button, Select, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { subTaskApi } from '../api/subTask';
import { StatusBadge } from '../components/common/StatusBadge';
import { UserAvatar } from '../components/common/UserAvatar';
import { useProject } from '../hooks/useProject';
import { useTaskStore } from '../stores/taskStore';
import { TaskStatus } from '../types';
import { formatDuration } from '../utils/formatDuration';

const columns = [TaskStatus.Todo, TaskStatus.InProgress, TaskStatus.Review, TaskStatus.Done];

export function TaskBoard() {
  const id = Number(useParams().id || 1);
  const { project } = useProject(id);
  const { tasks, loadPhases } = useTaskStore();

  useEffect(() => {
    void loadPhases(id);
  }, [id, loadPhases]);

  const moveTask = async (taskId: number, status: TaskStatus) => {
    await subTaskApi.updateStatus(taskId, status);
    await loadPhases(id);
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
