import { BarChartOutlined, CalendarOutlined, ContainerOutlined, DatabaseOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './styles.css';

const { Header, Sider, Content } = Layout;

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.pathname.includes('/gantt')
    ? '/projects/1/gantt'
    : location.pathname.includes('/board')
      ? '/projects/1/board'
      : location.pathname;

  return (
    <Layout className="app-shell">
      <Sider width={238} className="app-sider">
        <div className="brand-block">
          <span className="brand-mark">CT</span>
          <div>
            <Typography.Title level={4}>Construction Tracker</Typography.Title>
            <Typography.Text>项目进度与资源调度</Typography.Text>
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selected]}
          onClick={(item) => navigate(item.key)}
          items={[
            { key: '/dashboard', icon: <BarChartOutlined />, label: '项目总览' },
            { key: '/projects/1/gantt', icon: <CalendarOutlined />, label: '甘特图视图' },
            { key: '/projects/1/board', icon: <ContainerOutlined />, label: '任务看板' },
            { key: '/materials', icon: <DatabaseOutlined />, label: '材料管理' },
            { key: '/reports/timesheet', icon: <FieldTimeOutlined />, label: '工时统计' }
          ]}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Typography.Text strong>东城综合体一期 · 今日现场协调会 16:30</Typography.Text>
          <Typography.Text type="secondary">Admin / RBAC 已启用</Typography.Text>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
