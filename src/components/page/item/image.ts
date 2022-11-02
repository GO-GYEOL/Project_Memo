import { BaseComponent } from "../../component.js";

export class ImageComponent extends BaseComponent {
  constructor(title: string, url: string) {
    super(`<section class="image">
        <div class="image__holder">
        <img class="image__thumbnail">
        </div>
        <h2 class="page-item__title image__title"></h2>
      </section>`);

    const imageElement = this.element.querySelector(
      ".image__thumbnail"
    ) as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;
    // imageElement.src = "https://picsum.photos/800/400.jpg";
    // imageElement.alt = "이미지입니당";

    const titleElement = this.element.querySelector(
      ".image__title"
    )! as HTMLParagraphElement;
    titleElement.textContent = title;
  }
}
