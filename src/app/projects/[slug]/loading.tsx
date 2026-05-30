import { LoadingCurtain } from "@/src/adapters/routes/components/LoadingCurtain";
import { getServerTranslations } from "@/src/i18n/serverLocale";

export default async function ProjectDetailLoading() {
  const { t } = await getServerTranslations();
  return <LoadingCurtain label={t.loading.label} text={t.loading.text} />;
}

ProjectDetailLoading.displayName = "ProjectDetailLoading";
