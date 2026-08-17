import { notFound, redirect } from 'next/navigation';

type CompatibilityPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CompatibilityPage({ params }: CompatibilityPageProps) {
  const { slug } = await params;

  if (slug === 'faqs') {
    redirect('/FAQs');
  }

  notFound();
}
