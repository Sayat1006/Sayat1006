import { DashboardHeader } from "@/components/dashboard/header";
import { AiChat } from "@/components/dashboard/ai-chat";
import { assistantQuickPrompts, initialAssistantConversation } from "@/lib/dashboard/mock-data";

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="AI Көмекші"
        description="Сабақ дайындауға, тапсырма құрастыруға және материалды жетілдіруге көмектеседі."
      />
      <AiChat initialMessages={initialAssistantConversation} quickPrompts={assistantQuickPrompts} />
    </div>
  );
}
