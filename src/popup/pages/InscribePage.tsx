import PostSection from "../components/PostSection/PostSection";
import { Content } from "../interfaces/content";
import { BackArrow } from "../components/BackArrow/BackArrow";

type InscribePageProps = {
  post: Content | null;
  onInscribe: (receiverPubKey: string) => Promise<void>;
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
