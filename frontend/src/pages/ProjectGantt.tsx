import { Button, DatePicker, Space, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { UserAvatar } from '../components/common/UserAvatar';
import { useProject } from '../hooks/useProject';
import { TaskPhase } from '../types';
import { formatDate } from '../utils/formatDate';

function offsetPercent(phase: TaskPhase) {
  const start = new Date(phase.plannedStartDate).getTime();
  const end = new Date(phase.plannedEndDate).getTime();
  const duration = Math.max(end - start, 1);
  const yearStart = new Date('2026-03-01').getTime();
  return {
    left: Math.max(0, Math.min(78, ((start - yearStart) / (1000 * 60 * 60 * 24 * 260)) * 100)),
    width: Math.max(10, Math.min(95, (duration / (1000 * 60 * 60 * 24 * 260)) * 100))
  };
}

export function ProjectGantt() {
  const id = Number(useParams().id || 1);
  const { project, loading } = useProject(id);
  const phases = project?.phases || [];

  return (
    <>
      <div className="page-title">
        <div>
          <Typography.Title level={2}>{project?.name || '项目详情'} · 甘特图</Typography.Title>
          <Typography.Text type="secondary">{project?.address || '加载中'}</Typography.Text>
        </div>
        <Space>
          <DatePicker.RangePicker />
          <Button type="primary">保存日期调整</Button>
        </Space>
      </div>
      <div className="surface">
        <Space direction="vertical" style={{ width: '100%' }} size={14}>
          <ProgressBar value={project?.progress || 0} />
          {loading ? (
            <Typography.Text>加载中...</Typography.Text>
          ) : (
            phases.map((phase) => {
              const style = offsetPercent(phase);
              return (
                <div className="gantt-row" key={phase.id}>
                  <div>
                    <Typography.Text strong>{phase.name}</Typography.Text>
                    <br />
                    <Space>
                      <StatusBadge value={phase.status} />
                      <UserAvatar name={phase.owner?.name} />
                    </Space>
                  </div>
                  <div className="gantt-track" aria-label={`${phase.name} 时间线`}>
                    <div className="gantt-bar" style={{ left: `${style.left}%`, width: `${style.width}%` }} />
                  </div>
                  <div>
                    <Typography.Text type="secondary">{formatDate(phase.plannedStartDate)}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">{formatDate(phase.plannedEndDate)}</Typography.Text>
                  </div>
                </div>
              );
            })
          )}
        </Space>
      </div>
    </>
  );
}
