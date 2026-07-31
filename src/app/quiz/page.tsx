import { redirect } from "next/navigation";

// 旧URL /quiz → /lpic1/quiz へ永続リダイレクト（後方互換性）
export default function QuizRedirectPage() {
  redirect("/lpic1/quiz");
}
