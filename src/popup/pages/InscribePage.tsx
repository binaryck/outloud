import PostSection from "../components/PostSection";
import { Post } from "../types/post";
import { BackArrow } from "../components/BackArrow";

type InscribePageProps = {
  post: Post;
  onInscribe: () => Promise<void>;
  isInscribing?: boolean;
};

export function InscribePage({
  post,
  onInscribe,
  isInscribing = false,
}: InscribePageProps): React.JSX.Element {
  return (
    <>
      <PostSection
        post={post}
        onInscribe={onInscribe}
        isInscribing={isInscribing}
      />
      <BackArrow />
    </>
  );
}
