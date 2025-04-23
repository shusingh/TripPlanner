import type { RecommendationResponse, Place } from '@/types/recommendations';

import { useLocation, Navigate } from 'react-router-dom';
import { Card } from '@heroui/react';

import DefaultLayout from '@/layouts/default';

function Section({ title, items }: { title: string; items: Place[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((place) => (
          <Card key={place.name} className="p-4">
            <h3 className="mb-2 text-lg font-semibold">{place.name}</h3>
            <p className="mb-3 text-sm">{place.description}</p>
            {place.url && (
              <a
                className="text-sm text-primary underline"
                href={place.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more
              </a>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function ResultsPage() {
  const location = useLocation();
  const data = location.state as RecommendationResponse | undefined;

  // If no data was passed, redirect back to the planner
  if (!data) {
    return <Navigate replace to="/planner" />;
  }

  const { attractions, food, other = [] } = data;

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-4xl p-4">
        <h1 className="mb-6 text-3xl font-bold">Your Recommendations</h1>
        <Section items={attractions} title="Attractions" />
        <Section items={food} title="Food" />
        <Section items={other} title="Other" />
      </div>
    </DefaultLayout>
  );
}
