export const metadata = {
  title: 'Best Stories | CyberNews',
  description: 'The best stories from the cyberpunk Hacker News client',
};

export default function BestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}