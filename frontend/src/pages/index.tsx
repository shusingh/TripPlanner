import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GlobeIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Plan Your&nbsp;</span>
          <span className={title({ color: "violet" })}>Perfect Trip&nbsp;</span>
          <br />
          <span className={title()}>With AI</span>
          <div className={subtitle({ class: "mt-4" })}>
            {siteConfig.description}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href="/planner"
          >
            <GlobeIcon size={20} />
            Start
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
