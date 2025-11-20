export async function generateStaticParams() {
  // Generate static paths for known classes
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

export default function ClassLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
