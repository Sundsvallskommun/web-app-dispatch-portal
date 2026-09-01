import { useEffect, useState } from 'react';
import axios from 'axios';
import { appURL } from '@utils/app-url';

interface Version {
  commit: string;
  branch: string;
  buildTime: string;
}

export const VersionInfo = () => {
  const [version, setVersion] = useState<Version | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<Version>(appURL('/version.json'), { signal: controller.signal })
      .then((res) => setVersion(res.data))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  if (!version?.commit) return null;

  const built = version.buildTime ? new Date(version.buildTime).toLocaleString('sv-SE') : '';

  return (
    <div className="text-dark-disabled px-16 py-8 text-center select-text" title={built ? `Byggd ${built}` : undefined}>
      <p className="text-xs">
        {version.branch} @ {version.commit}
      </p>
    </div>
  );
};

export default VersionInfo;
