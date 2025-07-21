import * as tls from 'tls';
import * as url from 'url';

export async function getSSLCertificateExpiry(targetUrl: string): Promise<Date | null> {
  return new Promise((resolve) => {
    try {
      const { hostname, port } = new url.URL(targetUrl);
      const socket = tls.connect(
        {
          host: hostname,
          port: port ? parseInt(port, 10) : 443,
          servername: hostname,
          rejectUnauthorized: false,
        },
        () => {
          const cert = socket.getPeerCertificate();
          if (cert && cert.valid_to) {
            resolve(new Date(cert.valid_to));
          } else {
            resolve(null);
          }
          socket.end();
        }
      );

      socket.on('error', () => resolve(null));
    } catch {
      resolve(null);
    }
  });
}
