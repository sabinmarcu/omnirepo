/* eslint-disable max-len */
// #region ignore
import {
  crtContentContainerStyles,
  crtRootStyles,
  crtScreenStyles,
  crtScrollContainerStyles,
} from './crt-screen.css';
// #endregion ignore

// #variant wide
export default function CRTScreen() {
  return (
    <main className={crtRootStyles}>
      <div className={crtScreenStyles}>
        <div className={crtScrollContainerStyles}>
          <div className={crtContentContainerStyles}>
            {Array.from({ length: 10 }).map((_, index) => (
              <article key={index}>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos perferendis quibusdam omnis, laboriosam distinctio hic alias facilis dicta animi nihil ipsam porro tempore molestias velit rerum corrupti iste labore inventore!</p>
                <p>Ipsam animi cumque consectetur quibusdam, corrupti, vitae ratione, cum ad in exercitationem ut nostrum quos aperiam laudantium nobis amet incidunt et voluptatem nulla doloribus mollitia fugit. Deserunt numquam aperiam consequuntur.</p>
                <p>Quibusdam sint excepturi quas expedita nobis eum unde, ratione, omnis molestias accusamus atque, a id! Dignissimos facilis commodi rerum nulla odit maiores cupiditate debitis reiciendis perferendis. Reiciendis eveniet expedita hic.</p>
                <p>Facilis ducimus quaerat corrupti obcaecati perferendis rem esse neque iste suscipit asperiores, est ipsum commodi blanditiis ipsa voluptas eligendi, quisquam aut? Deleniti sequi itaque a, autem at eos similique sint.</p>
                <p>Asperiores fuga dolore saepe dignissimos veritatis esse necessitatibus delectus, quibusdam molestias incidunt eligendi perspiciatis tempora est nulla repellendus eaque voluptate iusto sed accusamus id quos itaque, eum ratione ullam? Aliquid.</p>
             </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
