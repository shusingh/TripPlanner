import type { DateValue } from '@react-types/datepicker';
import type { RangeValue } from '@react-types/shared';

import { useState, useEffect } from 'react';
import { Progress, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { parseDate } from '@internationalized/date';

import StepDestination from './components/StepDestination';
import StepDates from './components/StepDates';
import StepInterests from './components/StepInterests';

import DefaultLayout from '@/layouts/default';
import { useNavigate } from 'react-router-dom';

// Key for localStorage
const STORAGE_KEY = 'planner-state';
const TOTAL_STEPS = 3;

type StoredState = {
  step: number;
  destination: string;
  tags: string[];
  start?: string;
  end?: string;
};

export default function PlannerPage() {
    const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const obj: StoredState = JSON.parse(saved);

        setStep(obj.step || 1);
        setDestination(obj.destination || '');
        setTags(obj.tags || []);
        if (obj.start && obj.end) {
          setDateRange({ start: parseDate(obj.start), end: parseDate(obj.end) });
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Persist state on changes
  useEffect(() => {
    const store: StoredState = { step, destination, tags };

    if (dateRange?.start && dateRange?.end) {
      store.start = dateRange.start.toString();
      store.end = dateRange.end.toString();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [step, destination, dateRange, tags]);

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
    if (!isStepValid || !dateRange || !dateRange.start || !dateRange.end) return;
    setLoading(true);
    setError(null);
    try {
      const payload = JSON.stringify({
        destination,
        startDate: dateRange.start.toString(),
        endDate: dateRange.end.toString(),
        tags,
      });
      const resp = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });

      if (!resp.ok) throw new Error(`Status ${resp.status}`);
      const data = await resp.json();
      
      // send the data to ResultsPage
      navigate('/planner/results', { state: data });
    } catch {
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-xl mx-auto p-4">
        {/* Progress + label */}
        <div className="flex items-center justify-between mb-4">
          <Progress
            aria-label="Progress"
            className="flex-1 mr-4"
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
          <StepDates
            dateRange={dateRange}
            onChange={setDateRange}
          />
        )}
        {step === 3 && (
          <StepInterests
            selectedTags={tags}
            onToggleTag={toggleTag}
          />
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
          ) : <span />}

          <Button
            color="primary"
            endContent={
              <Icon icon={step < TOTAL_STEPS ? 'lucide:arrow-right' : 'lucide:check'} />
            }
            isDisabled={!isStepValid}
            isLoading={isLoading}
            radius="full"
            onPress={step < TOTAL_STEPS ? handleNext : handleSubmit}
          >
            {step < TOTAL_STEPS ? 'Next' : 'Submit'}
          </Button>
        </div>
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </DefaultLayout>
  );
}