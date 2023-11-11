import { getUserAuth } from '@/lib/auth/utils';

import ActiveSectionContextProvider from '@/components/context/activeSectionContext';
import HomeNavbar from '@/components/navigation/HomeNavbar';
import BackgroundCircles from '@/components/start/BackgroundCircles';
import Footer from '@/components/start/Footer';
import HoverTranslate from '@/components/start/HoverTranslate';
import HowTo from '@/components/start/HowTo';
import Reasons from '@/components/start/Reasons';
import Welcome from '@/components/start/Welcome';

export default async function Home() {
  const userAuth = await getUserAuth();
  return (
    <main>
      <BackgroundCircles />
      <ActiveSectionContextProvider>
        <HomeNavbar />
        <Welcome userAuth={userAuth} />
        <HowTo />
        <HoverTranslate />
        <Reasons />
        <Footer />
      </ActiveSectionContextProvider>
    </main>
  );
}
