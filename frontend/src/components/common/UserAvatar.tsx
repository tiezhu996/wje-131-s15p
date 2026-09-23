import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export function UserAvatar({ name }: { name?: string }) {
  const initial = name?.slice(0, 1);
  return (
    <Space size={8}>
      <Avatar size="small" icon={!initial ? <UserOutlined /> : undefined} style={{ background: '#315f72' }}>
        {initial}
      </Avatar>
      <span>{name || '未分配'}</span>
    </Space>
  );
}
