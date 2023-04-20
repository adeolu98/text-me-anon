import NewMessage from "@/components/NewMessage";
import { NextPage } from "next";
import { AppLayout } from "@/components/AppLayout";

const SpecificNewMessage: NextPage = () => {
  return (
    <AppLayout>
      <NewMessage />
    </AppLayout>
  );
};

export default SpecificNewMessage;
