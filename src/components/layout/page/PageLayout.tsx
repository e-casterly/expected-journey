import { ReactNode } from "react";

type PageLayoutProps = Readonly<{
  children: ReactNode;
  aside?: ReactNode;
  title?: string;
  description?: string;
}>;

export default function PageLayout({ children, title, description, aside }: PageLayoutProps) {
  return (
    <section className="flex flex-col">
      <div className="border-b border-stroke py-6">
        <div className="container mx-auto flex items-center justify-between gap-4">
          {title && (
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-zinc-600">{description}</p>
              )}
            </div>
          )}
          <div>{aside}</div>
        </div>
      </div>
      <div className="container mx-auto flex flex-1 flex-col">{children}</div>
    </section>
  );
}