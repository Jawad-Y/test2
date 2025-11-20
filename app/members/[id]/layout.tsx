export async function generateStaticParams() {
  // Generate static paths for known members
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
