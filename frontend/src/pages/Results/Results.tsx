import type { RecommendationResponse, Place } from '@/types/recommendations';

import { useLocation, Navigate } from 'react-router-dom';
import { Card } from '@heroui/react';

import DefaultLayout from '@/layouts/default';


function Section({
  title,
  items,
}: {
  title: string;
  items: Place[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((place) => (
          <Card key={place.name} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{place.name}</h3>
            <p className="text-sm mb-3">{place.description}</p>
            {place.url && (
              <a
                className="text-primary underline text-sm"
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
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your Recommendations</h1>
        <Section items={attractions} title="Attractions" />
        <Section items={food}        title="Food" />
        <Section items={other}       title="Other" />
      </div>
    </DefaultLayout>
  );
}
