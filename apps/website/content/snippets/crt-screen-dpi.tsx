// #region ignore
import {
  crtDpiContentContainerStyles,
  crtDpiRootStyles,
  crtDpiScreenStyles,
  crtDpiScrollContainerStyles,
} from './crt-screen-dpi.css';
// #endregion ignore

// #region Device Pixel Ratio Sync
/**
 * Injects a script to keep the `--dpr` custom property on the root element
 * synchronized with `window.devicePixelRatio`, updating on resize or zoom.
 */
const devicePixelRatioScript = `
  const syncDevicePixelRatio = () => {
    document.documentElement.style.setProperty(
      '--dpr',
      String(window.devicePixelRatio || 1),
    );
  };

  syncDevicePixelRatio();
  window.addEventListener('resize', syncDevicePixelRatio);
`;
// #endregion Device Pixel Ratio Sync

// #region ignore
const paragraphs = [
  'The lines stay crisp because the repeat size is snapped to whole device pixels before CSS paints the gradient tile.',
  'Resize the viewport, change zoom, or move the window between monitors and the script refreshes the DPR custom property before the pattern drifts.',
  'The CRT shell is the same idea as the original experiment; this version isolates the pixel-locking fix so the source stays focused.',
];

const articleIds = [
  'sync',
  'snap',
  'paint',
  'resize',
  'zoom',
  'monitor',
];
// #endregion ignore

// #region ignore
export default function CRTScreenDpi() {
  return (
    <>
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: devicePixelRatioScript }}
      />
      <main className={crtDpiRootStyles}>
        <div className={crtDpiScreenStyles}>
          <div className={crtDpiScrollContainerStyles}>
            <div className={crtDpiContentContainerStyles}>
              {articleIds.map((articleId) => (
                <article key={articleId}>
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
// #endregion ignore
