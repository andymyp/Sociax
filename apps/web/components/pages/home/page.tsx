import ContentTemplate from "@/components/templates/content-template";
import LeftbarTemplate from "@/components/templates/leftbar-template";
import MainTemplate from "@/components/templates/main-template";
import { InputPost } from "./input-post";
import { Posts } from "./posts";
import RightbarTemplate from "@/components/templates/rightbar-template";
import { Trending } from "./trending";
import { Promote } from "./promote";
import { SuggestUser } from "./suggest-user";

export default function HomePage() {
  return (
    <MainTemplate>
      <LeftbarTemplate />

      <ContentTemplate>
        <InputPost />
        <Posts />
      </ContentTemplate>

      <RightbarTemplate>
        <Trending />
        <Promote />
        <SuggestUser />
      </RightbarTemplate>
    </MainTemplate>
  );
}
