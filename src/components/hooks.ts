import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { SectionName } from '@/lib/types';

import { useActiveSection } from '@/components/context/activeSectionContext';

export function useSectionInView(sectionName: SectionName, threshold = 0.75) {
  const { ref, inView } = useInView({
    threshold,
  });

  const { setActiveSection, timeOfLastClick } = useActiveSection();
  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection(sectionName);
    }
  }, [inView, sectionName, setActiveSection, timeOfLastClick]);

  return { ref };
}
