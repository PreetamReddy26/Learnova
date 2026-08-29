import { SectionHeading } from "@/components/marketing/section-heading"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    question: "Does Learnova replace my child's teacher?",
    answer:
      "No. Learnova is built to support what happens in the classroom, not substitute for it. It helps with practice, revision, and doubt-solving outside class hours, while teachers remain the primary source of instruction.",
  },
  {
    question: "Which curricula do you support?",
    answer:
      "CBSE, ICSE, ISC, Cambridge, and the Telangana State Board today, each with its own curated knowledge base and expert review process.",
  },
  {
    question: "How do you make sure answers match my board's syllabus?",
    answer:
      "Each curriculum has a dedicated knowledge base built from official syllabus and assessment materials. Subject-matter experts for that board review how the AI answers, and content is re-validated whenever a board revises its syllabus.",
  },
  {
    question: "Can parents see my child's progress?",
    answer:
      "Yes, through the Parent Dashboard — study hours, subject performance, and AI insights, without needing account access to the student's own conversations.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes — you can create an account and start asking the AI Assistant questions at no cost. Pricing for the full study planner and reporting suite will be announced closer to launch.",
  },
]

export function Faq() {
  return (
    <section className="flex flex-col items-center gap-12 px-6 py-20 sm:px-10">
      <SectionHeading eyebrow="FAQ" title="Common questions" />
      <Accordion className="w-full max-w-2xl">
        {FAQS.map(({ question, answer }) => (
          <AccordionItem key={question} value={question}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
