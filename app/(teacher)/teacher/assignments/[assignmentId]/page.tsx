import { PlaceholderPage } from "@/components/placeholder-page"

export default async function TeacherAssignmentPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>
}) {
  const { assignmentId } = await params

  return (
    <PlaceholderPage
      eyebrow="Teacher"
      title={`Assignment ${assignmentId}`}
      description="Assignment detail, submissions, and quiz generation land in Phase 5."
    />
  )
}
