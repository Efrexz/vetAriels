import type { ReactNode } from 'react';
import AlertIcon from '@assets/alertIcon.svg?react';
import InfoIcon from '@assets/infoIcon.svg?react';
import CheckIcon from '@assets/checkIcon.svg?react';

type InfoBannerType = 'info' | 'warning' | 'danger' | 'success';

interface InfoBannerProps {
  type?: InfoBannerType;
  children: ReactNode;
}

const config: Record<
  InfoBannerType,
  { bg: string; border: string; text: string; Icon: typeof AlertIcon }
> = {
  info: {
    bg: 'bg-primary/5',
    border: 'border-primary',
    text: 'text-primary',
    Icon: InfoIcon,
  },
  warning: {
    bg: 'bg-amber/10',
    border: 'border-amber',
    text: 'text-amber-dark',
    Icon: AlertIcon,
  },
  danger: {
    bg: 'bg-danger/10',
    border: 'border-danger',
    text: 'text-danger',
    Icon: AlertIcon,
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success',
    text: 'text-success',
    Icon: CheckIcon,
  },
};

function InfoBanner({ type = 'info', children }: InfoBannerProps) {
  const { bg, border, text, Icon } = config[type];

  return (
    <div
      className={`${bg} border-l-2 ${border} ${text} p-4 rounded-lg flex items-start gap-3`}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{children}</p>
    </div>
  );
}

export { InfoBanner };
