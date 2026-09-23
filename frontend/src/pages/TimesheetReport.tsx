import { Table, Typography } from 'antd';
import { useEffect } from 'react';
import { ProgressBar } from '../components/common/ProgressBar';
import { UserAvatar } from '../components/common/UserAvatar';
import { useTaskStore } from '../stores/taskStore';
import { formatDuration } from '../utils/formatDuration';

export function TimesheetReport() {
  const { timesheet, loadTimesheet } = useTaskStore();

  useEffect(() => {
    void loadTimesheet();
  }, [loadTimesheet]);

  return (
    <>
      <div className="page-title">
        <div>
          <Typography.Title level={2}>人员工时统计</Typography.Title>
          <Typography.Text type="secondary">按人员汇总计划与实际工时，供周报和月报复盘使用</Typography.Text>
        </div>
      </div>
      <div className="surface">
        <Table
          rowKey="userId"
          dataSource={timesheet}
          columns={[
            { title: '人员', dataIndex: 'userName', render: (name) => <UserAvatar name={name} /> },
            { title: '计划工时', dataIndex: 'plannedHours', render: formatDuration },
            { title: '实际工时', dataIndex: 'actualHours', render: formatDuration },
            { title: '利用率', dataIndex: 'utilization', render: (value) => <ProgressBar value={value} size="small" /> }
          ]}
        />
      </div>
    </>
  );
}
