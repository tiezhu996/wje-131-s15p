import { Progress } from 'antd';

export function ProgressBar({ value, size = 'default' }: { value: number; size?: 'small' | 'default' }) {
  const status = value >= 100 ? 'success' : value < 40 ? 'exception' : 'active';
  return <Progress percent={Math.round(value)} size={size} status={status} strokeColor={value < 40 ? '#cf3f36' : '#2b7a78'} />;
}
