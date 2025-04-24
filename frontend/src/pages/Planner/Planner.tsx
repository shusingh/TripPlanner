import type { DateValue } from '@react-types/datepicker';
import type { RangeValue } from '@react-types/shared';

import { useState } from 'react';
import { Progress, Button, Alert } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import StepDestination from './components/StepDestination';
import StepDates from './components/StepDates';
import StepInterests from './components/StepInterests';

import DefaultLayout from '@/layouts/default';

const TOTAL_STEPS = 3;

export default function PlannerPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStepValid =
    step === 1
      ? destination.trim().length > 0
      : step === 2
        ? !!(dateRange && dateRange.start && dateRange.end)
        : tags.length > 0;

  const handleNext = () => {
    if (isStepValid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  const toggleTag = (label: string) =>
    setTags((cur) =>
      cur.includes(label) ? cur.filter((t) => t !== label) : [...cur, label]
    );

  const handleSubmit = async () => {
    if (!isStepValid || !dateRange?.start || !dateRange.end) return;

    setLoading(true);
    setError(null);

    try {
      // Prepare payload
      const payload = {
        destination,
        startDate: dateRange.start.toString(),
        endDate: dateRange.end.toString(),
        tags,
      };

      // Call your API
      const base = import.meta.env.VITE_API_BASE_URL || '';
      const resp = await fetch(`${base}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // If non-2xx, read body once and extract a meaningful message
      if (!resp.ok) {
        const bodyText = await resp.text();
        let msg = `Status ${resp.status}`;

        try {
          const data = JSON.parse(bodyText);

          if (typeof data.error === 'string') {
            msg = data.error;
          } else if (Array.isArray(data.detail)) {
            msg = data.detail
              .map((d: any) => d.msg || JSON.stringify(d))
              .join('; ');
          } else {
            msg = JSON.stringify(data);
          }
        } catch {
          if (bodyText) msg = bodyText;
        }

        throw new Error(msg);
      }

      // Otherwise parse JSON and navigate
      const data = await resp.json();

      navigate('/planner/results', { state: data });
    } catch (err: any) {
      setError(
        err.message || 'Failed to fetch recommendations. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-xl p-4">
        {/* Hero UI Alert Banner */}
        {error && (
          <div className="mb-4">
            <Alert color="danger" title={error} />
          </div>
        )}

        {/* Progress + step label */}
        <div className="mb-4 flex items-center justify-between">
          <Progress
            aria-label="Progress"
            className="mr-4 flex-1"
            value={(step / TOTAL_STEPS) * 100}
          />
          <span className="text-sm font-medium">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>

        {/* Step components */}
        {step === 1 && (
          <StepDestination
            destination={destination}
            onChange={setDestination}
          />
        )}
        {step === 2 && (
          <StepDates dateRange={dateRange} onChange={setDateRange} />
        )}
        {step === 3 && (
          <StepInterests selectedTags={tags} onToggleTag={toggleTag} />
        )}

        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between">
          {step > 1 ? (
            <Button
              radius="full"
              startContent={<Icon icon="lucide:arrow-left" />}
              variant="bordered"
              onPress={handleBack}
            >
              Back
            </Button>
          ) : (
            <span />
          )}

          <Button
            color="primary"
            endContent={
              <Icon
                icon={
                  step < TOTAL_STEPS ? 'lucide:arrow-right' : 'lucide:check'
                }
              />
            }
            isDisabled={!isStepValid}
            isLoading={isLoading}
            radius="full"
            onPress={step < TOTAL_STEPS ? handleNext : handleSubmit}
          >
            {step < TOTAL_STEPS ? 'Next' : 'Submit'}
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
