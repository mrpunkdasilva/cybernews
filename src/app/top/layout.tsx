export const metadata = {
  title: 'Top Stories | CyberNews',
  description: 'The most upvoted stories from the cyberpunk Hacker News client',
};

export default function TopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}