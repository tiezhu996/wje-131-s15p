import { Button, InputNumber, Select, Space, Table, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { materialApi } from '../api/material';
import { materialUsageApi } from '../api/materialUsage';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/common/StatusBadge';
import { usePagination } from '../hooks/usePagination';
import { useMaterialStore } from '../stores/materialStore';
import { useProjectStore } from '../stores/projectStore';
import { formatDate } from '../utils/formatDate';

export function MaterialManage() {
  const { materials, usages, loadMaterials, loadUsages } = useMaterialStore();
  const { projects, loadProjects } = useProjectStore();
  const [projectId, setProjectId] = useState<number | undefined>();
  const [receiveQuantity, setReceiveQuantity] = useState(10);
  const usagePagination = usePagination(usages, 6);

  useEffect(() => {
    void loadMaterials();
    void loadUsages();
    void loadProjects();
  }, [loadMaterials, loadProjects, loadUsages]);

  const receive = async (id: number) => {
    await materialApi.receive(id, receiveQuantity);
    message.success('入库完成');
    await loadMaterials();
  };

  const issue = async (id: number) => {
    await materialUsageApi.issue({
      materialId: id,
      projectId: projectId || projects[0]?.id,
      phaseId: projects[0]?.phases?.[0]?.id || 1,
      quantity: String(receiveQuantity),
      receiverId: 1,
      usedAt: new Date().toISOString().slice(0, 10),
      purpose: '现场临时领用'
    });
    message.success('出库完成');
    await loadMaterials();
    await loadUsages(projectId);
  };

  return (
    <>
      <div className="page-title">
        <div>
          <Typography.Title level={2}>材料管理</Typography.Title>
          <Typography.Text type="secondary">库存、低库存预警和项目领用记录统一管理</Typography.Text>
        </div>
        <Space>
          <InputNumber value={receiveQuantity} min={1} onChange={(value) => setReceiveQuantity(Number(value || 1))} />
          <Select
            placeholder="按项目筛选领用"
            allowClear
            style={{ width: 220 }}
            value={projectId}
            onChange={(value) => {
              setProjectId(value);
              void loadUsages(value);
            }}
            options={projects.map((project) => ({ value: project.id, label: project.name }))}
          />
        </Space>
      </div>
      <div className="grid-two">
        <div className="surface">
          <Typography.Title level={4}>库存列表</Typography.Title>
          <Table
            rowKey="id"
            pagination={false}
            dataSource={materials}
            rowClassName={(record) => (Number(record.stockQuantity) < Number(record.minStockThreshold) ? 'low-stock' : '')}
            locale={{ emptyText: <EmptyState description="暂无材料" /> }}
            columns={[
              { title: '材料', dataIndex: 'name' },
              { title: '规格', dataIndex: 'specification' },
              { title: '单位', dataIndex: 'unit' },
              { title: '库存', dataIndex: 'stockQuantity' },
              {
                title: '状态',
                render: (_, record) =>
                  Number(record.stockQuantity) < Number(record.minStockThreshold) ? <StatusBadge value="Delayed" /> : <StatusBadge value="Completed" />
              },
              {
                title: '操作',
                render: (_, record) => (
                  <Space>
                    <Button size="small" onClick={() => void receive(record.id)}>
                      入库
                    </Button>
                    <Button size="small" onClick={() => void issue(record.id)}>
                      出库
                    </Button>
                  </Space>
                )
              }
            ]}
          />
        </div>
        <div className="surface">
          <Typography.Title level={4}>领用记录</Typography.Title>
          <Table
            rowKey="id"
            size="small"
            dataSource={usagePagination.pagedItems}
            pagination={{
              current: usagePagination.page,
              pageSize: usagePagination.pageSize,
              total: usagePagination.total,
              onChange: (page, pageSize) => {
                usagePagination.setPage(page);
                usagePagination.setPageSize(pageSize);
              }
            }}
            columns={[
              { title: '材料', render: (_, record) => record.material?.name },
              { title: '数量', render: (_, record) => `${record.quantity} ${record.material?.unit || ''}` },
              { title: '领用人', render: (_, record) => record.receiver?.name },
              { title: '日期', dataIndex: 'usedAt', render: formatDate }
            ]}
          />
        </div>
      </div>
    </>
  );
}
