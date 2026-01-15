import { User } from "firebase/auth";
import ChatContainer from "@/components/chat/ChatContainer";

interface IndexProps {
  user: User;
}

const Index = ({ user }: IndexProps) => {
  return <ChatContainer user={user} />;
};

export default Index;