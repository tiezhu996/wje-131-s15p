import { Alert, Button, List, Space, Table, Typography } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { useProjectStore } from '../stores/projectStore';
import { ProjectStatus } from '../types';
import { formatDate } from '../utils/formatDate';

export function Dashboard() {
  const { dashboard, projects, loadDashboard, loadProjects } = useProjectStore();

  useEffect(() => {
    void loadDashboard();
    void loadProjects();
  }, [loadDashboard, loadProjects]);

  const delayed = projects.filter((project) => project.status === ProjectStatus.Delayed);

  return (
    <>
      <div className="page-title">
        <div>
          <Typography.Title level={2}>项目总览仪表盘</Typography.Title>
          <Typography.Text type="secondary">在建项目、延期风险和材料消耗的日常调度视图</Typography.Text>
        </div>
        <Button type="primary">创建项目</Button>
      </div>

      <div className="metric-grid">
        <div className="metric">
          <Typography.Text type="secondary">在建项目</Typography.Text>
          <strong>{dashboard?.activeProjects ?? 0}</strong>
        </div>
        <div className="metric">
          <Typography.Text type="secondary">延期项目</Typography.Text>
          <strong>{dashboard?.delayedProjects ?? 0}</strong>
        </div>
        <div className="metric">
          <Typography.Text type="secondary">平均进度</Typography.Text>
          <strong>{dashboard?.averageProgress ?? 0}%</strong>
        </div>
        <div className="metric">
          <Typography.Text type="secondary">材料 TOP 项</Typography.Text>
          <strong>{dashboard?.materialUsageTop.length ?? 0}</strong>
        </div>
      </div>

      <div className="grid-two">
        <div className="surface">
          <Typography.Title level={4}>项目进度</Typography.Title>
          <Table
            rowKey="id"
            pagination={false}
            dataSource={projects}
            locale={{ emptyText: <EmptyState description="暂无项目" /> }}
            columns={[
              {
                title: '项目',
                dataIndex: 'name',
                render: (name, record) => <Link to={`/projects/${record.id}/gantt`}>{name}</Link>
              },
              { title: '状态', dataIndex: 'status', render: (value) => <StatusBadge value={value} /> },
              { title: '计划竣工', dataIndex: 'plannedEndDate', render: formatDate },
              { title: '进度', dataIndex: 'progress', render: (value) => <ProgressBar value={value} size="small" /> }
            ]}
          />
        </div>
        <Space direction="vertical" size={16}>
          <div className="surface">
            <Typography.Title level={4}>延期预警</Typography.Title>
            {delayed.length ? (
              <List
                dataSource={delayed}
                renderItem={(project) => (
                  <List.Item>
                    <Alert
                      type="error"
                      showIcon
                      message={project.name}
                      description={`${project.address} · 计划 ${formatDate(project.plannedEndDate)} 竣工`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <EmptyState description="暂无延期项目" />
            )}
          </div>
          <div className="surface">
            <Typography.Title level={4}>本月材料消耗 TOP10</Typography.Title>
            <List
              dataSource={dashboard?.materialUsageTop || []}
              locale={{ emptyText: <EmptyState description="暂无材料消耗" /> }}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text>{item.materialName}</Typography.Text>
                  <Typography.Text strong>
                    {item.quantity.toFixed(2)} {item.unit}
                  </Typography.Text>
                </List.Item>
              )}
            />
          </div>
        </Space>
      </div>
    </>
  );
}
