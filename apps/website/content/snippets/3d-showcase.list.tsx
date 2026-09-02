// #region ignore Imports
import { showcaseListStyles } from './3d-showcase.css';
import { ShowcaseItem } from './3d-showcase.item';
// #endregion

// #region Data
export const items = [
  'https://www.igroshop.com/images/detailed/4/Wolfenstein_the_new_colossus_box_art.jpg',
  'https://image.api.playstation.com/vulcan/ap/rnd/202010/0605/s9anMLJErDUXJTbBOoKSiqiv.png',
  'https://static.wikia.nocookie.net/wolfenstein/images/3/39/WTOB_Cover.jpg',
];
// #endregion

// #region Render
export function ShowcaseList() {
  return (
    <section className={showcaseListStyles}>
      {items.map((item) => (
        <ShowcaseItem src={item} key={item} />
      ))}
    </section>
  );
}
// #endregion
