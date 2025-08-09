import PostSection from "../components/PostSection/PostSection";
import { Post } from "../types/post";
import { BackArrow } from "../components/BackArrow/BackArrow";

type InscribePageProps = {
  post: Post | null;
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
