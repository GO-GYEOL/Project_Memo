import { ToDoComponent } from "./components/page/item/todo.js";
import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { PageComponent, PageItemComponent } from "./components/page/page.js";
import { VideoComponent } from "./components/page/item/video.js";
import { InputDialog } from "./components/dialog/dialog.js";
import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";
import { BaseComponent } from "./components/component.js";

interface SectionInput<T> {
  new (): T;
}

class App {
  pageComponent: PageComponent;

  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.pageComponent = new PageComponent(PageItemComponent);
    this.pageComponent.attachTo(appRoot);

    this.pageComponent.addChild(new ToDoComponent("밥 새로 짓기", "완료"));
    this.pageComponent.addChild(new NoteComponent("운동가기", "오후 7시"));
    this.pageComponent.addChild(
      new VideoComponent("비디오1", "https://www.youtube.com/embed/tzIzcr4EM6w")
    );
    // this.pageComponent.addChild(
    //   new ImageComponent("이미지1", "https://picsum.photos/800/400.jpg")
    // );


    this.activeMainButton<MediaSectionInput>(
      "#new-image",
      MediaSectionInput,
      (input: MediaSectionInput) => {
        return new ImageComponent(input.title, input.url);
      }
    );
    this.activeMainButton<MediaSectionInput>(
      "#new-video",
      MediaSectionInput,
      (input: MediaSectionInput) => {
        return new VideoComponent(input.title, input.url);
      }
    );
    this.activeMainButton<TextSectionInput>(
      "#new-note",
      TextSectionInput,
      (input: TextSectionInput) => {
        return new NoteComponent(input.title, input.body);
      }
    );
    this.activeMainButton<TextSectionInput>(
      "#new-todo",
      TextSectionInput,
      (input: TextSectionInput) => {
        return new ToDoComponent(input.title, input.body);
      }
    );
  }

  activeMainButton<T extends TextSectionInput | MediaSectionInput>(
    selector: string,
    InputComponentConstructor: SectionInput<T>, // 여기서 결정
    makeComponent: (input: T) => BaseComponent
  ) {
    const button = document.querySelector(selector)! as HTMLButtonElement;
    button.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new InputComponentConstructor();

      dialog.addChild(inputSection);
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(this.dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        const data = makeComponent(inputSection);
        this.pageComponent.addChild(data);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  }
}

new App(document.querySelector(".document")!, document.body);
