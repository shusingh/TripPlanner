import type { RangeValue } from '@react-types/shared';
import type { DateValue } from '@react-types/datepicker';

import { DateRangePicker } from '@heroui/react';
import { parseDate } from '@internationalized/date';

export interface StepDatesProps {
  dateRange: RangeValue<DateValue> | null;
  onChange: (range: RangeValue<DateValue> | null) => void;
}

export default function StepDates({ dateRange, onChange }: StepDatesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">When will you travel?</h2>
      <DateRangePicker
        label="Travel Period"
        minValue={parseDate(new Date().toISOString().split('T')[0])}
        value={dateRange}
        onChange={onChange}
      />
    </div>
  );
}
