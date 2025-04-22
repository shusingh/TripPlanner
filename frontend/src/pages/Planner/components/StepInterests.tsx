import { Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

export interface StepInterestsProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

const TAGS = [
  { label: 'Must‑see Attractions', icon: 'lucide:map' },
  { label: 'Great Food',           icon: 'lucide:utensils' },
  { label: 'Hidden Gems',          icon: 'lucide:star' },
  { label: 'Nightlife',            icon: 'lucide:moon' },
  { label: 'History',              icon: 'lucide:book' },
  { label: 'Nature',               icon: 'lucide:tree' },
  { label: 'Adventure',            icon: 'lucide:mountain' },
  { label: 'Culture',              icon: 'lucide:landmark' },
  { label: 'Shopping',             icon: 'lucide:shopping-bag' },
];

export default function StepInterests({
  selectedTags,
  onToggleTag,
}: StepInterestsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select your interests</h2>
      <div className="flex flex-wrap gap-3">
        {TAGS.map(({ label, icon }) => {
          const isSelected = selectedTags.includes(label);

          return (
            <Chip
              key={label}
              className="cursor-pointer px-4 py-5 text-base"
              color={isSelected ? 'primary' : 'default'}
              startContent={<Icon icon={icon} />}
              variant={isSelected ? 'solid' : 'bordered'}
              onClick={() => onToggleTag(label)}
            >
              {label}
            </Chip>
          );
        })}
      </div>
    </div>
  );
}
