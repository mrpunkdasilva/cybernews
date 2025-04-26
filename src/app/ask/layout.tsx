export const metadata = {
  title: 'Ask HN | CyberNews',
  description: 'Questions and discussions from the cyberpunk Hacker News client',
};

export default function AskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}