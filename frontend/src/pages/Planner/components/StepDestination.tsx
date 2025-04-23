import { Input } from '@heroui/react';
import { Icon } from '@iconify/react';

export interface StepDestinationProps {
  destination: string;
  onChange: (value: string) => void;
}

export default function StepDestination({
  destination,
  onChange,
}: StepDestinationProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">First, where do you want to go?</h2>
      <Input
        label="Destination"
        placeholder="e.g., Paris, France"
        size="lg"
        startContent={
          <Icon className="text-default-400" icon="lucide:map-pin" />
        }
        value={destination}
        onValueChange={onChange}
      />
    </div>
  );
}
