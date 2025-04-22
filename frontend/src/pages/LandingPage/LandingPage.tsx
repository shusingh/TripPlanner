import { Link } from '@heroui/link';
import { Snippet } from '@heroui/snippet';
import { Code } from '@heroui/code';
import { button } from '@heroui/theme';

import { siteConfig } from '@/config/site';
import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { GlobeAnimation } from '@/components/GlobeAnimation';

export default function LandingPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg justify-center text-center">
          <span className={title()}>Plan Your&nbsp;</span>
          <span className={title({ color: 'violet' })}>Perfect Trip&nbsp;</span>
          <br />
          <span className={title()}>With AI</span>
          <div className={subtitle({ class: 'mt-4' })}>
            {siteConfig.description}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            aria-label="Start planning your trip"
            className={button({
              color: 'primary',
              variant: 'shadow',
              radius: 'full',
              class: `inline-flex transform-gpu items-center gap-2 px-6 py-3 antialiased transition duration-200 will-change-transform hover:scale-105 active:scale-95`,
            })}
            href="/planner"
          >
            <GlobeAnimation className="inline-block" size={24} />
            <span className="font-medium">Start</span>
          </Link>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Get started by clicking <Code color="primary">Start</Code>
            </span>
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
